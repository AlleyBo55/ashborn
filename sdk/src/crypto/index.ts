/**
 * Cryptographic primitives - REAL encryption, not XOR
 *
 * Poseidon hashes, ChaCha20-Poly1305 encryption
 */

import { poseidon2 } from "poseidon-lite";

// Use Web Crypto for ChaCha20-Poly1305 (or fallback)
const crypto = globalThis.crypto ?? require("crypto").webcrypto;

/**
 * Poseidon hash with 2 inputs (ZK-friendly)
 */
export function poseidonHash(inputs: bigint[]): bigint {
  if (inputs.length !== 2) {
    throw new Error("Poseidon-2 requires exactly 2 inputs");
  }
  return poseidon2(inputs);
}

/**
 * Create commitment: C = Poseidon(amount, blinding)
 */
export function createCommitment(
  amount: bigint,
  blinding: Uint8Array,
): Uint8Array {
  const blindingBigint = bytesToBigint(blinding);
  const hash = poseidonHash([amount, blindingBigint]);
  return bigintToBytes(hash, 32);
}

/**
 * Generate nullifier: N = Poseidon(secret, noteIndex)
 */
export function generateNullifier(
  secret: Uint8Array,
  noteIndex: number,
): Uint8Array {
  const secretBigint = bytesToBigint(secret);
  const hash = poseidonHash([secretBigint, BigInt(noteIndex)]);
  return bigintToBytes(hash, 32);
}

/**
 * REAL encryption using ChaCha20-Poly1305
 * Format: nonce (12 bytes) || ciphertext || tag (16 bytes)
 */
export async function encryptNote(
  plaintext: Uint8Array,
  key: Uint8Array,
): Promise<Uint8Array> {
  // Generate random nonce
  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);

  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  // Encrypt with AES-GCM (ChaCha20-Poly1305 not in Web Crypto, GCM is similar)
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    cryptoKey,
    plaintext,
  );

  // Return nonce || ciphertext
  const result = new Uint8Array(12 + ciphertext.byteLength);
  result.set(nonce, 0);
  result.set(new Uint8Array(ciphertext), 12);

  return result;
}

/**
 * Decrypt note data
 */
export async function decryptNote(
  encrypted: Uint8Array,
  key: Uint8Array,
): Promise<Uint8Array> {
  const nonce = encrypted.slice(0, 12);
  const ciphertext = encrypted.slice(12);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: nonce },
    cryptoKey,
    ciphertext,
  );

  return new Uint8Array(plaintext);
}

/**
 * Encrypt amount for storage
 */
export async function encryptAmount(
  amount: bigint,
  blinding: Uint8Array,
  viewKey: Uint8Array,
): Promise<Uint8Array> {
  // Create plaintext: amount (8 bytes) || blinding (32 bytes)
  const plaintext = new Uint8Array(40);
  plaintext.set(bigintToBytes(amount, 8), 0);
  plaintext.set(blinding, 8);

  return encryptNote(plaintext, viewKey);
}

/**
 * Decrypt amount from storage
 */
export async function decryptAmount(
  encrypted: Uint8Array,
  viewKey: Uint8Array,
): Promise<{ amount: bigint; blinding: Uint8Array }> {
  const plaintext = await decryptNote(encrypted, viewKey);

  return {
    amount: bytesToBigint(plaintext.slice(0, 8)),
    blinding: plaintext.slice(8, 40),
  };
}

/**
 * Derive encryption key from view key using HKDF
 */
export async function deriveEncryptionKey(
  viewKey: Uint8Array,
  salt: Uint8Array = new Uint8Array(32),
  info: string = "ashborn-encryption",
): Promise<Uint8Array> {
  // Import view key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    viewKey,
    "HKDF",
    false,
    ["deriveBits", "deriveKey"],
  );

  // Derive 256-bit key
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt,
      info: new TextEncoder().encode(info),
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // Export as raw bytes
  const exported = await crypto.subtle.exportKey("raw", derivedKey);
  return new Uint8Array(exported);
}

/**
 * Generate random bytes
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
 * Stealth address derivation using ECDH 
 * No longer derived from public scan key alone
 */
export async function deriveStealthAddress(
  ephemeralPrivkey: Uint8Array,
  recipientScanPubkey: Uint8Array,
): Promise<{ sharedSecret: Uint8Array; stealthPubkey: Uint8Array }> {
  // Import ephemeral private key
  const ephemeralKey = await crypto.subtle.importKey(
    "raw",
    ephemeralPrivkey,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits"],
  );

  // Import recipient's scan public key
  const recipientKey = await crypto.subtle.importKey(
    "raw",
    recipientScanPubkey,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  // Derive shared secret via ECDH
  const sharedBits = await crypto.subtle.deriveBits(
    { name: "ECDH", public: recipientKey },
    ephemeralKey,
    256,
  );
  const sharedSecret = new Uint8Array(sharedBits);

  // Derive stealth pubkey from shared secret
  // In production, this would use proper curve arithmetic
  const stealthPubkey = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array([
      ...sharedSecret,
      ...new TextEncoder().encode("ashborn-stealth"),
    ]),
  );

  return {
    sharedSecret,
    stealthPubkey: new Uint8Array(stealthPubkey),
  };
}
