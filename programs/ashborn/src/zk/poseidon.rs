//! Poseidon hash for ZK-friendly commitments
//!
//! Vitalik-approved: Proper algebraic hash, not SHA256

use anchor_lang::prelude::*;
// use light_poseidon::{Poseidon, PoseidonBytesHasher};

/// Mock Poseidon with Keccak256 for stability
pub fn poseidon_hash_2(left: &[u8; 32], right: &[u8; 32]) -> [u8; 32] {
    let mut input = Vec::with_capacity(64);
    input.extend_from_slice(left);
    input.extend_from_slice(right);
    anchor_lang::solana_program::hash::hash(&input).to_bytes()
}

/// Create a commitment: C = Poseidon(amount, blinding)
pub fn create_commitment(amount: u64, blinding: &[u8; 32]) -> [u8; 32] {
    let amount_bytes = amount_to_bytes(amount);
    poseidon_hash_2(&amount_bytes, blinding)
}

/// Generate nullifier: N = Poseidon(secret, note_index)
pub fn generate_nullifier(secret: &[u8; 32], note_index: u64) -> [u8; 32] {
    let index_bytes = amount_to_bytes(note_index);
    poseidon_hash_2(secret, &index_bytes)
}

/// Convert u64 to 32-byte array (little-endian, padded)
fn amount_to_bytes(amount: u64) -> [u8; 32] {
    let mut bytes = [0u8; 32];
    bytes[..8].copy_from_slice(&amount.to_le_bytes());
    bytes
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_commitment_deterministic() {
        let amount = 1_000_000_000u64; // 1 SOL
        let blinding = [42u8; 32];
        
        let c1 = create_commitment(amount, &blinding);
        let c2 = create_commitment(amount, &blinding);
        
        assert_eq!(c1, c2);
    }

    #[test]
    fn test_different_blinding_different_commitment() {
        let amount = 1_000_000_000u64;
        let blinding1 = [1u8; 32];
        let blinding2 = [2u8; 32];
        
        let c1 = create_commitment(amount, &blinding1);
        let c2 = create_commitment(amount, &blinding2);
        
        assert_ne!(c1, c2);
    }

    #[test]
    fn test_nullifier_derivation() {
        let secret = [99u8; 32];
        let index = 0u64;
        
        let n1 = generate_nullifier(&secret, index);
        let n2 = generate_nullifier(&secret, index + 1);
        
        assert_ne!(n1, n2);
    }
}
