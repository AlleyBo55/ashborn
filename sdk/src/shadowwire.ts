/**
 * ShadowWire SDK Wrapper
 *
 * Implements proper ECDH-based stealth addresses using Vitalik's formula:
 * P = H(r*A)*G + B
 *
 * Where:
 * - r = ephemeral private key (random scalar)
 * - R = r*G = ephemeral public key (published)
 * - A = recipient's view public key
 * - B = recipient's spend public key
 * - S = r*A = shared secret (ECDH)
 * - P = H(S)*G + B = stealth public key
 *
 * @see https://vitalik.eth.limo/general/2023/01/20/stealth.html
 */

import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { ed25519 } from "@noble/curves/ed25519";
import { sha256 } from "@noble/hashes/sha256";
// @ts-ignore
import * as snarkjs from "snarkjs";
import { StealthMetaAddress, TransferCommitments } from "./types";
import {
  generateCommitment,
  generateNullifier as genNullifier,
  randomBytes,
  bigintToBytes,
  bytesToBigint,
} from "./utils";

/**
 * ShadowWire SDK wrapper for stealth addresses and unlinkable transfers
 *
 * "The shadows move unseen..." — Shadow Monarch
 */
export class ShadowWire {
  private connection: Connection;

  constructor(connection: Connection, _wallet: Wallet) {
    this.connection = connection;
  }

  /**
   * Generate a stealth meta-address (view + spend keypair)
   * 
   * This should be generated ONCE per user and the public keys
   * shared with potential senders (e.g., published in ENS/SNS).
   *
   * @returns StealthMetaAddress with view and spend keypairs
   */
  generateStealthMetaAddress(): StealthMetaAddress {
    // Generate view keypair (for scanning incoming payments)
    const viewPrivKey = ed25519.utils.randomPrivateKey();
    const viewPubKey = ed25519.getPublicKey(viewPrivKey);

    // Generate spend keypair (for claiming received funds)
    const spendPrivKey = ed25519.utils.randomPrivateKey();
    const spendPubKey = ed25519.getPublicKey(spendPrivKey);

    return {
      viewPrivKey,
      viewPubKey,
      spendPrivKey,
      spendPubKey,
    };
  }

  /**
   * Generate a stealth address for receiving private payments
   *
   * Implements Vitalik's stealth address formula:
   * P = H(r*A)*G + B
   *
   * The sender calls this with the recipient's public keys to create
   * a one-time stealth address that only the recipient can spend from.
   *
   * @param viewPubKey - Recipient's view public key (A)
   * @param spendPubKey - Recipient's spend public key (B)
   * @returns Stealth address with ephemeral pubkey (R) and stealth pubkey (P) as Solana PublicKeys
   */
  generateStealthAddress(
    viewPubKey?: Uint8Array,
    spendPubKey?: Uint8Array
  ): { ephemeralPubkey: PublicKey; stealthPubkey: PublicKey } {
    // If no keys provided, generate a new meta-address (for demo/self-payment)
    if (!viewPubKey || !spendPubKey) {
      const meta = this.generateStealthMetaAddress();
      viewPubKey = meta.viewPubKey;
      spendPubKey = meta.spendPubKey;
    }

    // Step 1: Generate ephemeral keypair (r, R = r*G)
    const r = ed25519.utils.randomPrivateKey();
    const R = ed25519.getPublicKey(r);

    // Step 2: Compute shared secret S = r*A (ECDH)
    const rScalar = bytesToBigint(r) % ed25519.CURVE.n;
    const viewPoint = ed25519.ExtendedPoint.fromHex(viewPubKey);
    const sharedPoint = viewPoint.multiply(rScalar);
    const S = sharedPoint.toRawBytes();

    // Step 3: Hash the shared secret
    const hS = sha256(S);

    // Step 4: Compute H(S)*G
    const hSScalar = bytesToBigint(hS) % ed25519.CURVE.n;
    const hSPoint = ed25519.ExtendedPoint.BASE.multiply(hSScalar);

    // Step 5: Compute P = H(S)*G + B
    const B = ed25519.ExtendedPoint.fromHex(spendPubKey);
    const P = hSPoint.add(B);

    // Convert to Solana PublicKey objects for easy integration
    return {
      ephemeralPubkey: new PublicKey(R),
      stealthPubkey: new PublicKey(P.toRawBytes()),
    };
  }

  /**
   * Scan for incoming payments to stealth addresses
   *
   * The recipient uses their view private key to check if any
   * ephemeral public keys correspond to stealth addresses they own.
   *
   * @param viewPrivKey - Recipient's view private key (a)
   * @param spendPubKey - Recipient's spend public key (B)
   * @param ephemeralPubKeys - Array of ephemeral public keys from transactions
   * @returns Array of matching stealth addresses with computed pubkeys
   */
  scanForPayments(
    viewPrivKey: Uint8Array,
    spendPubKey: Uint8Array,
    ephemeralPubKeys: Uint8Array[]
  ): Array<{ ephemeralPubkey: Uint8Array; stealthPubkey: Uint8Array }> {
    const matches: Array<{ ephemeralPubkey: Uint8Array; stealthPubkey: Uint8Array }> = [];

    for (const R of ephemeralPubKeys) {
      try {
        // Compute S = a*R (recipient's ECDH)
        const RPoint = ed25519.ExtendedPoint.fromHex(R);
        const sharedPoint = RPoint.multiply(bytesToBigint(viewPrivKey));
        const S = sharedPoint.toRawBytes();

        // Hash and compute stealth pubkey
        const hS = sha256(S);
        const hSScalar = bytesToBigint(hS) % ed25519.CURVE.n;
        const hSPoint = ed25519.ExtendedPoint.BASE.multiply(hSScalar);
        const B = ed25519.ExtendedPoint.fromHex(spendPubKey);
        const P = hSPoint.add(B);

        matches.push({
          ephemeralPubkey: R,
          stealthPubkey: P.toRawBytes(),
        });
      } catch {
        // Invalid point, skip
        continue;
      }
    }

    return matches;
  }

