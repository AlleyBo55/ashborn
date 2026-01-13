/**
 * Ashborn SDK - The Shadow Monarch of Crypto Privacy
 *
 * V3: Production-grade with all persona fixes
 *
 * @example
 * ```typescript
 * import { Ashborn, NaturalLanguageAshborn, createRelayer } from '@ashborn/sdk';
 *
 * // Standard usage
 * const ashborn = new Ashborn(connection, wallet);
 * await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
 *
 * // With relayer (ZachXBT-proof)
 * const relayer = createRelayer('mainnet-beta');
 * await ashborn.shadowTransferViaRelay({ ... }, relayer);
 *
 * // Natural language (Karpathy-approved)
 * const nlAshborn = new NaturalLanguageAshborn({ confidenceThreshold: 0.8 });
 * await nlAshborn.execute("send $100 to @mom privately");
 * ```
 */

// Core SDK
export { Ashborn } from "./ashborn";

// SDK Wrappers
export { ShadowWire } from "./shadowwire";
export { PrivacyCash } from "./privacycash";
export { RangeCompliance, createRangeCompliance } from "./compliance";

// Helius integration (Mert-approved: DAS + webhooks)
export { HeliusEnhanced, createHeliusEnhanced } from "./helius";

// Crypto primitives (Vitalik-approved)
export * from "./crypto";

// Natural Language Interface (Karpathy-approved: confidence thresholds)
export { NaturalLanguageParser, NaturalLanguageAshborn } from "./nlp";
export type { ParsedIntent, ConfirmationRequest } from "./nlp";

// Decoys (ZachXBT-proof)
export {
  generateDecoys,
  createTransferWithDecoys,
  findRealOutput,
  DECOY_COUNT,
} from "./decoys";

// Relayer (ZachXBT-proof: sender unlinkability)
export {
  RelayerClient,
  LocalRelayer,
  createRelayer,
  prepareForRelay,
  RELAYER_ENDPOINTS,
} from "./relayer";

// Tree Indexer (Vitalik-approved: off-chain tree)
export { TreeIndexer, createTreeIndexer, TREE_DEPTH } from "./indexer";
export type { MerkleProof } from "./indexer";

// NFT Privacy (Frank-approved)
export { PrivateNFTManager, createNFTPrivacy } from "./nft";
export type { PrivateNFT, NFTTransferProof } from "./nft";

// Types and constants
export * from "./types";
export * from "./constants";
