/**
 * Ashborn SDK - The Shadow Monarch of Crypto Privacy
 * 
 * CORE PACKAGE - Minimal footprint (~30KB)
 * 
 * For additional features, import from sub-packages:
 * - `@alleyboss/ashborn-sdk/stealth` - Stealth addresses & decoys
 * - `@alleyboss/ashborn-sdk/zk` - Zero-knowledge proofs
 * - `@alleyboss/ashborn-sdk/integrations` - PrivacyCash, Helius, NLP
 * - `@alleyboss/ashborn-sdk/security` - Keystore, Tor, Relayers
 * 
 * @example
 * ```typescript
 * import { Ashborn, PrivacyRelay } from '@alleyboss/ashborn-sdk';
 * 
 * // Client-side: Direct SDK usage
 * const ashborn = new Ashborn(connection, wallet);
 * await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
 * 
 * // Server-side: Privacy Relay (protocols see relay, not user)
 * const relay = new PrivacyRelay({ relayKeypair, rpcUrl });
 * await relay.shield({ amount: 0.1 });
 * ```
 */

// Core SDK - minimal footprint
export { Ashborn } from "./ashborn";

// Privacy Relay - server-side omnibus identity
export { PrivacyRelay } from "./relay";
export type {
    PrivacyRelayConfig,
    RelayResult,
    StealthResult,
    TransferResult,
    ProofResult,
} from "./relay";

// Types and constants (always needed)
export * from "./types";
export * from "./constants";