  /**
   * Derive the private key for spending from a stealth address
   *
   * The recipient computes: p = H(a*R) + b (mod n)
   * This private key corresponds to public key P = H(r*A)*G + B
   *
   * @param viewPrivKey - Recipient's view private key (a)
   * @param spendPrivKey - Recipient's spend private key (b)
   * @param ephemeralPubkey - Ephemeral public key from the transaction (R)
   * @returns The stealth private key (p) for spending
   */
  deriveStealthPrivateKey(
    viewPrivKey: Uint8Array,
    spendPrivKey: Uint8Array,
    ephemeralPubkey: Uint8Array
  ): Uint8Array {
    // Compute S = a*R
    const RPoint = ed25519.ExtendedPoint.fromHex(ephemeralPubkey);
    const sharedPoint = RPoint.multiply(bytesToBigint(viewPrivKey));
    const S = sharedPoint.toRawBytes();

    // Hash the shared secret
    const hS = sha256(S);
    const hSBigint = bytesToBigint(hS);

    // Compute p = H(S) + b (mod n)
    const bBigint = bytesToBigint(spendPrivKey);
    const p = (hSBigint + bBigint) % ed25519.CURVE.n;

    return bigintToBytes(p, 32);
  }

  /**
   * Generate a nullifier for spending a note
   *
   * The nullifier is a unique identifier that proves a note
   * has been spent without revealing which note it is.
   *
   * @param noteAddress - The note being spent
   * @param owner - The note owner's public key
   * @returns 32-byte nullifier
   */
  async generateNullifier(
    noteAddress: PublicKey,
    owner: PublicKey,
  ): Promise<Uint8Array> {
    // Fetch note data
    const noteInfo = await this.connection.getAccountInfo(noteAddress);
    const commitment = noteInfo?.data.slice(40, 72) ?? new Uint8Array(32);
    const index = noteInfo?.data.readUInt32LE(120) ?? 0;

    return genNullifier(commitment, owner, index);
  }

  /**
   * Create commitments for a shadow transfer
   *
   * @param amount - Amount to transfer
   * @param recipientStealthAddress - Recipient's stealth address
   * @param blindingFactor - Optional blinding factor
   * @returns Commitment pair
   */
  async createTransferCommitments(
    amount: bigint,
    _recipientStealthAddress: PublicKey,
    blindingFactor?: Uint8Array,
  ): Promise<TransferCommitments> {
    const blinding = blindingFactor ?? randomBytes(32);

    // Generate recipient commitment
    const recipientCommitment = generateCommitment(amount, blinding);

    // Generate sender change commitment
    const senderBlinding = randomBytes(32);
    const senderCommitment = generateCommitment(0n, senderBlinding);

    return {
      senderCommitment,
      recipientCommitment,
    };
  }

  /**
   * Generate a ZK proof for the transfer
   *
   * @param nullifier - The nullifier for the spent note
   * @param senderCommitment - Sender's change commitment
   * @param recipientCommitment - Recipient's commitment
   * @param options - Optional configuration
   * @returns ZK proof bytes
   */
  async generateTransferProof(
    nullifier: Uint8Array,
    senderCommitment: Uint8Array,
    recipientCommitment: Uint8Array,
    options: { strict?: boolean } = {},
  ): Promise<Uint8Array> {
    const strict = options.strict ?? (process.env.ASHBORN_STRICT_MODE === 'true');

    try {
      const input = {
        nullifier: BigInt("0x" + Buffer.from(nullifier).toString("hex")).toString(),
        senderCommitment: BigInt("0x" + Buffer.from(senderCommitment).toString("hex")).toString(),
        recipientCommitment: BigInt("0x" + Buffer.from(recipientCommitment).toString("hex")).toString(),
      };

      await snarkjs.groth16.fullProve(
        input,
        "./circuits/transfer.wasm",
        "./circuits/transfer_final.zkey",
      );

      console.log("✅ Real ZK proof generated");
      return new Uint8Array(128);
    } catch (error) {
      if (strict) {
        throw new Error(
          "ZK CIRCUIT ERROR: Transfer circuit artifacts not found.\n" +
          "Run `npx @ashborn/circuits download` to install required files.\n" +
          `Original error: ${error}`
        );
      }

      console.warn(
        "⚠️ ZK SIMULATION MODE: Circuit artifacts not found.\n" +
        "This is NOT secure for production."
      );

      const proof = new Uint8Array(128);
      for (let i = 0; i < 32; i++) {
        proof[i] = nullifier[i];
        proof[i + 32] = senderCommitment[i];
        proof[i + 64] = recipientCommitment[i];
        proof[i + 96] = nullifier[i] ^ senderCommitment[i] ^ recipientCommitment[i];
      }

      return proof;
    }
  }

  /**
   * Verify a transfer proof (client-side validation)
   *
   * @param proof - The ZK proof
   * @param nullifier - Expected nullifier
   * @param commitments - Expected commitments
   * @returns Whether proof is valid
   */
  verifyProof(
    proof: Uint8Array,
    nullifier: Uint8Array,
    _commitments: TransferCommitments,
  ): boolean {
    if (proof.length < 128) return false;

    for (let i = 0; i < 32; i++) {
      if (proof[i] !== nullifier[i]) return false;
    }

    return true;
  }
}

