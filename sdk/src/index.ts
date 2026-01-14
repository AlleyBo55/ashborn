/**
 * Ashborn SDK - The Shadow Monarch of Crypto Privacy
 *
 * V4: Production-grade with advanced security defenses
 *
 * @example
 * ```typescript
 * import { Ashborn, NaturalLanguageAshborn, createRelayer } from '@ashborn/sdk';
 *
 * // Standard usage
 * const ashborn = new Ashborn(connection, wallet);
 * await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
 *
 * // With relayer (sender unlinkability)
 * const relayer = createRelayer('mainnet-beta');
 * await ashborn.shadowTransferViaRelay({ ... }, relayer);
 *
 * // Natural language interface
 * const nlAshborn = new NaturalLanguageAshborn({ confidenceThreshold: 0.8 });
 * await nlAshborn.execute("send $100 to @mom privately");
 *
 * // With Tor anonymity
 * const torConnection = createTorConnection(rpcUrl);
 * const ashborn = new Ashborn(torConnection, wallet);
 * ```
 */

// Core SDK
export { Ashborn } from "./ashborn";

// SDK Wrappers
export { ShadowWire } from "./shadowwire";
export { PrivacyCash } from "./privacycash";
export { PrivacyCashOfficial } from "./privacycash-official";
export { RangeCompliance, createRangeCompliance } from "./compliance";

// Helius integration (DAS + webhooks)
export { HeliusEnhanced, createHeliusEnhanced } from "./helius";

// Crypto primitives
export * from "./crypto";

// Natural Language Interface
export { NaturalLanguageParser, NaturalLanguageAshborn } from "./nlp";
export type { ParsedIntent, ConfirmationRequest } from "./nlp";

// Decoys (transaction privacy)
export {
  generateDecoys,
  createTransferWithDecoys,
  findRealOutput,
  DECOY_COUNT,
} from "./decoys";

// Relayer (sender unlinkability)
export {
  RelayerClient,
  LocalRelayer,
  createRelayer,
  prepareForRelay,
  RELAYER_ENDPOINTS,
} from "./relayer";

// Tree Indexer (off-chain tree)
export { TreeIndexer, createTreeIndexer, TREE_DEPTH } from "./indexer";
export type { MerkleProof } from "./indexer";

// NFT Privacy
export { PrivateNFTManager, createNFTPrivacy } from "./nft";
export type { PrivateNFT, NFTTransferProof } from "./nft";

// ============ Security Defenses ============

// Circuit Integrity (Supply Chain Protection)
export {
  verifyCircuitIntegrity,
  loadVerifiedCircuit,
  downloadAllCircuits,
  verifyLocalCircuits,
  TRUSTED_CIRCUIT_HASHES,
  CIRCUIT_SOURCES,
} from "./circuits";

// Encrypted Keystore (View Key Protection)
export {
  encryptViewKey,
  decryptViewKey,
  lockKeystore,
  lockAllKeystores,
  isKeystoreUnlocked,
  changePassword,
  exportKeystore,
  importKeystore,
} from "./keystore";
export type { EncryptedKeystore, KeystoreConfig } from "./keystore";

// Tor/Anonymity (IP Protection)
export {
  isTorAvailable,
  getTorExitIP,
  createTorConnection,
  requestNewCircuit,
  submitAnonymously,
  calculatePrivacyScore,
  TOR_DEFAULTS,
  TOR_BROWSER_CONFIG,
  DEFAULT_ANONYMITY_CONFIG,
  MAX_ANONYMITY_CONFIG,
} from "./tor";
export type { TorConfig, AnonymityConfig } from "./tor";

// Types and constants
export * from "./types";
export * from "./constants";

