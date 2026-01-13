/**
 * Constants for Ashborn SDK
 */

import { PublicKey } from "@solana/web3.js";

/**
 * Ashborn program ID (placeholder - will be updated on deploy)
 */
export const PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111", // System Program ID (Valid Placeholder)
);

/**
 * PDA seeds for account derivation
 */
export const SEEDS = {
  SHADOW_VAULT: "shadow_vault",
  SHIELDED_NOTE: "shielded_note",
  NULLIFIER: "nullifier",
  COMPLIANCE_PROOF: "compliance_proof",
  POOL_AUTHORITY: "pool_authority",
  PROTOCOL_STATE: "protocol_state",
} as const;

/**
 * Default configuration values
 */
export const DEFAULTS = {
  /** Commitment level for transactions */
  COMMITMENT: "confirmed" as const,
  /** Proof expiration in seconds (30 days) */
  PROOF_EXPIRATION: 30 * 24 * 60 * 60,
  /** Maximum shield amount (100 SOL in lamports) */
  MAX_SHIELD_AMOUNT: 100_000_000_000n,
  /** Minimum shield amount (0.001 SOL in lamports) */
  MIN_SHIELD_AMOUNT: 1_000_000n,
};

/**
 * Error codes matching on-chain errors
 */
export const ERROR_CODES = {
  VAULT_ALREADY_EXISTS: 6000,
  VAULT_NOT_FOUND: 6001,
  UNAUTHORIZED_VAULT_ACCESS: 6002,
  INVALID_COMMITMENT: 6100,
  ZERO_AMOUNT: 6101,
  AMOUNT_TOO_LARGE: 6102,
  INSUFFICIENT_BALANCE: 6103,
  NULLIFIER_ALREADY_USED: 6200,
  INVALID_NULLIFIER: 6201,
  PROOF_VERIFICATION_FAILED: 6203,
  INVALID_RANGE: 6301,
  PROTOCOL_PAUSED: 6400,
} as const;

/**
 * RPC endpoints for different clusters
 */
export const RPC_ENDPOINTS = {
  MAINNET: "https://api.mainnet-beta.solana.com",
  DEVNET: "https://api.devnet.solana.com",
  TESTNET: "https://api.testnet.solana.com",
  LOCALNET: "http://localhost:8899",
} as const;
