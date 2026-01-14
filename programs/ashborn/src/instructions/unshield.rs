//! Updated Unshield Instruction with Privacy Delay
//!
//! privacy-preserving: 24-hour minimum delay before unshield

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{ShadowVault, ShieldedNote, Nullifier, ProtocolState};
use crate::errors::AshbornError;
use crate::zk::verify_transfer_proof;

/// Accounts for unshield
#[derive(Accounts)]
#[instruction(amount: u64, nullifier_hash: [u8; 32])]
pub struct Unshield<'info> {
    /// User's vault
    #[account(
        mut,
        seeds = [b"shadow_vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ AshbornError::Unauthorized,
    )]
    pub vault: Box<Account<'info, ShadowVault>>,

    /// The note being unshielded
    #[account(
        mut,
        seeds = [b"shielded_note", vault.key().as_ref(), &source_note.index.to_le_bytes()],
        bump = source_note.bump,
        constraint = !source_note.spent @ AshbornError::NoteAlreadySpent,
    )]
    pub source_note: Box<Account<'info, ShieldedNote>>,

    /// Nullifier PDA (Proves spentness)
    #[account(
        init,
        payer = owner,
        space = Nullifier::SIZE,
        seeds = [b"nullifier", nullifier_hash.as_ref()],
        bump
    )]
    pub nullifier_account: Box<Account<'info, Nullifier>>,

    /// Protocol state for fee recipient
    #[account(
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Box<Account<'info, ProtocolState>>,

    /// Shielded pool token account
    #[account(mut)]
    pub pool_token_account: Box<Account<'info, TokenAccount>>,

    /// User's destination token account
    #[account(mut)]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    /// Pool authority PDA
    /// CHECK: PDA authority for pool
    #[account(
        seeds = [b"pool_authority"],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// Owner
    #[account(mut)]
    pub owner: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

/// Unshield with privacy delay validation
pub fn handler(
    ctx: Context<Unshield>,
    amount: u64,
    nullifier: [u8; 32],
    proof: Vec<u8>,
    merkle_siblings: [[u8; 32]; 20],
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let source_note = &mut ctx.accounts.source_note;
    let nullifier_account = &mut ctx.accounts.nullifier_account;
    let protocol_state = &ctx.accounts.protocol_state;
    let clock = Clock::get()?;

    // 1. Privacy delay check (privacy-preserving: must wait 24h)
    require!(
        clock.unix_timestamp >= source_note.unshield_after,
        AshbornError::TooSoonToUnshield
    );

    let time_waited = clock.unix_timestamp - source_note.created_at;
    msg!("Privacy delay satisfied: {} seconds elapsed", time_waited);

    // 2. Initialize Nullifier PDA (Double Spend Check is implicit)
    nullifier_account.hash = nullifier;
    nullifier_account.spent_at = clock.unix_timestamp;
    nullifier_account.bump = ctx.bumps.nullifier_account;

    // 3. Verify withdrawal proof
    // For unshield, we verify the user knows the preimage of the commitment
    let proof_valid = verify_transfer_proof(
        &proof,
        &source_note.commitment,
        &nullifier,
        &[0u8; 32], // No output commitment for unshield
        &[0u8; 32], // No change for full unshield
        &[0u8; 32], // Merkle root
    )?;
    require!(proof_valid, AshbornError::InvalidWithdrawProof);

    // 4. Mark note as spent
    source_note.spent = true;

    // 5. Calculate fee with overflow protection
    let fee = amount
        .checked_mul(protocol_state.fee_bps as u64)
        .and_then(|v| v.checked_div(10000))
        .ok_or(AshbornError::Overflow)?;
    let net_amount = amount.saturating_sub(fee);

    // 6. Transfer tokens from pool to user
    let pool_seeds = &[b"pool_authority".as_ref(), &[ctx.bumps.pool_authority]];
    let signer_seeds = &[&pool_seeds[..]];

    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool_authority.to_account_info(),
        },
        signer_seeds,
    );
    token::transfer(transfer_ctx, net_amount)?;

    // 7. Update vault state (no balance stored - privacy!)
    vault.note_count = vault.note_count.saturating_sub(1);
    vault.last_activity = clock.unix_timestamp;

    msg!("Assets unshielded successfully");
    msg!("Amount: {}, Fee: {}, Net: {}", amount, fee, net_amount);
    msg!("Nullifier recorded: {:?}", &nullifier[..8]);

    Ok(())
}
