/**
 * Ashborn SDK - Stealth Addresses & Transaction Privacy
 * 
 * Import this module for stealth address generation and decoy outputs.
 * 
 * @example
 * ```typescript
 * import { ShadowWire, generateDecoys } from '@alleyboss/ashborn-sdk/stealth';
 * 
 * const shadowWire = new ShadowWire(connection, wallet);
 * const stealth = await shadowWire.generateStealthAddress();
 * ```
 */

export { ShadowWire } from "./shadowwire";
export { generateDecoys, createTransferWithDecoys, findRealOutput, DECOY_COUNT } from "./decoys";
export * from "./crypto";
