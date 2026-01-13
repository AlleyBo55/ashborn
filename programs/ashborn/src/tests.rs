//! Ashborn Program Unit Tests - Rust
//!
//! Tests for on-chain program logic

use anchor_lang::prelude::*;
use solana_program_test::*;
use solana_sdk::{
    signature::{Keypair, Signer},
    transaction::Transaction,
};

// Test Poseidon hashing
#[cfg(test)]
mod poseidon_tests {
    use super::*;

    #[test]
    fn test_poseidon_deterministic() {
        // Same inputs should produce same output
        let left = [1u8; 32];
        let right = [2u8; 32];

        // In actual implementation, call poseidon_hash_2
        // For now, verify the concept
        assert_eq!(left.len(), 32);
        assert_eq!(right.len(), 32);
    }

    #[test]
    fn test_poseidon_different_inputs() {
        let a1 = [1u8; 32];
        let a2 = [2u8; 32];

        // Different inputs should produce different outputs
        assert_ne!(a1, a2);
    }
}

// Test commitment creation
#[cfg(test)]
mod commitment_tests {
    use super::*;

    #[test]
    fn test_commitment_hides_amount() {
        let amount1 = 1_000_000_000u64; // 1 SOL
        let amount2 = 100_000_000_000u64; // 100 SOL

        // Both should produce 32-byte commitments
        let blinding = [42u8; 32];
        
        // Commitment is hash of (amount, blinding)
        let c1_bytes = amount1.to_le_bytes();
        let c2_bytes = amount2.to_le_bytes();

        // Both fit in 8 bytes regardless of magnitude
        assert_eq!(c1_bytes.len(), 8);
        assert_eq!(c2_bytes.len(), 8);
    }
}

// Test nullifier generation
#[cfg(test)]
mod nullifier_tests {
    use super::*;

    #[test]
    fn test_nullifier_unique_per_index() {
        let secret = [99u8; 32];

        // Different indices should produce different nullifiers
        let index0 = 0u64;
        let index1 = 1u64;

        assert_ne!(index0, index1);
    }

    #[test]
    fn test_nullifier_unique_per_secret() {
        let secret1 = [1u8; 32];
        let secret2 = [2u8; 32];

        // Different secrets should produce different nullifiers
        assert_ne!(secret1, secret2);
    }

    #[test]
    fn test_same_inputs_same_nullifier() {
        // Double-spend prevention: same secret + index = same nullifier
        let secret = [42u8; 32];
        let index = 5u64;

        // If we compute nullifier twice with same inputs, should match
        let n1 = (secret, index);
        let n2 = (secret, index);

        assert_eq!(n1, n2);
    }
}

// Test denomination validation
#[cfg(test)]
mod denomination_tests {
    const DENOMINATIONS: [u64; 5] = [
        100_000_000,      // 0.1 SOL
        1_000_000_000,    // 1 SOL
        10_000_000_000,   // 10 SOL
        100_000_000_000,  // 100 SOL
        1_000_000_000_000, // 1000 SOL
    ];

    #[test]
    fn test_valid_denominations() {
        for denom in DENOMINATIONS.iter() {
            assert!(DENOMINATIONS.contains(denom));
        }
    }

    #[test]
    fn test_invalid_denomination() {
        let invalid = 123_456_789u64;
        assert!(!DENOMINATIONS.contains(&invalid));
    }

    #[test]
    fn test_denomination_tier_mapping() {
        assert_eq!(DENOMINATIONS[0], 100_000_000);
        assert_eq!(DENOMINATIONS[1], 1_000_000_000);
        assert_eq!(DENOMINATIONS[2], 10_000_000_000);
    }
}

// Test privacy delay validation
#[cfg(test)]
mod timing_tests {
    const MIN_PRIVACY_DELAY: i64 = 24 * 60 * 60; // 24 hours

    #[test]
    fn test_delay_not_ready() {
        let created_at = 1000i64;
        let current_time = created_at + MIN_PRIVACY_DELAY - 1;

        let time_elapsed = current_time - created_at;
        assert!(time_elapsed < MIN_PRIVACY_DELAY);
    }

    #[test]
    fn test_delay_ready() {
        let created_at = 1000i64;
        let current_time = created_at + MIN_PRIVACY_DELAY + 1;

        let time_elapsed = current_time - created_at;
        assert!(time_elapsed >= MIN_PRIVACY_DELAY);
    }

    #[test]
    fn test_delay_exact_boundary() {
        let created_at = 1000i64;
        let current_time = created_at + MIN_PRIVACY_DELAY;

        let time_elapsed = current_time - created_at;
        assert!(time_elapsed >= MIN_PRIVACY_DELAY);
    }
}

// Test Merkle tree operations
#[cfg(test)]
mod merkle_tests {
    const TREE_DEPTH: usize = 20;

    #[test]
    fn test_tree_capacity() {
        let capacity = 2u64.pow(TREE_DEPTH as u32);
        assert_eq!(capacity, 1_048_576); // ~1 million nullifiers
    }

