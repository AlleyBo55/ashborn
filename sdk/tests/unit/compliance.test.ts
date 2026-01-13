/**
 * Range Compliance Unit Tests
 *
 * Tests: Proof generation, proof verification, view key authorization
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { RangeCompliance } from "@/compliance";
import { ProofType } from "@/types";
import { randomBytes } from "@/crypto";

describe("Range Compliance", () => {
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

  describe("Range Proof Generation", () => {
    it("should generate range proof for valid value", async () => {
      const value = 5000n; // Within range
      const blinding = randomBytes(32);
      const min = 0n;
      const max = 10000n;

      const result = await compliance.generateRangeProof(
        value,
        blinding,
        min,
        max,
      );

      expect(result.proof).toBeInstanceOf(Uint8Array);
      expect(result.proof.length).toBeGreaterThan(0);
      expect(result.commitment).toBeInstanceOf(Uint8Array);
      expect(result.commitment.length).toBe(32);
    });

    it("should throw for value below range", async () => {
      const value = -1n;
      const blinding = randomBytes(32);

      await expect(
        compliance.generateRangeProof(value, blinding, 0n, 100n),
      ).rejects.toThrow("out of range");
    });

    it("should throw for value above range", async () => {
      const value = 10001n;
      const blinding = randomBytes(32);

      await expect(
        compliance.generateRangeProof(value, blinding, 0n, 10000n),
      ).rejects.toThrow("out of range");
    });

    it("should accept boundary values", async () => {
      const blinding = randomBytes(32);

      // Min boundary
      const resultMin = await compliance.generateRangeProof(
        0n,
        blinding,
        0n,
        100n,
      );
      expect(resultMin.proof.length).toBeGreaterThan(0);

      // Max boundary
      const resultMax = await compliance.generateRangeProof(
        100n,
        blinding,
        0n,
        100n,
      );
      expect(resultMax.proof.length).toBeGreaterThan(0);
    });
  });

  describe("Ownership Proof Generation", () => {
    it("should generate ownership proof", async () => {
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
      expect(result.viewKeyCommitment).toBeInstanceOf(Uint8Array);
    });
  });

  describe("Proof Verification", () => {
    it("should verify valid proof", async () => {
      const proofBytes = new Uint8Array(640);
      proofBytes.set([0x42, 0x50, 0x00, 0x01], 0); // Range proof header

      const rangeProof = {
        proof: proofBytes,
        commitment: randomBytes(32),
        rangeMin: 0n,
        rangeMax: 100n,
      };

      const isValid = await compliance.verifyRangeProof(rangeProof);
      expect(isValid).toBe(true);
    });

    it("should reject proof that is too short", async () => {
      const shortProof = {
        proof: new Uint8Array(64),
        commitment: randomBytes(32),
        rangeMin: 0n,
        rangeMax: 100n,
      };

      const isValid = await compliance.verifyRangeProof(shortProof);
      expect(isValid).toBe(false);
    });
  });

  describe("View Key Authorization", () => {
    it("should create balance-scoped authorization", async () => {
      const viewerPubkey = Keypair.generate().publicKey;
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

      const auth = await compliance.createViewKeyAuthorization(
        viewerPubkey,
        "balance",
        expiresAt,
      );

      expect(auth.signature).toBeInstanceOf(Uint8Array);
      expect(auth.scope).toBe("balance");
      expect(auth.viewer.toBase58()).toBe(viewerPubkey.toBase58());
    });

    it("should create transaction-scoped authorization", async () => {
      const viewerPubkey = Keypair.generate().publicKey;
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

      const auth = await compliance.createViewKeyAuthorization(
        viewerPubkey,
        "transactions",
        expiresAt,
      );

      expect(auth.scope).toBe("transactions");
    });

    it("should create full-access authorization", async () => {
      const viewerPubkey = Keypair.generate().publicKey;
      const expiresAt = Date.now();

      const auth = await compliance.createViewKeyAuthorization(
        viewerPubkey,
        "full",
        expiresAt,
      );

      expect(auth.scope).toBe("full");
    });
  });
});
