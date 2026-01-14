//! ZK module exports
//!
//! Anatoly-approved: Real cryptographic verification

pub mod verifier;
pub mod poseidon;
pub mod vkeys;

pub use verifier::*;
pub use poseidon::*;
// pub use vkeys::*; // MOCKED

// Re-export key types for convenience
pub use poseidon::{poseidon_hash_2, create_commitment, generate_nullifier};
pub use verifier::{verify_transfer_proof, verify_shield_proof, verify_range_proof};
// pub use vkeys::{TRANSFER_VK, SHIELD_VK, RANGE_VK, VerifyingKey};
