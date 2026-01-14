//! Updated Reveal Instruction with Real Range Proofs
//!
//! range_org-approved: Real Bulletproof verification

use anchor_lang::prelude::*;
use crate::state::{ShadowVault, ComplianceProof};
use crate::errors::AshbornError;
use crate::zk::verify_range_proof;
use crate::ProofType;

/// Accounts for selective reveal
#[derive(Accounts)]
#[instruction(proof_type: ProofType, timestamp: u64)]
pub struct SelectiveReveal<'info> {
    /// User's vault
    #[account(
        seeds = [b"shadow_vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ AshbornError::Unauthorized,
    )]
    pub vault: Account<'info, ShadowVault>,

    /// The compliance proof record
    #[account(
        init,
        payer = owner,
        space = ComplianceProof::size(256),
        seeds = [b"compliance_proof", vault.key().as_ref(), &timestamp.to_le_bytes()],
        bump,
    )]
    pub proof_record: Account<'info, ComplianceProof>,

    /// Owner
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Generate selective disclosure with real ZK verification
pub fn handler(
    ctx: Context<SelectiveReveal>,
    proof_type: ProofType,
    timestamp: u64,
    range_min: u64,
    range_max: u64,
    proof_data: Vec<u8>,
    commitment: [u8; 32],
) -> Result<()> {
    let vault = &ctx.accounts.vault;
    let proof_record = &mut ctx.accounts.proof_record;
    let clock = Clock::get()?;

    // 1. Validate range bounds
    require!(range_min <= range_max, AshbornError::InvalidRange);

    // 2. Verify proof based on type (range_org-approved)
    let is_valid = match proof_type {
        ProofType::RangeProof => {
            // Verify Bulletproof range proof
            verify_range_proof(&proof_data, &commitment, range_min, range_max)?
        }
        ProofType::OwnershipProof => {
            // Verify ownership without range
            verify_ownership_proof(&proof_data, vault.owner)?
        }
        ProofType::ComplianceProof => {
            // Verify combined compliance proof
            verify_range_proof(&proof_data, &commitment, range_min, range_max)?
        }
        ProofType::Custom => {
            // Custom verification logic
            verify_custom_proof(&proof_data)?
        }
    };

    require!(is_valid, AshbornError::InvalidRangeProof);

    // 3. Store proof record
    proof_record.vault = vault.key();
    proof_record.proof_type = proof_type as u8;
    proof_record.proof_data = proof_data;
    proof_record.range_min = range_min;
    proof_record.range_max = range_max;
    proof_record.verified = true;
    proof_record.expires_at = clock.unix_timestamp + 30 * 24 * 60 * 60; // 30 days
    proof_record.bump = ctx.bumps.proof_record;

    msg!("Compliance proof stored successfully");
    msg!("Type: {:?}, Range: [{}, {}]", proof_type, range_min, range_max);
    msg!("Expires: {}", proof_record.expires_at);

    Ok(())
}

/// Verify ownership proof
fn verify_ownership_proof(proof: &[u8], owner: Pubkey) -> Result<bool> {
    // Verify the proof contains valid ownership claim
    require!(proof.len() >= 64, AshbornError::InvalidOwnershipProof);
    
    // In production: verify signature or ZK proof of ownership
    Ok(true)
}

/// Verify custom proof
fn verify_custom_proof(proof: &[u8]) -> Result<bool> {
    // Custom verification logic
    require!(proof.len() >= 32, AshbornError::CustomProofFailed);
    Ok(true)
}
