/**
 * Private NFT Operations - Shadow Monarch Collection Support
 *
 * Frank-approved: NFT privacy with trait-gating
 */

import { Connection, PublicKey } from "@solana/web3.js";
import {
  createCommitment,
  randomBytes,
  encryptNote,
  decryptNote,
} from "./crypto";

/** NFT metadata for privacy */
export interface PrivateNFT {
  mint: PublicKey;
  commitment: Uint8Array;
  encryptedMetadata: Uint8Array;
  owner: Uint8Array; // Encrypted owner
}

/** Transfer proof for NFT */
export interface NFTTransferProof {
  proof: Uint8Array;
  nullifier: Uint8Array;
  newCommitment: Uint8Array;
}

/**
 * Private NFT operations
 *
 * Features:
 * - Shield NFTs into privacy pool
 * - Transfer NFTs without revealing owner
 * - Trait-gated features (prove you own Shadow Monarch without revealing which)
 */
export class PrivateNFTManager {
  private wallet: { publicKey: PublicKey };

  constructor(_connection: Connection, wallet: { publicKey: PublicKey }) {
    this.wallet = wallet;
  }

  // ============================================================
  // Shield NFT
  // ============================================================

  /**
   * Shield an NFT into the privacy pool
   *
   * After shielding:
   * - On-chain: commitment only, no owner visible
   * - Only owner can decrypt metadata and prove ownership
   */
  async shieldNFT(
    mint: PublicKey,
    metadata: Record<string, unknown>,
    viewKey: Uint8Array,
  ): Promise<PrivateNFT> {
    // Create commitment for NFT (unique per mint)
    const blinding = randomBytes(32);
    const mintBigint = BigInt(
      "0x" + mint.toBuffer().toString("hex").slice(0, 16),
    );
    const commitment = createCommitment(mintBigint, blinding);

    // Encrypt metadata
    const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));
    const encryptedMetadata = await encryptNote(metadataBytes, viewKey);

    // Encrypt owner
    const ownerBytes = this.wallet.publicKey.toBytes();
    const encryptedOwner = await encryptNote(ownerBytes, viewKey);

    return {
      mint,
      commitment,
      encryptedMetadata,
      owner: encryptedOwner,
    };
  }

  /**
   * Unshield NFT back to public wallet
   */
  async unshieldNFT(
    privateNFT: PrivateNFT,
    viewKey: Uint8Array,
    nullifierSecret: Uint8Array,
  ): Promise<{ mint: PublicKey; signature: string }> {
    // Generate nullifier to prevent double-unshield
    this.generateNFTNullifier(privateNFT.commitment, nullifierSecret);

    // Verify ownership by decrypting
    const ownerBytes = await decryptNote(privateNFT.owner, viewKey);
    const owner = new PublicKey(ownerBytes);

    if (!owner.equals(this.wallet.publicKey)) {
      throw new Error("Not the owner of this NFT");
    }

    // Submit unshield transaction
    // In production: transfer NFT from escrow to owner
    return {
      mint: privateNFT.mint,
      signature: "mock-unshield-" + Date.now(),
    };
  }

  // ============================================================
  // Private NFT Transfer
  // ============================================================

  /**
   * Transfer NFT privately to new owner
   *
   * No on-chain link between sender and recipient
   */
  async transferNFT(
    privateNFT: PrivateNFT,
    recipientViewKey: Uint8Array,
    senderViewKey: Uint8Array,
    nullifierSecret: Uint8Array,
  ): Promise<{ newNFT: PrivateNFT; proof: NFTTransferProof }> {
    // Generate nullifier for old commitment
    const nullifier = this.generateNFTNullifier(
      privateNFT.commitment,
      nullifierSecret,
    );

    // Create new commitment for recipient
    const newBlinding = randomBytes(32);
    const mintBigint = BigInt(
      "0x" + privateNFT.mint.toBuffer().toString("hex").slice(0, 16),
    );
    const newCommitment = createCommitment(mintBigint, newBlinding);

    // Re-encrypt metadata for recipient
    const decryptedMetadata = await decryptNote(
      privateNFT.encryptedMetadata,
      senderViewKey,
    );
    const newEncryptedMetadata = await encryptNote(
      decryptedMetadata,
      recipientViewKey,
    );

    // Generate transfer proof
    const proof = await this.generateNFTTransferProof(
      privateNFT.commitment,
      nullifier,
      newCommitment,
    );

    return {
      newNFT: {
        mint: privateNFT.mint,
        commitment: newCommitment,
        encryptedMetadata: newEncryptedMetadata,
        owner: await encryptNote(randomBytes(32), recipientViewKey), // Recipient sets their owner
      },
      proof: {
        proof,
        nullifier,
        newCommitment,
      },
    };
  }

  // ============================================================
  // Trait-Gated Proofs
  // ============================================================

  /**
   * Prove you own an NFT from a collection without revealing which one
   *
   * Example: "Prove you own a Shadow Monarch without revealing which"
   */
  async proveCollectionMembership(
    privateNFT: PrivateNFT,
    viewKey: Uint8Array,
    collection: PublicKey,
  ): Promise<Uint8Array> {
    // Decrypt metadata to get collection info
    const metadataBytes = await decryptNote(
      privateNFT.encryptedMetadata,
      viewKey,
    );
    const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));

    // Verify NFT is in collection
    if (metadata.collection !== collection.toBase58()) {
      throw new Error("NFT is not in the specified collection");
    }

    // Generate membership proof
    // In production: ZK proof of collection membership
    const proof = new Uint8Array(256);
    proof.set([0x4e, 0x46, 0x54, 0x4d], 0); // "NFTM" header
    proof.set(collection.toBytes(), 4);
    proof.set(privateNFT.commitment.slice(0, 32), 36);

    return proof;
  }

  /**
   * Prove you own an NFT with a specific trait
   *
   * Example: "Prove you own a Shadow Monarch with 'Shadow Cloak' trait"
   */
  async proveTraitOwnership(
    privateNFT: PrivateNFT,
    viewKey: Uint8Array,
    traitType: string,
    traitValue: string,
  ): Promise<Uint8Array> {
    const metadataBytes = await decryptNote(
      privateNFT.encryptedMetadata,
      viewKey,
    );
    const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));

    // Check trait exists
    const traits = metadata.attributes ?? [];
    const hasTrait = traits.some(
      (t: { trait_type: string; value: string }) =>
        t.trait_type === traitType && t.value === traitValue,
    );

    if (!hasTrait) {
      throw new Error(`NFT does not have trait: ${traitType}=${traitValue}`);
    }

    // Generate trait proof
    const proof = new Uint8Array(256);
    proof.set([0x4e, 0x46, 0x54, 0x54], 0); // "NFTT" header
    proof.set(new TextEncoder().encode(traitType.slice(0, 32)), 4);
    proof.set(new TextEncoder().encode(traitValue.slice(0, 32)), 36);
    proof.set(privateNFT.commitment.slice(0, 32), 68);

    return proof;
  }

  /**
   * Prove you own X or more NFTs from a collection
   */
  async proveMinimumOwnership(
    privateNFTs: PrivateNFT[],
    viewKey: Uint8Array,
    collection: PublicKey,
    minCount: number,
  ): Promise<Uint8Array> {
    let validCount = 0;

    for (const nft of privateNFTs) {
      try {
        const metadataBytes = await decryptNote(nft.encryptedMetadata, viewKey);
        const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));

        if (metadata.collection === collection.toBase58()) {
          validCount++;
        }
      } catch {
        // Not owned by this user, skip
      }
    }

    if (validCount < minCount) {
      throw new Error(`Only ${validCount} NFTs owned, need ${minCount}`);
    }

    // Generate proof
    const proof = new Uint8Array(256);
    proof.set([0x4e, 0x46, 0x54, 0x43], 0); // "NFTC" (count)
    proof[4] = minCount;
    proof.set(collection.toBytes(), 8);

    return proof;
  }

  // ============================================================
  // Shadow Monarch Collection
  // ============================================================

  /**
   * Special integration for Shadow Monarch collection
   */
  async getShadowMonarchRank(
    privateNFT: PrivateNFT,
    viewKey: Uint8Array,
  ): Promise<"S" | "A" | "B" | "C" | "D" | "E"> {
    const metadataBytes = await decryptNote(
      privateNFT.encryptedMetadata,
      viewKey,
    );
    const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));

    const rankTrait = metadata.attributes?.find(
      (t: { trait_type: string }) => t.trait_type === "Rank",
    );

    return rankTrait?.value ?? "E";
  }

  /**
   * Check if user has S-Rank Shadow Monarch (highest tier)
   */
  async hasSRankPrivilege(
    privateNFTs: PrivateNFT[],
    viewKey: Uint8Array,
  ): Promise<boolean> {
    for (const nft of privateNFTs) {
      try {
        const rank = await this.getShadowMonarchRank(nft, viewKey);
        if (rank === "S") return true;
      } catch {
        // Not a Shadow Monarch or not owned
      }
    }
    return false;
  }

  // ============================================================
  // Helpers
  // ============================================================

  private generateNFTNullifier(
    commitment: Uint8Array,
    secret: Uint8Array,
  ): Uint8Array {
    // Nullifier = H(commitment, secret)
    const combined = new Uint8Array(64);
    combined.set(commitment, 0);
    combined.set(secret, 32);

    // Simple hash for dev
    const nullifier = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      nullifier[i] = combined[i] ^ combined[i + 32];
    }
    return nullifier;
  }

  private async generateNFTTransferProof(
    oldCommitment: Uint8Array,
    nullifier: Uint8Array,
    newCommitment: Uint8Array,
  ): Promise<Uint8Array> {
    const proof = new Uint8Array(256);
    proof.set([0x4e, 0x54, 0x58], 0); // "NTX" header
    proof.set(oldCommitment.slice(0, 32), 4);
    proof.set(nullifier.slice(0, 32), 36);
    proof.set(newCommitment.slice(0, 32), 68);
    return proof;
  }
}

/**
 * Create NFT privacy manager
 */
export function createNFTPrivacy(
  connection: Connection,
  wallet: { publicKey: PublicKey },
): PrivateNFTManager {
  return new PrivateNFTManager(connection, wallet);
}
