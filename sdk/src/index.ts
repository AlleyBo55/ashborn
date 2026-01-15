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
 * import { Ashborn } from '@alleyboss/ashborn-sdk';
 * import { ShadowWire } from '@alleyboss/ashborn-sdk/stealth';
 * import { RangeCompliance } from '@alleyboss/ashborn-sdk/zk';
 * 
 * const ashborn = new Ashborn(connection, wallet);
 * await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
 * ```
 */

// Core SDK - minimal footprint
export { Ashborn } from "./ashborn";

// Types and constants (always needed)
export * from "./types";
export * from "./constants";
