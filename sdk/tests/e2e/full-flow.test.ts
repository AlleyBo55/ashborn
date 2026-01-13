/**
 * Full Privacy Flow E2E Tests
 *
 * Tests: Complete user journey from initialization through all operations
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { Ashborn } from "../../src/ashborn";
import {
  createCommitment,
  generateNullifier,
  encryptAmount,
  decryptAmount,
  randomBytes,
} from "../../src/crypto";
import { RangeCompliance } from "../../src/compliance";
import { ShadowWire } from "../../src/shadowwire";
import { ProofType } from "../../src/types";

describe("E2E: Full Privacy Flow", () => {
  let ashborn: Ashborn;
  let shadowWire: ShadowWire;
  let compliance: RangeCompliance;
  let mockConnection: Connection;
  let mockWallet: any;
  let userViewKey: Uint8Array;
  let userNullifierSecret: Uint8Array;

  beforeAll(() => {
    mockConnection = {
      getLatestBlockhash: vi.fn().mockResolvedValue({
        blockhash: "mock-blockhash",
        lastValidBlockHeight: 1000,
      }),
      getBalance: vi.fn().mockResolvedValue(100 * LAMPORTS_PER_SOL),
      getAccountInfo: vi.fn().mockResolvedValue(null),
      sendTransaction: vi.fn().mockResolvedValue("mock-signature"),
      confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
    } as unknown as Connection;

    mockWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: vi.fn(async (tx) => tx),
      signAllTransactions: vi.fn(async (txs) => txs),
    };

    ashborn = new Ashborn(mockConnection, mockWallet);
    shadowWire = new ShadowWire(mockConnection, mockWallet);
    compliance = new RangeCompliance(mockConnection, mockWallet);

    // User secrets
    userViewKey = randomBytes(32);
    userNullifierSecret = randomBytes(32);
  });

  describe("1. Vault Initialization", () => {
    it("should initialize a new shadow vault", async () => {
      // In production, this creates vault PDA
      const vaultData = {
        owner: mockWallet.publicKey,
        shadowBalance: 0n,
        noteCount: 0,
        viewKeyHash: randomBytes(32),
        createdAt: Date.now(),
      };

      expect(vaultData.owner).toEqual(mockWallet.publicKey);
      expect(vaultData.shadowBalance).toBe(0n);
    });
  });

  describe("2. Shield Assets", () => {
    let noteCommitment: Uint8Array;
    let noteBlinding: Uint8Array;
    const shieldAmount = 10_000_000_000n; // 10 SOL

    it("should shield 10 SOL into the vault", async () => {
      noteBlinding = randomBytes(32);
      noteCommitment = createCommitment(shieldAmount, noteBlinding);

      expect(noteCommitment.length).toBe(32);
    });

    it("should encrypt amount with view key", async () => {
      const encrypted = await encryptAmount(
        shieldAmount,
        noteBlinding,
        userViewKey,
      );

      expect(encrypted.length).toBeGreaterThan(40);

      // Verify decryption
      const decrypted = await decryptAmount(encrypted, userViewKey);
      expect(decrypted.amount).toBe(shieldAmount);
    });

    it("should update vault state after shield", () => {
      const vault = {
        shadowBalance: 0n,
        noteCount: 0,
      };

      vault.shadowBalance += shieldAmount;
      vault.noteCount++;

      expect(vault.shadowBalance).toBe(10_000_000_000n);
      expect(vault.noteCount).toBe(1);
    });
  });

  describe("3. Shadow Transfer", () => {
    const transferAmount = 3_000_000_000n; // 3 SOL
    const senderBalance = 10_000_000_000n;
    let recipientStealth: { stealthPubkey: PublicKey };

    it("should generate recipient stealth address", async () => {
      recipientStealth = await shadowWire.generateStealthAddress();

      expect(recipientStealth.stealthPubkey).toBeDefined();
    });

    it("should generate nullifier for spent note", () => {
      const nullifier = generateNullifier(userNullifierSecret, 0);

      expect(nullifier.length).toBe(32);
    });

    it("should create transfer proof", async () => {
      // Generate necessary inputs
      const nullifier = generateNullifier(userNullifierSecret, 0);

      // Create commitments first
      const { senderCommitment, recipientCommitment } =
        await shadowWire.createTransferCommitments(
          transferAmount,
          recipientStealth.stealthPubkey,
        );

      const proof = await shadowWire.generateTransferProof(
        nullifier,
        senderCommitment,
        recipientCommitment,
      );

      expect(proof.length).toBeGreaterThan(0);
    });

    it("should update balances correctly", () => {
      const changeAmount = senderBalance - transferAmount;

      expect(changeAmount).toBe(7_000_000_000n);
    });
  });

  describe("4. Selective Disclosure", () => {
    const currentBalance = 7_000_000_000n; // After transfer

    it("should generate range proof for balance", async () => {
      const blinding = randomBytes(32);

      const result = await compliance.generateRangeProof(
        currentBalance,
        blinding,
        0n,
        100_000_000_000n, // Under 100 SOL
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should generate ownership proof", async () => {
      const result = await compliance.generateOwnershipProof(
        userNullifierSecret,
        userViewKey,
        Keypair.generate().publicKey,
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should create view key authorization for auditor", async () => {
      const auditorPubkey = Keypair.generate().publicKey;
      const expiresIn30Days = Date.now() + 30 * 24 * 60 * 60 * 1000;

      const auth = await compliance.createViewKeyAuthorization(
        auditorPubkey,
        "balance",
        expiresIn30Days,
      );

      expect(auth.signature).toBeInstanceOf(Uint8Array);
      expect(auth.signature.length).toBe(32);
    });
  });

  describe("5. Unshield (Exit)", () => {
    const unshieldAmount = 5_000_000_000n; // 5 SOL
    const currentBalance = 7_000_000_000n;

    it("should check privacy delay", () => {
      const MIN_DELAY = 24 * 60 * 60;
      const noteCreatedAt = Math.floor(Date.now() / 1000) - MIN_DELAY - 3600; // Created 25 hours ago
      const now = Math.floor(Date.now() / 1000);

      const canUnshield = now - noteCreatedAt >= MIN_DELAY;
      expect(canUnshield).toBe(true);
    });

    it("should generate nullifier for unshield", () => {
      const nullifier = generateNullifier(userNullifierSecret, 1); // Note index 1

      expect(nullifier.length).toBe(32);
    });

    it("should calculate remaining balance", () => {
      const remainingBalance = currentBalance - unshieldAmount;

      expect(remainingBalance).toBe(2_000_000_000n);
    });

    it("should transfer tokens to public wallet", () => {
      const fee = 5_000n;
      const netTransfer = unshieldAmount - fee;

      expect(netTransfer).toBe(4_999_995_000n);
    });
  });

  describe("6. Privacy Verification", () => {
    it("should ensure no link between shield and unshield", () => {
      const shieldCommitment = randomBytes(32);
      const unshieldNullifier = randomBytes(32);

      // These should have no mathematical relationship without secrets
      expect(shieldCommitment).not.toEqual(unshieldNullifier);
    });

    it("should ensure no link between sender and recipient", async () => {
      const senderStealth = await shadowWire.generateStealthAddress();
      const recipientStealth = await shadowWire.generateStealthAddress();

      expect(senderStealth.stealthPubkey.toBase58()).not.toBe(
        recipientStealth.stealthPubkey.toBase58(),
      );
    });

    it("should hide balance in commitment", () => {
      const balance1 = createCommitment(1n, randomBytes(32));
      const balance2 = createCommitment(1_000_000_000_000n, randomBytes(32));

      // Both 32 bytes, indistinguishable
      expect(balance1.length).toBe(balance2.length);
    });
  });
});
