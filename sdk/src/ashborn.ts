/**
 * Core Ashborn SDK class - The unified privacy interface
 *
 * "I alone level up." — Sung Jin-Woo
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { ShadowWire } from "./shadowwire";
import { PrivacyCash } from "./privacycash";
import { RangeCompliance } from "./compliance";
import {
  AshbornConfig,
  ShieldParams,
  TransferParams,
  RevealParams,
  UnshieldParams,
  ShadowVault,
  ShieldedNote,
  ProofType,
} from "./types";
import { PROGRAM_ID, SEEDS } from "./constants";

/**
 * Main Ashborn SDK class
 *
 * Provides a unified interface for all privacy operations:
 * - Initialize shadow vaults
 * - Shield assets into the privacy pool
 * - Execute unlinkable shadow transfers
 * - Generate selective disclosure proofs
 * - Unshield assets back to public Solana
 */
export class Ashborn {
  private connection: Connection;
  private wallet: Wallet;
  private provider: AnchorProvider;
  private programId: PublicKey;

  // SDK integrations
  public shadowWire: ShadowWire;
  public privacyCash: PrivacyCash;
  public rangeCompliance: RangeCompliance;

  /**
   * Create a new Ashborn SDK instance
   *
   * @param connection - Solana connection
   * @param wallet - User's wallet
   * @param config - Optional configuration
   */
  constructor(
    connection: Connection,
    wallet: Wallet,
    config?: Partial<AshbornConfig>,
  ) {
    this.connection = connection;
    this.wallet = wallet;
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.programId = config?.programId ?? PROGRAM_ID;

    // Initialize SDK integrations
    this.shadowWire = new ShadowWire(connection, wallet);
    this.privacyCash = new PrivacyCash(connection, wallet);
    this.rangeCompliance = new RangeCompliance(connection, wallet);
  }

