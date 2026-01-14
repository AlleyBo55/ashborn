//! ZK module exports
//!
//! Real cryptographic verification using Solana's Alt_bn128 syscalls

pub mod verifier;
pub mod poseidon;
pub mod vkeys;
pub mod vkeys_generated;  // Real VKs from Circom circuits

pub use verifier::*;
pub use poseidon::{poseidon_hash_2, create_commitment, generate_nullifier};
// vkeys are accessed via crate::zk::vkeys_generated::*

