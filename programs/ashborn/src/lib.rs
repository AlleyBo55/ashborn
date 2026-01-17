//! # Ashborn: The Shadow Monarch of Crypto Privacy
//! 
//! A production-grade privacy layer on Solana integrating:
//! - Real Groth16 ZK proofs 
//! - Merkle tree nullifiers 
//! - Denomination-based privacy 
//! - Native ShadowWire for unlinkable P2P transfers
//! - Privacy Cash for shielded stablecoin operations  
//! - Range Compliance for selective disclosure
//!
//! "I alone level up." — Sung Jin-Woo

use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;
pub mod zk;

#[cfg(test)]
mod tests;

use instructions::*;

declare_id!("BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe");

/// The Shadow Monarch program - orchestrates all privacy operations
#[program]
pub mod ashborn {
    use super::*;

    /// Initialize a user's Shadow Vault - their personal privacy fortress
    /// 
    /// The vault stores:
    /// - Shielded balance commitments
    /// - Nullifier set for double-spend prevention
    /// - View key for optional disclosure
    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    /// Shield assets (SDK-compatible simplified version)
    /// 
    /// Creates a shielded note with commitment. Demo-friendly version
    /// that doesn't require full Merkle tree proofs.
    pub fn shield(
        ctx: Context<Shield>,
        amount: u64,
        commitment: [u8; 32],
    ) -> Result<()> {
        instructions::shield::shield_simple_handler(ctx, amount, commitment)
    }

    /// Shield assets into the privacy pool (full version with proofs)
    /// 
    /// Integrates with Privacy Cash SDK for confidential deposits.
    /// Creates an encrypted note with amount commitment.
    pub fn shield_deposit(
        ctx: Context<ShieldDeposit>,
        amount: u64,
        commitment: [u8; 32],
        proof: Vec<u8>,
        merkle_siblings: [[u8; 32]; 20],
    ) -> Result<()> {
        instructions::shield::handler(ctx, amount, commitment, proof, merkle_siblings)
    }

    /// Execute a shadow transfer - unlinkable P2P payment
    /// 
    /// Integrates with Radr Labs ShadowWire for stealth addresses.
    /// Uses nullifiers to prevent double-spending.
    pub fn shadow_transfer(
        ctx: Context<ShadowTransfer>,
        nullifier: [u8; 32],
        output_commitment: [u8; 32],
        change_commitment: [u8; 32],
        proof: Vec<u8>,
        merkle_siblings: [[u8; 32]; 20],
        merkle_root: [u8; 32],
    ) -> Result<()> {
        instructions::transfer::handler(
            ctx,
            nullifier,
            output_commitment,
            change_commitment,
            proof,
            merkle_siblings,
            merkle_root,
        )
    }

    /// Generate selective disclosure proof
    /// 
    /// Integrates with Range Compliance Tools for regulatory compliance.
    /// Proves statements about balances without revealing exact amounts.
    pub fn selective_reveal(
        ctx: Context<SelectiveReveal>,
        proof_type: ProofType,
        timestamp: u64,
        range_min: u64,
        range_max: u64,
        proof_data: Vec<u8>,
        commitment: [u8; 32],
    ) -> Result<()> {
        instructions::reveal::handler(ctx, proof_type, timestamp, range_min, range_max, proof_data, commitment)
    }

    /// Unshield assets back to public Solana
    /// 
    /// Exit the shadow realm with a valid nullifier proof.
    pub fn unshield(
        ctx: Context<Unshield>,
        amount: u64,
        nullifier: [u8; 32],
        proof: Vec<u8>,
        merkle_siblings: [[u8; 32]; 20],
    ) -> Result<()> {
        instructions::unshield::handler(ctx, amount, nullifier, proof, merkle_siblings)
    }
}

/// Proof types for selective disclosure
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum ProofType {
    /// Prove balance is within a range (e.g., $0 - $10,000)
    RangeProof,
    /// Prove ownership without revealing amount
    OwnershipProof,
    /// Prove compliance with AML limits
    ComplianceProof,
    /// Custom proof for specific requirements
    Custom,
}