  /**
   * Get the user's shadow vault PDA
   */
  getVaultAddress(): PublicKey {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEEDS.SHADOW_VAULT), this.wallet.publicKey.toBuffer()],
      this.programId,
    );
    return vaultPda;
  }

  /**
   * Get a shielded note PDA
   */
  getNoteAddress(vaultAddress: PublicKey, index: number): PublicKey {
    const [notePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(SEEDS.SHIELDED_NOTE),
        vaultAddress.toBuffer(),
        new BN(index).toArrayLike(Buffer, "le", 4),
      ],
      this.programId,
    );
    return notePda;
  }

  /**
   * Initialize a shadow vault for the connected wallet
   *
   * The vault is the user's personal privacy fortress.
   * All shielded assets and privacy metadata flow through it.
   *
   * @returns Transaction signature
   */
  async initializeVault(): Promise<string> {
    const vaultAddress = this.getVaultAddress();

    const tx = new Transaction().add(
      await this.createInitializeVaultInstruction(vaultAddress),
    );

    const signature = await this.provider.sendAndConfirm(tx);
    console.log("Shadow Vault initialized:", vaultAddress.toBase58());
    console.log("The shadows await your command...");

    return signature;
  }

  /**
   * Shield assets into the privacy pool
   *
   * Integrates with Privacy Cash SDK for confidential deposits.
   * Creates an encrypted note with amount commitment.
   *
   * @param params - Shield parameters
   * @returns Transaction signature and note address
   */
  async shield(params: ShieldParams): Promise<{
    signature: string;
    noteAddress: PublicKey;
    commitment: Uint8Array;
  }> {
    const { amount, mint, blindingFactor } = params;

    // Generate commitment using Privacy Cash SDK
    const commitment = await this.privacyCash.createShieldCommitment(
      amount,
      blindingFactor ?? Keypair.generate().secretKey.slice(0, 32),
    );

    const vaultAddress = this.getVaultAddress();
    const vault = await this.getVault();
    const noteAddress = this.getNoteAddress(
      vaultAddress,
      vault?.noteCount ?? 0,
    );

    const tx = new Transaction().add(
      await this.createShieldInstruction(
        vaultAddress,
        noteAddress,
        amount,
        commitment,
        mint,
      ),
    );

    const signature = await this.provider.sendAndConfirm(tx);
    console.log("Assets shielded:", amount.toString());
    console.log("Note created:", noteAddress.toBase58());
    console.log("The shadows grow stronger...");

    return { signature, noteAddress, commitment };
  }

  /**
   * Execute a shadow transfer - unlinkable P2P payment
   *
   * Integrates with ShadowWire for stealth addresses.
   * Uses nullifiers to prevent double-spending.
   *
   * @param params - Transfer parameters
   * @returns Transaction signature
   */
  async shadowTransfer(params: TransferParams): Promise<string> {
    const {
      sourceNoteAddress,
      amount,
      recipientStealthAddress,
      blindingFactor,
    } = params;

    // Generate nullifier using ShadowWire
    const nullifier = await this.shadowWire.generateNullifier(
      sourceNoteAddress,
      this.wallet.publicKey,
    );

    // Generate new commitments
    const { senderCommitment, recipientCommitment } =
      await this.shadowWire.createTransferCommitments(
        amount,
        recipientStealthAddress,
        blindingFactor,
      );

    // Generate ZK proof
    const proof = await this.shadowWire.generateTransferProof(
      nullifier,
      senderCommitment,
      recipientCommitment,
    );

    const vaultAddress = this.getVaultAddress();

    const tx = new Transaction().add(
      await this.createTransferInstruction(
        vaultAddress,
        sourceNoteAddress,
        nullifier,
        senderCommitment,
        recipientCommitment,
        proof,
      ),
    );

    const signature = await this.provider.sendAndConfirm(tx);
    console.log("Shadow transfer executed");
    console.log("The shadows have moved...");

    return signature;
  }

  /**
   * Generate selective disclosure proof
   *
   * Integrates with Range Compliance for regulatory compliance.
   * Proves statements about balances without revealing exact amounts.
   *
   * @param params - Reveal parameters
   * @returns Transaction signature and proof data
   */
  async generateProof(params: RevealParams): Promise<{
    signature: string;
    proofData: Uint8Array;
  }> {
    const { proofType, rangeMin, rangeMax, statement } = params;

    // Generate proof using Range Compliance SDK
    const proofData = await this.rangeCompliance.generateProof({
      type: proofType,
      rangeMin,
      rangeMax,
      statement,
      vaultAddress: this.getVaultAddress(),
    });

    const vaultAddress = this.getVaultAddress();

    const tx = new Transaction().add(
      await this.createRevealInstruction(
        vaultAddress,
        proofType,
        rangeMin ?? 0n,
        rangeMax ?? BigInt(Number.MAX_SAFE_INTEGER),
        proofData,
      ),
    );

    const signature = await this.provider.sendAndConfirm(tx);
    console.log("Compliance proof generated");
    console.log("The shadows speak only what they choose to reveal...");

    return { signature, proofData };
  }

  /**
   * Unshield assets back to public Solana
   *
   * Exit the shadow realm with a valid nullifier proof.
   *
   * @param params - Unshield parameters
   * @returns Transaction signature
   */
  async unshield(params: UnshieldParams): Promise<string> {
    const { sourceNoteAddress, amount, destinationTokenAccount } = params;

    // Generate nullifier
    const nullifier = await this.shadowWire.generateNullifier(
      sourceNoteAddress,
      this.wallet.publicKey,
    );

    // Generate withdrawal proof
    const proof = await this.privacyCash.generateWithdrawalProof(
      amount,
      nullifier,
    );

    const vaultAddress = this.getVaultAddress();

    const tx = new Transaction().add(
      await this.createUnshieldInstruction(
        vaultAddress,
        sourceNoteAddress,
        amount,
        nullifier,
        proof,
        destinationTokenAccount,
      ),
    );

    const signature = await this.provider.sendAndConfirm(tx);
    console.log("Assets unshielded:", amount.toString());
    console.log("Exiting the shadow realm...");

    return signature;
  }

  /**
   * Get the user's shadow vault
   */
  async getVault(): Promise<ShadowVault | null> {
    try {
      const vaultAddress = this.getVaultAddress();
      const accountInfo = await this.connection.getAccountInfo(vaultAddress);

      if (!accountInfo) return null;

      // Decode vault data (simplified for demo)
      return {
        owner: new PublicKey(accountInfo.data.slice(8, 40)),
        bump: accountInfo.data[40],
        shadowBalance: new BN(accountInfo.data.slice(41, 49), "le"),
        noteCount: accountInfo.data.readUInt32LE(49),
        viewKeyHash: accountInfo.data.slice(53, 85),
        createdAt: new BN(accountInfo.data.slice(85, 93), "le"),
        lastActivity: new BN(accountInfo.data.slice(93, 101), "le"),
      };
    } catch {
      return null;
    }
  }

  /**
   * Get a shielded note
   */
  async getNote(noteAddress: PublicKey): Promise<ShieldedNote | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(noteAddress);

      if (!accountInfo) return null;

      return {
        vault: new PublicKey(accountInfo.data.slice(8, 40)),
        commitment: accountInfo.data.slice(40, 72),
        encryptedAmount: accountInfo.data.slice(72, 120),
        index: accountInfo.data.readUInt32LE(120),
        spent: accountInfo.data[124] === 1,
        createdAt: new BN(accountInfo.data.slice(125, 133), "le"),
        bump: accountInfo.data[133],
      };
    } catch {
      return null;
    }
  }

  // ============ Private instruction builders ============

  private async createInitializeVaultInstruction(
    vaultAddress: PublicKey,
  ): Promise<TransactionInstruction> {
    // Instruction discriminator for initialize_vault
    const discriminator = Buffer.from([48, 191, 163, 44, 71, 129, 63, 164]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vaultAddress, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: discriminator,
    });
  }

  private async createShieldInstruction(
    vaultAddress: PublicKey,
    noteAddress: PublicKey,
    amount: bigint,
    commitment: Uint8Array,
    _mint: PublicKey,
  ): Promise<TransactionInstruction> {
    const discriminator = Buffer.from([183, 32, 140, 112, 165, 224, 91, 214]);

    const data = Buffer.concat([
      discriminator,
      new BN(amount.toString()).toArrayLike(Buffer, "le", 8),
      Buffer.from(commitment),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vaultAddress, isSigner: false, isWritable: true },
        { pubkey: noteAddress, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }

  private async createTransferInstruction(
    vaultAddress: PublicKey,
    sourceNoteAddress: PublicKey,
    nullifier: Uint8Array,
    senderCommitment: Uint8Array,
    recipientCommitment: Uint8Array,
    proof: Uint8Array,
  ): Promise<TransactionInstruction> {
    const discriminator = Buffer.from([163, 52, 200, 231, 140, 3, 69, 186]);

    const data = Buffer.concat([
      discriminator,
      Buffer.from(nullifier),
      Buffer.from(senderCommitment),
      Buffer.from(recipientCommitment),
      new BN(proof.length).toArrayLike(Buffer, "le", 4),
      Buffer.from(proof),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vaultAddress, isSigner: false, isWritable: true },
        { pubkey: sourceNoteAddress, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }

  private async createRevealInstruction(
    vaultAddress: PublicKey,
    proofType: ProofType,
    rangeMin: bigint,
    rangeMax: bigint,
    proofData: Uint8Array,
  ): Promise<TransactionInstruction> {
    const discriminator = Buffer.from([232, 103, 97, 145, 89, 186, 64, 25]);

    const data = Buffer.concat([
      discriminator,
      Buffer.from([proofType]),
      new BN(rangeMin.toString()).toArrayLike(Buffer, "le", 8),
      new BN(rangeMax.toString()).toArrayLike(Buffer, "le", 8),
      new BN(proofData.length).toArrayLike(Buffer, "le", 4),
      Buffer.from(proofData),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vaultAddress, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }

  private async createUnshieldInstruction(
    vaultAddress: PublicKey,
    sourceNoteAddress: PublicKey,
    amount: bigint,
    nullifier: Uint8Array,
    proof: Uint8Array,
    _destinationTokenAccount: PublicKey,
  ): Promise<TransactionInstruction> {
    const discriminator = Buffer.from([105, 81, 184, 212, 192, 23, 99, 41]);

    const data = Buffer.concat([
      discriminator,
      new BN(amount.toString()).toArrayLike(Buffer, "le", 8),
      Buffer.from(nullifier),
      new BN(proof.length).toArrayLike(Buffer, "le", 4),
      Buffer.from(proof),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vaultAddress, isSigner: false, isWritable: true },
        { pubkey: sourceNoteAddress, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }
}
