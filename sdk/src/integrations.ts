/**
 * Ashborn SDK - Third-Party Integrations
 * 
 * Import this module for PrivacyCash, Helius, and NLP integrations.
 * 
 * @example
 * ```typescript
 * import { PrivacyCashOfficial, HeliusEnhanced } from '@alleyboss/ashborn-sdk/integrations';
 * 
 * const pc = new PrivacyCashOfficial({ rpcUrl, owner });
 * const helius = createHeliusEnhanced(apiKey);
 * ```
 */

export { PrivacyCash } from "./privacycash";
export { PrivacyCashOfficial } from "./privacycash-official";
export { HeliusEnhanced, createHeliusEnhanced } from "./helius";
export { NaturalLanguageParser, NaturalLanguageAshborn } from "./nlp";
export type { ParsedIntent, ConfirmationRequest } from "./nlp";

// NFT Privacy
export { PrivateNFTManager, createNFTPrivacy } from "./nft";
export type { PrivateNFT, NFTTransferProof } from "./nft";
