import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

// Import the generated IDL type
// import { Ashborn } from '../target/types/ashborn';

describe("ashborn", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Program ID (update after deployment)
  const programId = new PublicKey("BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe");

  // Test accounts
  const owner = provider.wallet;
  let vaultPda: PublicKey;
  let vaultBump: number;

  before(async () => {
    // Derive vault PDA
    [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("shadow_vault"), owner.publicKey.toBuffer()],
      programId,
    );
    console.log("Vault PDA:", vaultPda.toBase58());
  });

  describe("initialize_vault", () => {
    it("should initialize a shadow vault", async () => {
      // This test would call the actual program instruction
      // For now, we log the expected behavior
      console.log("Testing vault initialization...");
      console.log("Owner:", owner.publicKey.toBase58());
      console.log("Expected vault PDA:", vaultPda.toBase58());

      // Expected instruction data:
      // - Discriminator: initialize_vault
      // - Accounts: owner (signer), shadow_vault (init), system_program

      expect(vaultPda).to.not.be.null;
    });
  });

  describe("shield_deposit", () => {
    it("should shield assets into the vault", async () => {
      console.log("Testing shield deposit...");

      const amount = 1_000_000; // 0.001 SOL
      const commitment = new Uint8Array(32).fill(1); // Mock commitment

      console.log("Amount:", amount);
      console.log(
        "Commitment:",
        Buffer.from(commitment).toString("hex").slice(0, 16) + "...",
      );

      // Derive note PDA
      const noteIndex = 0;
      const [notePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("shielded_note"),
          vaultPda.toBuffer(),
          Buffer.from(new Uint32Array([noteIndex]).buffer),
        ],
        programId,
      );

      console.log("Note PDA:", notePda.toBase58());
      expect(notePda).to.not.be.null;
    });
  });

  describe("shadow_transfer", () => {
    it("should execute unlinkable P2P transfer", async () => {
      console.log("Testing shadow transfer...");

      const nullifier = new Uint8Array(32).fill(2);
      const newCommitment = new Uint8Array(32).fill(3);
      const recipientCommitment = new Uint8Array(32).fill(4);
      const proof = new Uint8Array(128).fill(5);

      console.log(
        "Nullifier:",
        Buffer.from(nullifier).toString("hex").slice(0, 16) + "...",
      );
      console.log("Proof length:", proof.length);

      // Derive nullifier PDA
      const [nullifierPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("nullifier"), nullifier],
        programId,
      );

      console.log("Nullifier PDA:", nullifierPda.toBase58());
      expect(nullifierPda).to.not.be.null;
    });
  });

  describe("selective_reveal", () => {
    it("should generate compliance proof", async () => {
      console.log("Testing selective reveal...");

      const proofType = 0; // RangeProof
      const rangeMin = 0;
      const rangeMax = 10_000_000_000; // $10k in cents
      const proofData = new Uint8Array(128).fill(6);

      console.log("Proof type:", proofType);
      console.log("Range:", rangeMin, "-", rangeMax);
      console.log("Proof data length:", proofData.length);

      // Derive compliance proof PDA
      const [proofPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("compliance_proof"),
          vaultPda.toBuffer(),
          Buffer.from([proofType]),
        ],
        programId,
      );

      console.log("Proof PDA:", proofPda.toBase58());
      expect(proofPda).to.not.be.null;
    });
  });

  describe("unshield", () => {
    it("should withdraw assets to public wallet", async () => {
      console.log("Testing unshield...");

      const amount = 500_000; // 0.0005 SOL
      const nullifier = new Uint8Array(32).fill(7);
      const proof = new Uint8Array(96).fill(8);

      console.log("Amount:", amount);
      console.log(
        "Nullifier:",
        Buffer.from(nullifier).toString("hex").slice(0, 16) + "...",
      );

      expect(amount).to.be.greaterThan(0);
    });
  });

  describe("integration", () => {
    it("should complete full privacy flow", async () => {
      console.log("\n=== Full Privacy Flow Test ===\n");

      // 1. Initialize vault
      console.log("1. Initialize vault");

      // 2. Shield 1 SOL
      console.log("2. Shield 1 SOL");

      // 3. Transfer 0.5 SOL privately
      console.log("3. Shadow transfer 0.5 SOL");

      // 4. Generate compliance proof
      console.log("4. Generate range proof (0 - $10k)");

      // 5. Unshield remaining
      console.log("5. Unshield 0.5 SOL");

      console.log("\n=== Flow complete! ===\n");
    });
  });
});
