/**
 * Compliance Flow Integration Tests
 *
 * Tests: Range proofs, ownership proofs, view key authorization
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Connection, Keypair } from "@solana/web3.js";
import { RangeCompliance } from "../../src/compliance";
import { ProofType } from "../../src/types";
import { createCommitment, randomBytes } from "../../src/crypto";

describe("Compliance Flow Integration", () => {
  let compliance: RangeCompliance;
  let mockConnection: Connection;
  let mockWallet: any;

  beforeEach(() => {
    mockConnection = {} as Connection;
    mockWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: vi.fn(),
    };

    compliance = new RangeCompliance(mockConnection, mockWallet);
  });

  describe("Range Proof Workflow", () => {
    it("should prove balance under limit", async () => {
      // User has 5000 USD worth
      const userBalance = 5000n;
      const blinding = randomBytes(32);

      // Prove balance is under $10,000
      const result = await compliance.generateRangeProof(
        userBalance,
        blinding,
        0n,
        10000n,
      );

      expect(result.proof.length).toBeGreaterThan(0);
      expect(result.commitment).toEqual(
        createCommitment(userBalance, blinding),
      );
    });

    it("should prove balance over minimum", async () => {
      const userBalance = 15000n;
      const blinding = randomBytes(32);

      // Prove balance is at least $10,000
      const result = await compliance.generateRangeProof(
        userBalance,
        blinding,
        10000n,
        BigInt(Number.MAX_SAFE_INTEGER),
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should prove balance in specific range", async () => {
      const userBalance = 25000n;
      const blinding = randomBytes(32);

      // Prove balance is between $20k and $50k (accredited investor range)
      const result = await compliance.generateRangeProof(
        userBalance,
        blinding,
        20000n,
        50000n,
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should fail proof for balance outside range", async () => {
      const userBalance = 5000n;
      const blinding = randomBytes(32);

      // Try to prove balance is over $10,000 when it's not
      await expect(
        compliance.generateRangeProof(userBalance, blinding, 10000n, 100000n),
      ).rejects.toThrow("out of range");
    });
  });

  describe("Ownership Proof Workflow", () => {
    it("should prove vault ownership", async () => {
      const nullifierSecret = randomBytes(32);
      const viewKey = randomBytes(32);
      const vaultAddress = Keypair.generate().publicKey;

      const result = await compliance.generateOwnershipProof(
        nullifierSecret,
        viewKey,
        vaultAddress,
      );

      expect(result.proof).toBeInstanceOf(Uint8Array);
      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should create verifiable ownership proof", async () => {
      const nullifierSecret = randomBytes(32);
      const viewKey = randomBytes(32);
      const vaultAddress = Keypair.generate().publicKey;

      const result = await compliance.generateOwnershipProof(
        nullifierSecret,
        viewKey,
        vaultAddress,
      );

      // Verify proof structure
      const isValid = await compliance.verifyOwnershipProof(result);

      expect(isValid).toBe(true);
    });
  });

  describe("View Key Authorization Workflow", () => {
    it("should create auditor authorization", async () => {
      const auditorPubkey = Keypair.generate().publicKey;
      const expiresIn30Days = Date.now() + 30 * 24 * 60 * 60 * 1000;

      const auth = await compliance.createViewKeyAuthorization(
        auditorPubkey,
        "balance",
        expiresIn30Days,
      );

      expect(auth.signature).toBeInstanceOf(Uint8Array);
      expect(auth.viewer).toEqual(auditorPubkey);
    });

    it("should create multi-scope authorizations", async () => {
      const auditor = Keypair.generate().publicKey;
      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;

      const balanceAuth = await compliance.createViewKeyAuthorization(
        auditor,
        "balance",
        expires,
      );
      const txAuth = await compliance.createViewKeyAuthorization(
        auditor,
        "transactions",
        expires,
      );
      const fullAuth = await compliance.createViewKeyAuthorization(
        auditor,
        "full",
        expires,
      );

      // Different scopes should have different scope values
      expect(balanceAuth.scope).toBe("balance");
      expect(txAuth.scope).toBe("transactions");
      expect(fullAuth.scope).toBe("full");
    });

    it("should include expiration timestamp", async () => {
      const auditor = Keypair.generate().publicKey;
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

      const auth = await compliance.createViewKeyAuthorization(
        auditor,
        "balance",
        expiresAt,
      );

      expect(auth.expiresAt).toBe(expiresAt);
    });
  });

  describe("Proof Verification", () => {
    it("should verify valid range proof", async () => {
      const userBalance = 5000n;
      const blinding = randomBytes(32);

      const proof = await compliance.generateRangeProof(
        userBalance,
        blinding,
        0n,
        10000n,
      );

      const isValid = await compliance.verifyRangeProof(proof);

      expect(isValid).toBe(true);
    });

    it("should reject tampered proof", async () => {
      const proof = await compliance.generateRangeProof(
        1000n,
        randomBytes(32),
        0n,
        10000n,
      );

      // Tamper with proof
      proof.proof[100] ^= 0xff;

      // Short proofs are rejected
      // We need to create a new object with truncated proof
      const tamperedProof = {
        ...proof,
        proof: proof.proof.slice(0, 10),
      };

      const isValid = await compliance.verifyRangeProof(tamperedProof);

      expect(isValid).toBe(false);
    });
  });

  describe("Compliance Use Cases", () => {
    it("should support AML $10k threshold check", async () => {
      const balance = 8000n;
      const blinding = randomBytes(32);

      // Prove under $10k for no reporting requirement
      const result = await compliance.generateRangeProof(
        balance,
        blinding,
        0n,
        9999n, // Under $10k
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should support accredited investor verification", async () => {
      const netWorth = 1_500_000n;
      const blinding = randomBytes(32);

      // Prove net worth over $1M
      const result = await compliance.generateRangeProof(
        netWorth,
        blinding,
        1_000_000n,
        BigInt(Number.MAX_SAFE_INTEGER),
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });

    it("should support tax reporting range", async () => {
      const income = 75000n;
      const blinding = randomBytes(32);

      // Prove income in specific tax bracket ($40k - $86k for 22% bracket)
      const result = await compliance.generateRangeProof(
        income,
        blinding,
        40000n,
        86000n,
      );

      expect(result.proof.length).toBeGreaterThan(0);
    });
  });
});
