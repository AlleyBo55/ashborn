//! # Ashborn: The Shadow Monarch of Crypto Privacy
//! 
//! A production-grade privacy layer on Solana integrating:
//! - Real Groth16 ZK proofs (Anatoly-approved)
//! - Merkle tree nullifiers (Vitalik-approved)
//! - Denomination-based privacy (ZachXBT-proof)
//! - Radr Labs ShadowWire for unlinkable P2P transfers
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

declare_id!("ASHBrnShdwMnrch1111111111111111111111111");

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

    /// Shield assets into the privacy pool
    /// 
    /// Integrates with Privacy Cash SDK for confidential deposits.
    /// Creates an encrypted note with amount commitment.
    pub fn shield_deposit(
        ctx: Context<ShieldDeposit>,
        amount: u64,
        commitment: [u8; 32],
    ) -> Result<()> {
        instructions::shield::handler(ctx, amount, commitment)
    }

    /// Execute a shadow transfer - unlinkable P2P payment
    /// 
    /// Integrates with Radr Labs ShadowWire for stealth addresses.
    /// Uses nullifiers to prevent double-spending.
    pub fn shadow_transfer(
        ctx: Context<ShadowTransfer>,
        nullifier: [u8; 32],
        new_commitment: [u8; 32],
        recipient_commitment: [u8; 32],
        proof: Vec<u8>,
    ) -> Result<()> {
        instructions::transfer::handler(
            ctx,
            nullifier,
            new_commitment,
            recipient_commitment,
            proof,
        )
    }

    /// Generate selective disclosure proof
    /// 
    /// Integrates with Range Compliance Tools for regulatory compliance.
    /// Proves statements about balances without revealing exact amounts.
    pub fn selective_reveal(
        ctx: Context<SelectiveReveal>,
        proof_type: ProofType,
        range_min: u64,
        range_max: u64,
        proof_data: Vec<u8>,
    ) -> Result<()> {
        instructions::reveal::handler(ctx, proof_type, range_min, range_max, proof_data)
    }

    /// Unshield assets back to public Solana
    /// 
    /// Exit the shadow realm with a valid nullifier proof.
    pub fn unshield(
        ctx: Context<Unshield>,
        amount: u64,
        nullifier: [u8; 32],
        proof: Vec<u8>,
    ) -> Result<()> {
        instructions::unshield::handler(ctx, amount, nullifier, proof)
    }
}

/// Proof types for selective disclosure
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
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
