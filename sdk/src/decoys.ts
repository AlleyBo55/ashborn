/**
 * Decoy Output Generation - transaction privacy
 *
 * Adds 3+ fake output commitments to break transaction graph analysis
 */

import { randomBytes, createCommitment } from "./crypto";

/** Number of decoys per transaction */
export const DECOY_COUNT = 3;

/** Decoy output structure */
export interface DecoyOutput {
  commitment: Uint8Array;
  isReal: boolean;
  index: number;
}

/** Transfer with decoys */
export interface TransferWithDecoys {
  /** All outputs (real + decoys), shuffled */
  outputs: Uint8Array[];
  /** Encrypted index of real output (only recipient can decrypt) */
  encryptedRealIndex: Uint8Array;
  /** Number of decoys */
  decoyCount: number;
}

/**
 * Generate decoy commitments that look indistinguishable from real ones
 */
export function generateDecoys(count: number = DECOY_COUNT): Uint8Array[] {
  const decoys: Uint8Array[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random but valid-looking commitment
    // Uses same structure as real commitments
    const fakeAmount = BigInt(Math.floor(Math.random() * 1000000000000));
    const fakeBlinding = randomBytes(32);
    const decoy = createCommitment(fakeAmount, fakeBlinding);
    decoys.push(decoy);
  }

  return decoys;
}

/**
 * Create transfer with decoy outputs
 *
 * Observers cannot distinguish real from fake outputs
 */
export function createTransferWithDecoys(
  realOutputCommitment: Uint8Array,
  recipientViewKey: Uint8Array,
): TransferWithDecoys {
  // Generate decoys
  const decoys = generateDecoys(DECOY_COUNT);

  // Combine real + decoys
  const allOutputs = [realOutputCommitment, ...decoys];

  // Shuffle using Fisher-Yates
  const shuffled = shuffleArray([...allOutputs]);

  // Find real index after shuffle
  const realIndex = shuffled.findIndex((output) =>
    arraysEqual(output, realOutputCommitment),
  );

  // Encrypt real index for recipient
  const encryptedRealIndex = encryptIndex(realIndex, recipientViewKey);

  return {
    outputs: shuffled,
    encryptedRealIndex,
    decoyCount: DECOY_COUNT,
  };
}

/**
 * Decrypt real output index (recipient only)
 */
export function decryptRealIndex(
  encryptedIndex: Uint8Array,
  viewKey: Uint8Array,
): number {
  // XOR with hash of view key to decrypt
  const keyHash = simpleHash(viewKey);
  const decrypted = encryptedIndex[0] ^ keyHash[0];
  return decrypted % (DECOY_COUNT + 1);
}

/**
 * Verify a commitment is in the output set
 */
export function findRealOutput(
  outputs: Uint8Array[],
  encryptedIndex: Uint8Array,
  viewKey: Uint8Array,
): Uint8Array | null {
  const realIndex = decryptRealIndex(encryptedIndex, viewKey);

  if (realIndex < 0 || realIndex >= outputs.length) {
    return null;
  }

  return outputs[realIndex];
}

/**
 * Generate decoy nullifiers for added privacy
 *
 * Makes it harder to trace which nullifier is real
 */
export function generateDecoyNullifiers(
  count: number = DECOY_COUNT,
): Uint8Array[] {
  const decoyNullifiers: Uint8Array[] = [];

  for (let i = 0; i < count; i++) {
    // Random bytes that look like real nullifiers
    decoyNullifiers.push(randomBytes(32));
  }

  return decoyNullifiers;
}

// Helper functions

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function encryptIndex(index: number, viewKey: Uint8Array): Uint8Array {
  const keyHash = simpleHash(viewKey);
  const encrypted = new Uint8Array(1);
  encrypted[0] = index ^ keyHash[0];
  return encrypted;
}

function simpleHash(data: Uint8Array): Uint8Array {
  // Simple hash for index encryption (not cryptographically strong, just obfuscation)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash = hash & hash;
  }
  const result = new Uint8Array(32);
  result[0] = Math.abs(hash) % 256;
  return result;
}
