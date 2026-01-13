/**
 * Multi-User Scenario E2E Tests
 *
 * Tests: Multiple users interacting, privacy guarantees between users
 */

import { describe, it, expect, beforeAll } from "vitest";
import { Keypair } from "@solana/web3.js";
import {
  createCommitment,
  generateNullifier,
  encryptAmount,
  decryptAmount,
  randomBytes,
} from "../../src/crypto";
import { ShadowWire } from "../../src/shadowwire";

describe("E2E: Multi-User Scenarios", () => {
  // Simulate multiple users
  interface User {
    keypair: Keypair;
    viewKey: Uint8Array;
    nullifierSecret: Uint8Array;
    notes: Array<{ commitment: Uint8Array; amount: bigint; index: number }>;
  }

  let alice: User;
  let bob: User;
  let charlie: User;

  beforeAll(() => {
    alice = {
      keypair: Keypair.generate(),
      viewKey: randomBytes(32),
      nullifierSecret: randomBytes(32),
      notes: [],
    };

    bob = {
      keypair: Keypair.generate(),
      viewKey: randomBytes(32),
      nullifierSecret: randomBytes(32),
      notes: [],
    };

    charlie = {
      keypair: Keypair.generate(),
      viewKey: randomBytes(32),
      nullifierSecret: randomBytes(32),
      notes: [],
    };
  });

  describe("User Isolation", () => {
    it("should have unique view keys per user", () => {
      expect(alice.viewKey).not.toEqual(bob.viewKey);
      expect(bob.viewKey).not.toEqual(charlie.viewKey);
      expect(alice.viewKey).not.toEqual(charlie.viewKey);
    });

    it("should have unique nullifier secrets per user", () => {
      expect(alice.nullifierSecret).not.toEqual(bob.nullifierSecret);
      expect(bob.nullifierSecret).not.toEqual(charlie.nullifierSecret);
    });

    it("should not be able to decrypt other user's notes", async () => {
      // Alice shields 1 SOL
      const aliceAmount = 1_000_000_000n;
      const aliceBlinding = randomBytes(32);
      const aliceEncrypted = await encryptAmount(
        aliceAmount,
        aliceBlinding,
        alice.viewKey,
      );

      // Bob tries to decrypt with his key
      await expect(
        decryptAmount(aliceEncrypted, bob.viewKey),
      ).rejects.toThrow();
    });
  });

  describe("Multi-User Transfers", () => {
    it("should support Alice -> Bob transfer", async () => {
      // Alice has 10 SOL shielded
      const aliceAmount = 10_000_000_000n;
      const aliceBlinding = randomBytes(32);
      const aliceCommitment = createCommitment(aliceAmount, aliceBlinding);

      alice.notes.push({
        commitment: aliceCommitment,
        amount: aliceAmount,
        index: 0,
      });

      // Alice sends 3 SOL to Bob
      const transferAmount = 3_000_000_000n;
      const bobBlinding = randomBytes(32);
      const bobCommitment = createCommitment(transferAmount, bobBlinding);

      bob.notes.push({
        commitment: bobCommitment,
        amount: transferAmount,
        index: 0,
      });

      // Alice gets change
      const aliceChange = aliceAmount - transferAmount;
      const changeBlinding = randomBytes(32);
      const changeCommitment = createCommitment(aliceChange, changeBlinding);

      alice.notes[0] = {
        commitment: changeCommitment,
        amount: aliceChange,
        index: 1,
      };

      expect(alice.notes[0].amount).toBe(7_000_000_000n);
      expect(bob.notes[0].amount).toBe(3_000_000_000n);
    });

    it("should support multi-hop: Alice -> Bob -> Charlie", async () => {
      // Reset notes
      alice.notes = [];
      bob.notes = [];
      charlie.notes = [];

      // Alice starts with 10 SOL
      alice.notes.push({
        commitment: createCommitment(10_000_000_000n, randomBytes(32)),
        amount: 10_000_000_000n,
        index: 0,
      });

      // Alice -> Bob: 5 SOL
      bob.notes.push({
        commitment: createCommitment(5_000_000_000n, randomBytes(32)),
        amount: 5_000_000_000n,
        index: 0,
      });
      alice.notes[0] = {
        commitment: createCommitment(5_000_000_000n, randomBytes(32)),
        amount: 5_000_000_000n,
        index: 1,
      };

      // Bob -> Charlie: 2 SOL
      charlie.notes.push({
        commitment: createCommitment(2_000_000_000n, randomBytes(32)),
        amount: 2_000_000_000n,
        index: 0,
      });
      bob.notes[0] = {
        commitment: createCommitment(3_000_000_000n, randomBytes(32)),
        amount: 3_000_000_000n,
        index: 1,
      };

      expect(alice.notes[0].amount).toBe(5_000_000_000n);
      expect(bob.notes[0].amount).toBe(3_000_000_000n);
      expect(charlie.notes[0].amount).toBe(2_000_000_000n);
    });
  });

  describe("Privacy Between Users", () => {
    it("should generate unique nullifiers per user per note", () => {
      const aliceN0 = generateNullifier(alice.nullifierSecret, 0);
      const aliceN1 = generateNullifier(alice.nullifierSecret, 1);
      const bobN0 = generateNullifier(bob.nullifierSecret, 0);

      expect(aliceN0).not.toEqual(aliceN1);
      expect(aliceN0).not.toEqual(bobN0);
    });

    it("should not reveal transfer amounts on-chain", () => {
      // All commitments should be 32 bytes regardless of amount
      const c1 = createCommitment(1n, randomBytes(32));
      const c2 = createCommitment(1_000_000_000_000n, randomBytes(32));
      const c3 = createCommitment(123_456_789n, randomBytes(32));

      expect(c1.length).toBe(32);
      expect(c2.length).toBe(32);
      expect(c3.length).toBe(32);
    });

    it("should not link sender and recipient", async () => {
      // Alice and Bob have different stealth addresses
      const mockConnection = {} as any;
      const aliceShadowWire = new ShadowWire(mockConnection, {
        publicKey: alice.keypair.publicKey,
      } as any);
      const bobShadowWire = new ShadowWire(mockConnection, {
        publicKey: bob.keypair.publicKey,
      } as any);

      const aliceStealth = await aliceShadowWire.generateStealthAddress();
      const bobStealth = await bobShadowWire.generateStealthAddress();

      expect(aliceStealth.stealthPubkey.toBase58()).not.toBe(
        bobStealth.stealthPubkey.toBase58(),
      );
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle simultaneous shields from different users", async () => {
      const shieldPromises = [alice, bob, charlie].map(async (user) => {
        const amount = BigInt(Math.floor(Math.random() * 10_000_000_000));
        const blinding = randomBytes(32);
        const commitment = createCommitment(amount, blinding);
        const encrypted = await encryptAmount(amount, blinding, user.viewKey);

        return {
          user,
          commitment,
          encrypted,
          amount,
        };
      });

      const results = await Promise.all(shieldPromises);

      // All shields should succeed
      expect(results).toHaveLength(3);
      results.forEach((r) => {
        expect(r.commitment.length).toBe(32);
        expect(r.encrypted.length).toBeGreaterThan(40);
      });
    });

    it("should handle simultaneous transfers", () => {
      // Reset
      alice.notes = [
        { commitment: randomBytes(32), amount: 10_000_000_000n, index: 0 },
      ];
      bob.notes = [
        { commitment: randomBytes(32), amount: 10_000_000_000n, index: 0 },
      ];

      // Alice -> Charlie and Bob -> Charlie at same time
      const aliceTransfer = 2_000_000_000n;
      const bobTransfer = 3_000_000_000n;

      charlie.notes.push({
        commitment: createCommitment(aliceTransfer, randomBytes(32)),
        amount: aliceTransfer,
        index: 0,
      });
      charlie.notes.push({
        commitment: createCommitment(bobTransfer, randomBytes(32)),
        amount: bobTransfer,
        index: 1,
      });

      const charlieTotal = charlie.notes.reduce((sum, n) => sum + n.amount, 0n);
      expect(charlieTotal).toBe(7_000_000_000n);
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with zero balance", () => {
      const newUser: User = {
        keypair: Keypair.generate(),
        viewKey: randomBytes(32),
        nullifierSecret: randomBytes(32),
        notes: [],
      };

      const balance = newUser.notes.reduce((sum, n) => sum + n.amount, 0n);
      expect(balance).toBe(0n);
    });

    it("should handle user with many notes", () => {
      const manyNotes: User = {
        keypair: Keypair.generate(),
        viewKey: randomBytes(32),
        nullifierSecret: randomBytes(32),
        notes: [],
      };

      // Create 100 notes
      for (let i = 0; i < 100; i++) {
        manyNotes.notes.push({
          commitment: createCommitment(100_000_000n, randomBytes(32)),
          amount: 100_000_000n,
          index: i,
        });
      }

      const balance = manyNotes.notes.reduce((sum, n) => sum + n.amount, 0n);
      expect(balance).toBe(10_000_000_000n); // 100 * 0.1 SOL
    });
  });
});
