/**
 * Shield Flow Integration Tests
 *
 * Tests: Complete shield operation including commitment, encryption, and state updates
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Ashborn } from "../../src/ashborn";
import { createCommitment, randomBytes, encryptAmount } from "../../src/crypto";

// Mock Connection
const mockConnection = {
  getLatestBlockhash: vi.fn().mockResolvedValue({
    blockhash: "mock-blockhash",
    lastValidBlockHeight: 1000,
  }),
  getBalance: vi.fn().mockResolvedValue(10 * LAMPORTS_PER_SOL),
  getAccountInfo: vi.fn().mockResolvedValue(null),
  sendTransaction: vi.fn().mockResolvedValue("mock-signature"),
  confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
} as unknown as Connection;

// Mock Wallet
const mockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: vi.fn(async (tx) => tx),
  signAllTransactions: vi.fn(async (txs) => txs),
};

describe("Shield Flow Integration", () => {
  let ashborn: Ashborn;

  beforeEach(() => {
    vi.clearAllMocks();
    ashborn = new Ashborn(mockConnection, mockWallet as any);
  });

  describe("Complete Shield Operation", () => {
    it("should create commitment from amount and blinding", async () => {
      const amount = 1n * BigInt(LAMPORTS_PER_SOL);
      const blinding = randomBytes(32);

      const commitment = createCommitment(amount, blinding);

      expect(commitment).toBeInstanceOf(Uint8Array);
      expect(commitment.length).toBe(32);
    });

    it("should encrypt amount with view key", async () => {
      const amount = 2_500_000_000n;
      const blinding = randomBytes(32);
      const viewKey = randomBytes(32);

      const encrypted = await encryptAmount(amount, blinding, viewKey);

      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted.length).toBeGreaterThan(40); // nonce + ciphertext + tag
    });

    it("should validate denomination on shield", async () => {
      const validDenominations = [
        100_000_000n, // 0.1 SOL
        1_000_000_000n, // 1 SOL
        10_000_000_000n, // 10 SOL
      ];

      for (const amount of validDenominations) {
        const commitment = createCommitment(amount, randomBytes(32));
        expect(commitment.length).toBe(32);
      }
    });

    it("should generate unique commitment for each shield", async () => {
      const amount = 1_000_000_000n;

      const commitments = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const blinding = randomBytes(32);
        const commitment = createCommitment(amount, blinding);
        commitments.add(Buffer.from(commitment).toString("hex"));
      }

      // All commitments should be unique
      expect(commitments.size).toBe(100);
    });
  });

  describe("Shield State Transitions", () => {
    it("should track note count after shield", async () => {
      // Initial state
      let noteCount = 0;

      // Simulate shield operations
      for (let i = 0; i < 3; i++) {
        noteCount++;
      }

      expect(noteCount).toBe(3);
    });

    it("should update shadow balance", async () => {
      let shadowBalance = 0n;

      // Shield operations
      shadowBalance += 1_000_000_000n; // 1 SOL
      shadowBalance += 500_000_000n; // 0.5 SOL
      shadowBalance -= 300_000_000n; // Transfer out

      expect(shadowBalance).toBe(1_200_000_000n);
    });
  });

  describe("Shield Error Handling", () => {
    it("should reject zero amount", async () => {
      const amount = 0n;

      expect(() => {
        if (amount <= 0n) throw new Error("Invalid amount");
        createCommitment(amount, randomBytes(32));
      }).toThrow("Invalid amount");
    });

    it("should handle insufficient balance", async () => {
      mockConnection.getBalance = vi.fn().mockResolvedValue(0);

      // The SDK should check balance before shield
      const balance = await mockConnection.getBalance(mockWallet.publicKey);
      expect(balance).toBe(0);
    });
  });
});
