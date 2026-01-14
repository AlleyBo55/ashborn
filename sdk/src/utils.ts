/**
 * Utility functions for Ashborn SDK
 */

import { PublicKey } from "@solana/web3.js";

/**
 * Generate a Pedersen commitment: C = g^amount * h^blinding
 *
 * This is a placeholder implementation. In production, use proper
 * elliptic curve cryptography (e.g., curve25519).
 *
 * @param amount - The amount to commit to
 * @param blindingFactor - 32-byte random blinding factor
 * @returns 32-byte commitment
 */
export function generateCommitment(
  amount: bigint,
  blindingFactor: Uint8Array,
): Uint8Array {
  if (blindingFactor.length !== 32) {
    throw new Error("Blinding factor must be 32 bytes");
  }

  // Placeholder: In production, use proper Pedersen commitment
  // For demo, we hash amount || blinding
  const commitment = new Uint8Array(32);
  const amountBytes = bigintToBytes(amount, 8);

  // Simple hash-based commitment (NOT cryptographically secure for production)
  for (let i = 0; i < 32; i++) {
    commitment[i] =
      blindingFactor[i] ^ (amountBytes[i % 8] + i) ^ ((i * 31) % 256);
  }

  return commitment;
}

/**
 * Generate a nullifier from a note and owner's private key
 *
 * nullifier = hash(note_commitment || owner_secret || note_index)
 *
 * @param noteCommitment - The note's commitment
 * @param ownerPubkey - The owner's public key
 * @param noteIndex - The note's index in the vault
 * @returns 32-byte nullifier
 */
export function generateNullifier(
  noteCommitment: Uint8Array,
  ownerPubkey: PublicKey,
  noteIndex: number,
): Uint8Array {
  const nullifier = new Uint8Array(32);
  const pubkeyBytes = ownerPubkey.toBytes();
  const indexBytes = new Uint8Array(4);
  new DataView(indexBytes.buffer).setUint32(0, noteIndex, true);

  // Simple hash-based nullifier (placeholder)
  for (let i = 0; i < 32; i++) {
    nullifier[i] =
      noteCommitment[i] ^ pubkeyBytes[i] ^ indexBytes[i % 4] ^ ((i * 17) % 256);
  }

  return nullifier;
}

/**
 * Hash a view key for storage using SHA-256
 * 
 * Uses Web Crypto API for secure hashing.
 *
 * @param viewKey - The view key to hash
 * @returns 32-byte hash
 */
export function hashViewKey(viewKey: Uint8Array): Uint8Array {
  // Use synchronous hash for compatibility
  return sha256Hash(viewKey);
}

/**
 * Compute SHA-256 hash of data
 * 
 * Uses a synchronous implementation compatible with both Node.js and browser.
 *
 * @param data - Data to hash
 * @returns 32-byte hash
 */
export function sha256Hash(data: Uint8Array): Uint8Array {
  // SHA-256 implementation using built-in crypto
  // For Node.js: use crypto module
  // For browser: use Web Crypto API (async workaround)

  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    // Browser/modern Node.js - use synchronous fallback
    // since Web Crypto is async and we need sync
    return sha256Sync(data);
  }

  // Node.js fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');
    return new Uint8Array(crypto.createHash('sha256').update(data).digest());
  } catch {
    // Final fallback to sync implementation
    return sha256Sync(data);
  }
}

/**
 * Synchronous SHA-256 implementation
 * Pure JavaScript implementation for environments without crypto
 */
function sha256Sync(data: Uint8Array): Uint8Array {
  // SHA-256 constants
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  // Initial hash values
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  // Pre-processing
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  const padLen = ((msgLen + 8) % 64 > 56) ? 128 - ((msgLen + 8) % 64) : 64 - ((msgLen + 8) % 64);
  const padded = new Uint8Array(msgLen + padLen);
  padded.set(data);
  padded[msgLen] = 0x80;

  // Append length in bits as 64-bit big-endian
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 4, bitLen, false);

  // Process each 64-byte chunk
  const W = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    // Prepare message schedule
    for (let i = 0; i < 16; i++) {
      W[i] = dv.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    // Initialize working variables
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    // Compression
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g; g = f; f = e;
      e = (d + temp1) >>> 0;
      d = c; c = b; b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Add compressed chunk to hash
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }

  // Produce final hash
  const result = new Uint8Array(32);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);
  resultView.setUint32(20, h5, false);
  resultView.setUint32(24, h6, false);
  resultView.setUint32(28, h7, false);

  return result;
}

function rotr(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

/**
 * Encrypt an amount using the view key
 *
 * @param amount - Amount to encrypt
 * @param viewKeyHash - Hash of the view key
 * @returns 48-byte encrypted amount
 */
export function encryptAmount(
  amount: bigint,
  viewKeyHash: Uint8Array,
): Uint8Array {
  const encrypted = new Uint8Array(48);
  const amountBytes = bigintToBytes(amount, 8);

  // XOR encryption (placeholder - use ChaCha20 in production)
  for (let i = 0; i < 8; i++) {
    encrypted[i] = amountBytes[i] ^ viewKeyHash[i];
  }

  // Padding
  for (let i = 8; i < 48; i++) {
    encrypted[i] = viewKeyHash[i % 32];
  }

  return encrypted;
}

/**
 * Decrypt an amount using the view key
 *
 * @param encryptedAmount - Encrypted amount bytes
 * @param viewKeyHash - Hash of the view key
 * @returns Decrypted amount
 */
export function decryptAmount(
  encryptedAmount: Uint8Array,
  viewKeyHash: Uint8Array,
): bigint {
  const amountBytes = new Uint8Array(8);

  // XOR decryption
  for (let i = 0; i < 8; i++) {
    amountBytes[i] = encryptedAmount[i] ^ viewKeyHash[i];
  }

  return bytesToBigint(amountBytes);
}

/**
 * Generate random bytes
 *
 * @param length - Number of bytes to generate
 * @returns Random bytes
 */
export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * Convert bigint to bytes (little-endian)
 */
export function bigintToBytes(value: bigint, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  let remaining = value;

  for (let i = 0; i < length; i++) {
    bytes[i] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }

  return bytes;
}

/**
 * Convert bytes to bigint (little-endian)
 */
export function bytesToBigint(bytes: Uint8Array): bigint {
  let value = 0n;

  for (let i = bytes.length - 1; i >= 0; i--) {
    value = (value << 8n) | BigInt(bytes[i]);
  }

  return value;
}

/**
 * Format amount for display
 *
 * @param amount - Amount in base units (lamports)
 * @param decimals - Token decimals (default 9 for SOL)
 * @returns Formatted string
 */
export function formatAmount(amount: bigint, decimals = 9): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, "0");
  const trimmed = fractionStr.replace(/0+$/, "");

  return `${whole}.${trimmed}`;
}

/**
 * Parse amount from string
 *
 * @param amountStr - Amount as string
 * @param decimals - Token decimals
 * @returns Amount in base units
 */
export function parseAmount(amountStr: string, decimals = 9): bigint {
  const [whole, fraction = ""] = amountStr.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction);
}
