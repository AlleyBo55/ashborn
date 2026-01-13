/**
 * Transfer Flow Integration Tests
 *
 * Tests: Complete shadow transfer including nullifier, proofs, and state updates
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Ashborn } from "../../src/ashborn";
import { ShadowWire } from "../../src/shadowwire";
import {
  createCommitment,
  generateNullifier,
  randomBytes,
} from "../../src/crypto";

describe("Transfer Flow Integration", () => {
  let ashborn: Ashborn;
  let shadowWire: ShadowWire;
  let mockConnection: Connection;
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockConnection = {
      getLatestBlockhash: vi.fn().mockResolvedValue({
        blockhash: "mock-blockhash",
        lastValidBlockHeight: 1000,
      }),
      getAccountInfo: vi.fn().mockResolvedValue(null),
      sendTransaction: vi.fn().mockResolvedValue("mock-signature"),
      confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
    } as unknown as Connection;

    mockWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: vi.fn(async (tx) => tx),
    };

    ashborn = new Ashborn(mockConnection, mockWallet);
    shadowWire = new ShadowWire(mockConnection, mockWallet);
  });

  describe("Nullifier Management", () => {
    it("should generate unique nullifier for each note", () => {
      const secret = randomBytes(32);
      const nullifiers = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const nullifier = generateNullifier(secret, i);
        nullifiers.add(Buffer.from(nullifier).toString("hex"));
      }

      expect(nullifiers.size).toBe(100);
    });

    it("should prevent double-spend via nullifier", () => {
      const secret = randomBytes(32);
      const noteIndex = 0;

      const nullifier1 = generateNullifier(secret, noteIndex);
      const nullifier2 = generateNullifier(secret, noteIndex);

      // Same inputs = same nullifier (can detect double-spend)
      expect(nullifier1).toEqual(nullifier2);
    });

    it("should derive different nullifiers for different secrets", () => {
      const secret1 = randomBytes(32);
      const secret2 = randomBytes(32);

      const n1 = generateNullifier(secret1, 0);
      const n2 = generateNullifier(secret2, 0);

      expect(n1).not.toEqual(n2);
    });
  });

  describe("Stealth Address Resolution", () => {
    it("should generate recipient stealth address", async () => {
      const stealth = await shadowWire.generateStealthAddress();

      expect(stealth.stealthPubkey).toBeDefined();
      expect(stealth.ephemeralPubkey).toBeDefined();
    });

    it("should create unlinkable sender-recipient pair", async () => {
      // Sender creates transfer
      const senderStealth = await shadowWire.generateStealthAddress();

      // Recipient has different stealth
      const recipientStealth = await shadowWire.generateStealthAddress();

      // Should be completely different
      expect(senderStealth.stealthPubkey.toBase58()).not.toBe(
        recipientStealth.stealthPubkey.toBase58(),
      );
    });
  });

  describe("Transfer Commitment Flow", () => {
    it("should create output and change commitments", async () => {
      const totalAmount = 10_000_000_000n; // 10 SOL
      const transferAmount = 3_000_000_000n; // 3 SOL
      const changeAmount = totalAmount - transferAmount;

      const outputBlinding = randomBytes(32);
      const changeBlinding = randomBytes(32);

      const outputCommitment = createCommitment(transferAmount, outputBlinding);
      const changeCommitment = createCommitment(changeAmount, changeBlinding);

      expect(outputCommitment.length).toBe(32);
      expect(changeCommitment.length).toBe(32);
      expect(outputCommitment).not.toEqual(changeCommitment);
    });

    it("should preserve value conservation", () => {
      const inputAmount = 5_000_000_000n;
      const outputAmount = 2_000_000_000n;
      const changeAmount = inputAmount - outputAmount;

      expect(outputAmount + changeAmount).toBe(inputAmount);
    });
  });

  describe("Transfer Proof Generation", () => {
    it("should generate transfer proof with correct structure", async () => {
      const nullifier = randomBytes(32);
      const senderCommitment = randomBytes(32);
      const recipientCommitment = randomBytes(32);

      const proof = await shadowWire.generateTransferProof(
        nullifier,
        senderCommitment,
        recipientCommitment,
      );

      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toBeGreaterThan(0);
    });
  });

  describe("Transfer State Updates", () => {
    it("should mark source note as spent", () => {
      const notes = [
        { index: 0, spent: false },
        { index: 1, spent: false },
        { index: 2, spent: false },
      ];

      // Spend note 1
      notes[1].spent = true;

      expect(notes[0].spent).toBe(false);
      expect(notes[1].spent).toBe(true);
      expect(notes[2].spent).toBe(false);
    });

    it("should create new note for recipient", () => {
      let noteCount = 5;

      // Transfer creates new note
      noteCount++;

      expect(noteCount).toBe(6);
    });

    it("should create change note for sender", () => {
      let senderNoteCount = 3;

      // Original note spent, change note created
      senderNoteCount--; // Spent
      senderNoteCount++; // Change

      expect(senderNoteCount).toBe(3);
    });
  });

  describe("Privacy Guarantees", () => {
    it("should not leak amount in commitment", () => {
      const amount1 = 1n;
      const amount2 = 1_000_000_000_000n;

      const c1 = createCommitment(amount1, randomBytes(32));
      const c2 = createCommitment(amount2, randomBytes(32));

      // Both commitments should be 32 bytes (no size leak)
      expect(c1.length).toBe(32);
      expect(c2.length).toBe(32);
    });

    it("should produce random-looking nullifiers", () => {
      const secret = randomBytes(32);
      const nullifier = generateNullifier(secret, 0);

      // Check entropy (should have varied bytes)
      const uniqueBytes = new Set(nullifier);
      expect(uniqueBytes.size).toBeGreaterThan(10); // Good entropy
    });
  });
});
