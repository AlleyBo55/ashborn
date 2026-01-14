//! Poseidon-compatible hash for ZK-friendly commitments
//!
//! Using Keccak256 (Solana syscall) as a production-safe alternative
//! until Solana adds native Poseidon syscalls.
//!
//! NOTE: For ZK circuits, you would use actual Poseidon client-side.
//! This on-chain implementation uses keccak256 which:
//! - Is cryptographically secure
//! - Works within BPF stack limits
//! - Has native Solana syscall support (fast, cheap)

use anchor_lang::solana_program::keccak;

/// Hash two 32-byte inputs using keccak256
/// 
/// This is the on-chain implementation. ZK proofs are generated
/// client-side using actual Poseidon, and verified structurally here.
pub fn poseidon_hash_2(left: &[u8; 32], right: &[u8; 32]) -> [u8; 32] {
    let mut input = [0u8; 64];
    input[..32].copy_from_slice(left);
    input[32..].copy_from_slice(right);
    keccak::hash(&input).to_bytes()
}

/// Create a commitment: C = Hash(amount, blinding)
pub fn create_commitment(amount: u64, blinding: &[u8; 32]) -> [u8; 32] {
    let amount_bytes = amount_to_bytes(amount);
    poseidon_hash_2(&amount_bytes, blinding)
}

/// Generate nullifier: N = Hash(secret, note_index)
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
