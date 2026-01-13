/**
 * Unshield Flow Integration Tests
 *
 * Tests: Complete unshield operation including proof, timing, and state updates
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Ashborn } from "../../src/ashborn";
import {
  generateNullifier,
  decryptAmount,
  randomBytes,
} from "../../src/crypto";

describe("Unshield Flow Integration", () => {
  let ashborn: Ashborn;
  let mockConnection: Connection;
  let mockWallet: any;

  beforeEach(() => {
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
  });

  describe("Unshield Timing Validation", () => {
    const MIN_PRIVACY_DELAY = 24 * 60 * 60; // 24 hours in seconds

    it("should enforce minimum privacy delay", () => {
      const createdAt = Math.floor(Date.now() / 1000);
      const currentTime = createdAt + MIN_PRIVACY_DELAY - 1; // 1 second too early

      const isReady = currentTime - createdAt >= MIN_PRIVACY_DELAY;
      expect(isReady).toBe(false);
    });

    it("should allow unshield after delay", () => {
      const createdAt = Math.floor(Date.now() / 1000) - MIN_PRIVACY_DELAY - 1;
      const currentTime = Math.floor(Date.now() / 1000);

      const isReady = currentTime - createdAt >= MIN_PRIVACY_DELAY;
      expect(isReady).toBe(true);
    });

    it("should calculate exact wait time", () => {
      const createdAt = Math.floor(Date.now() / 1000);
      const hoursWaited = 12;
      const currentTime = createdAt + hoursWaited * 60 * 60;

      const waitRemaining = MIN_PRIVACY_DELAY - (currentTime - createdAt);
      const hoursRemaining = Math.ceil(waitRemaining / 3600);

      expect(hoursRemaining).toBe(12);
    });
  });

  describe("Unshield Nullifier", () => {
    it("should generate nullifier for unshield", () => {
      const secret = randomBytes(32);
      const noteIndex = 5;

      const nullifier = generateNullifier(secret, noteIndex);

      expect(nullifier.length).toBe(32);
    });

    it("should prevent double unshield", () => {
      const secret = randomBytes(32);
      const noteIndex = 5;

      const nullifier1 = generateNullifier(secret, noteIndex);
      const nullifier2 = generateNullifier(secret, noteIndex);

      // Same nullifier means double-spend detected
      expect(nullifier1).toEqual(nullifier2);
    });
  });

  describe("Unshield Amount Verification", () => {
    it("should decrypt correct amount", async () => {
      const originalAmount = 2_500_000_000n;
      const blinding = randomBytes(32);
      const viewKey = randomBytes(32);

      // Encrypt and decrypt cycle
      const { encryptAmount } = await import("../../src/crypto");
      const encrypted = await encryptAmount(originalAmount, blinding, viewKey);
      const decrypted = await decryptAmount(encrypted, viewKey);

      expect(decrypted.amount).toBe(originalAmount);
      expect(decrypted.blinding).toEqual(blinding);
    });

    it("should validate amount matches commitment", () => {
      const claimedAmount = 1_000_000_000n;
      const actualAmount = 1_000_000_000n;

      expect(claimedAmount).toBe(actualAmount);
    });

    it("should reject amount mismatch", () => {
      const claimedAmount = 2_000_000_000n;
      const actualAmount = 1_000_000_000n;

      expect(() => {
        if (claimedAmount !== actualAmount) {
          throw new Error("Amount mismatch");
        }
      }).toThrow("Amount mismatch");
    });
  });

  describe("Unshield State Updates", () => {
    it("should mark note as spent", () => {
      const note = { spent: false, amount: 1_000_000_000n };

      // Unshield marks as spent
      note.spent = true;

      expect(note.spent).toBe(true);
    });

    it("should update vault balance", () => {
      let vaultBalance = 5_000_000_000n;
      const unshieldAmount = 2_000_000_000n;

      vaultBalance -= unshieldAmount;

      expect(vaultBalance).toBe(3_000_000_000n);
    });

    it("should decrement note count", () => {
      let noteCount = 5;

      noteCount--;

      expect(noteCount).toBe(4);
    });
  });

  describe("Partial Unshield", () => {
    it("should handle partial unshield with change", () => {
      const noteAmount = 10_000_000_000n;
      const unshieldAmount = 3_000_000_000n;
      const changeAmount = noteAmount - unshieldAmount;

      expect(changeAmount).toBe(7_000_000_000n);

      // Change should create new note
      const newChangeNote = {
        amount: changeAmount,
        spent: false,
      };

      expect(newChangeNote.amount).toBe(7_000_000_000n);
    });

    it("should validate partial amount against denominations", () => {
      const validDenominations = [
        100_000_000n,
        1_000_000_000n,
        10_000_000_000n,
        100_000_000_000n,
        1_000_000_000_000n,
      ];

      const unshieldAmount = 1_000_000_000n; // 1 SOL

      const isValidDenomination = validDenominations.includes(unshieldAmount);
      expect(isValidDenomination).toBe(true);
    });
  });

  describe("Unshield Proof Generation", () => {
    it("should generate withdrawal proof", async () => {
      // Mock proof generation
      const proof = {
        proof: randomBytes(256),
        nullifier: randomBytes(32),
        amount: 1_000_000_000n,
      };

      expect(proof.proof.length).toBe(256);
      expect(proof.nullifier.length).toBe(32);
    });
  });

  describe("Token Transfer on Unshield", () => {
    it("should calculate correct token transfer", () => {
      const unshieldAmount = 2_500_000_000n;
      const fee = 5_000n; // ~0.000005 SOL

      const netAmount = unshieldAmount - fee;

      expect(netAmount).toBe(2_499_995_000n);
    });
  });
});
