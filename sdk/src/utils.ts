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
 * Hash a view key for storage
 *
 * @param viewKey - The view key to hash
 * @returns 32-byte hash
 */
export function hashViewKey(viewKey: Uint8Array): Uint8Array {
  const hash = new Uint8Array(32);

  // Simple hash (placeholder - use SHA256 in production)
  for (let i = 0; i < 32; i++) {
    hash[i] = viewKey[i % viewKey.length] ^ ((i * 37) % 256);
  }

  return hash;
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
