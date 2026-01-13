/**
 * Tree Indexer Service - Off-chain Merkle tree maintenance
 *
 * Vitalik-approved: Users need local tree copy for proof generation
 */

import { Connection, PublicKey } from "@solana/web3.js";
import { poseidonHash, bytesToBigint, bigintToBytes } from "./crypto";

/** Tree depth */
export const TREE_DEPTH = 20;

/** Zero value for empty leaves */
const ZERO_VALUE = new Uint8Array(32);

/** Merkle tree node */
export interface TreeNode {
  hash: Uint8Array;
  left?: TreeNode;
  right?: TreeNode;
}

/** Merkle proof */
export interface MerkleProof {
  /** Sibling hashes from leaf to root */
  siblings: Uint8Array[];
  /** Path indices (0 = left, 1 = right) */
  pathIndices: number[];
  /** Root at time of proof generation */
  root: Uint8Array;
  /** Leaf index */
  leafIndex: number;
}

/**
 * Local Merkle tree indexer
 *
 * Maintains a local copy of the on-chain Merkle tree
 * Required for generating ZK proofs
 */
export class TreeIndexer {
  private connection: Connection;
  private programId: PublicKey;
  private leaves: Uint8Array[] = [];
  private tree: Uint8Array[][] = [];
  private root: Uint8Array = ZERO_VALUE;
  private zeroHashes: Uint8Array[] = [];

  constructor(connection: Connection, programId: PublicKey) {
    this.connection = connection;
    this.programId = programId;
    this.initializeZeroHashes();
  }

  /**
   * Precompute zero hashes for empty subtrees
   */
  private initializeZeroHashes(): void {
    let current = ZERO_VALUE;
    this.zeroHashes = [current];

    for (let i = 0; i < TREE_DEPTH; i++) {
      current = new Uint8Array(this.hashPair(current, current));
      this.zeroHashes.push(current);
    }
  }

  /**
   * Hash two nodes using Poseidon
   */
  private hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
    const leftBigint = bytesToBigint(left);
    const rightBigint = bytesToBigint(right);
    const hash = poseidonHash([leftBigint, rightBigint]);
    return bigintToBytes(hash, 32);
  }

  /**
   * Sync tree state from on-chain
   */
  async sync(): Promise<void> {
    // Fetch all commitment/nullifier insertion events
    const signatures = await this.connection.getSignaturesForAddress(
      this.programId,
      { limit: 1000 },
    );

    for (const sig of signatures) {
      const tx = await this.connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx?.meta?.logMessages) continue;

      // Parse commitment insertions from logs
      for (const log of tx.meta.logMessages) {
        if (log.includes("commitment:")) {
          const match = log.match(/commitment: ([a-f0-9]+)/i);
          if (match) {
            const commitment = Buffer.from(match[1], "hex");
            if (!this.hasLeaf(commitment)) {
              this.insert(commitment);
            }
          }
        }
      }
    }

    console.log(`Synced ${this.leaves.length} leaves`);
  }

  /**
   * Check if leaf exists in tree
   */
  hasLeaf(leaf: Uint8Array): boolean {
    return this.leaves.some((l) => this.arraysEqual(l, leaf));
  }

  /**
   * Insert a new leaf
   */
  insert(leaf: Uint8Array): number {
    const index = this.leaves.length;
    this.leaves.push(leaf);
    this.updateTree(index, leaf);
    return index;
  }

  /**
   * Update tree after insertion
   */
  private updateTree(index: number, leaf: Uint8Array): void {
    // Initialize tree if needed
    if (this.tree.length === 0) {
      for (let i = 0; i <= TREE_DEPTH; i++) {
        this.tree.push([]);
      }
    }

    // Set leaf
    this.tree[0][index] = leaf;

    // Update path to root
    let currentIndex = index;
    let currentHash = leaf;

    for (let level = 0; level < TREE_DEPTH; level++) {
      const siblingIndex =
        currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
      const isLeft = currentIndex % 2 === 0;

      const sibling = this.tree[level][siblingIndex] ?? this.zeroHashes[level];

      currentHash = isLeft
        ? this.hashPair(currentHash, sibling)
        : this.hashPair(sibling, currentHash);

      currentIndex = Math.floor(currentIndex / 2);
      this.tree[level + 1][currentIndex] = currentHash;
    }

    this.root = this.tree[TREE_DEPTH][0];
  }

  /**
   * Generate Merkle proof for a leaf
   */
  generateProof(leafIndex: number): MerkleProof {
    if (leafIndex >= this.leaves.length) {
      throw new Error("Leaf index out of bounds");
    }

    const siblings: Uint8Array[] = [];
    const pathIndices: number[] = [];
    let currentIndex = leafIndex;

    for (let level = 0; level < TREE_DEPTH; level++) {
      const siblingIndex =
        currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
      const isLeft = currentIndex % 2 === 0;

      const sibling = this.tree[level][siblingIndex] ?? this.zeroHashes[level];
      siblings.push(sibling);
      pathIndices.push(isLeft ? 0 : 1);

      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      siblings,
      pathIndices,
      root: this.root,
      leafIndex,
    };
  }

  /**
   * Verify a Merkle proof
   */
  verifyProof(leaf: Uint8Array, proof: MerkleProof): boolean {
    let currentHash = leaf;

    for (let i = 0; i < TREE_DEPTH; i++) {
      const sibling = proof.siblings[i];
      const isLeft = proof.pathIndices[i] === 0;

      currentHash = isLeft
        ? this.hashPair(currentHash, sibling)
        : this.hashPair(sibling, currentHash);
    }

    return this.arraysEqual(currentHash, proof.root);
  }

  /**
   * Get current root
   */
  getRoot(): Uint8Array {
    return this.root;
  }

  /**
   * Get leaf count
   */
  getLeafCount(): number {
    return this.leaves.length;
  }

  /**
   * Get leaf at index
   */
  getLeaf(index: number): Uint8Array | undefined {
    return this.leaves[index];
  }

  /**
   * Find index of a leaf
   */
  findLeafIndex(leaf: Uint8Array): number {
    return this.leaves.findIndex((l) => this.arraysEqual(l, leaf));
  }

  private arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}

/**
 * Create tree indexer with automatic sync
 */
export async function createTreeIndexer(
  connection: Connection,
  programId: PublicKey,
  autoSync: boolean = true,
): Promise<TreeIndexer> {
  const indexer = new TreeIndexer(connection, programId);

  if (autoSync) {
    await indexer.sync();
  }

  return indexer;
}