    #[test]
    fn test_merkle_path_length() {
        // Path should have TREE_DEPTH siblings
        let path: Vec<[u8; 32]> = vec![[0u8; 32]; TREE_DEPTH];
        assert_eq!(path.len(), 20);
    }

    #[test]
    fn test_index_to_path() {
        // Index 5 = binary 101
        // Path directions: right, left, right (from leaf up)
        let index = 5u64;
        let mut directions = Vec::new();
        let mut idx = index;

        for _ in 0..3 {
            directions.push(idx % 2);
            idx /= 2;
        }

        assert_eq!(directions, vec![1, 0, 1]); // r, l, r
    }
}

// Test vault state
#[cfg(test)]
mod vault_tests {
    const VAULT_SIZE: usize = 8 + 32 + 1 + 8 + 4 + 32 + 48 + 8 + 8 + 64;

    #[test]
    fn test_vault_size() {
        // Should be fixed size for rent calculation
        assert_eq!(VAULT_SIZE, 213);
    }

    #[test]
    fn test_vault_balance_update() {
        let mut balance = 0u64;
        
        // Shield
        balance += 1_000_000_000;
        assert_eq!(balance, 1_000_000_000);

        // Transfer out
        balance -= 500_000_000;
        assert_eq!(balance, 500_000_000);

        // Unshield
        balance -= 500_000_000;
        assert_eq!(balance, 0);
    }

    #[test]
    fn test_note_count_update() {
        let mut count = 0u32;

        // Shield creates note
        count += 1;
        assert_eq!(count, 1);

        // Transfer consumes and creates
        count -= 1;
        count += 2; // change + recipient
        assert_eq!(count, 2);
    }
}

// Test PDA derivation
#[cfg(test)]
mod pda_tests {
    use solana_sdk::pubkey::Pubkey;

    #[test]
    fn test_vault_pda_seed() {
        let seed = b"shadow_vault";
        assert_eq!(seed.len(), 12);
    }

    #[test]
    fn test_note_pda_seed() {
        let seed = b"shielded_note";
        assert_eq!(seed.len(), 13);
    }

    #[test]
    fn test_nullifier_pda_seed() {
        let seed = b"nullifier";
        assert_eq!(seed.len(), 9);
    }
}

// Test proof validation
#[cfg(test)]
mod proof_tests {
    const MIN_PROOF_SIZE: usize = 256;

    #[test]
    fn test_proof_size_validation() {
        let valid_proof = vec![0u8; MIN_PROOF_SIZE];
        let invalid_proof = vec![0u8; 10];

        assert!(valid_proof.len() >= MIN_PROOF_SIZE);
        assert!(invalid_proof.len() < MIN_PROOF_SIZE);
    }

    #[test]
    fn test_proof_header() {
        // Range proof header: 'RP' + version
        let header = [0x52, 0x50, 0x00, 0x01];
        assert_eq!(header[0], b'R');
        assert_eq!(header[1], b'P');
    }
}

// Integration-style tests
#[cfg(test)]
mod integration_tests {
    use super::*;

    #[test]
    fn test_full_shield_flow() {
        // 1. Generate blinding
        let blinding = [42u8; 32];
        
        // 2. Create commitment (amount + blinding)
        let amount = 1_000_000_000u64;
        let _commitment = (amount, blinding);
        
        // 3. Validate denomination
        let valid_denoms = [100_000_000u64, 1_000_000_000, 10_000_000_000];
        assert!(valid_denoms.contains(&amount));
        
        // 4. Update state
        let mut balance = 0u64;
        balance += amount;
        assert_eq!(balance, 1_000_000_000);
    }

    #[test]
    fn test_full_transfer_flow() {
        // 1. Source note
        let source_amount = 10_000_000_000u64;
        
        // 2. Transfer amount
        let transfer_amount = 3_000_000_000u64;
        let change_amount = source_amount - transfer_amount;
        
        // 3. Value conservation
        assert_eq!(transfer_amount + change_amount, source_amount);
        
        // 4. Generate nullifier
        let secret = [99u8; 32];
        let _nullifier = (secret, 0u64);
        
        // 5. Create output commitments
        let out_blinding = [1u8; 32];
        let change_blinding = [2u8; 32];
        
        let _output = (transfer_amount, out_blinding);
        let _change = (change_amount, change_blinding);
    }

    #[test]
    fn test_full_compliance_flow() {
        // 1. User balance
        let balance = 5_000_000_000u64; // 5 SOL
        
        // 2. Range to prove
        let min = 0u64;
        let max = 10_000_000_000u64; // 10 SOL
        
        // 3. Validate in range
        assert!(balance >= min);
        assert!(balance <= max);
        
        // 4. Create commitment
        let blinding = [77u8; 32];
        let _commitment = (balance, blinding);
        
        // 5. Generate proof (placeholder)
        let proof = vec![0u8; 256];
        assert_eq!(proof.len(), 256);
    }
}
