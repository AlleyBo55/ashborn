/**
 * Ashborn SDK - Zero-Knowledge Proofs
 * 
 * Import this module for ZK range proofs and compliance.
 * Requires snarkjs as a peer dependency.
 * 
 * @example
 * ```typescript
 * import { RangeCompliance, createRangeCompliance } from '@alleyboss/ashborn-sdk/zk';
 * 
 * const compliance = createRangeCompliance(connection, wallet);
 * const proof = await compliance.generateRangeProof(value, blinding, min, max);
 * ```
 */

export { RangeCompliance, createRangeCompliance } from "./compliance";
export { TreeIndexer, createTreeIndexer, TREE_DEPTH } from "./indexer";
export type { MerkleProof } from "./indexer";
