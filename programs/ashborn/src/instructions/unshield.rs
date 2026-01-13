//! Updated Unshield Instruction with Privacy Delay
//!
//! ZachXBT-proof: 24-hour minimum delay before unshield

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{ShadowVault, ShieldedNote, NullifierTree, ProtocolState};
use crate::errors::AshbornError;
use crate::zk::{verify_transfer_proof, generate_nullifier};

/// Accounts for unshield
#[derive(Accounts)]
pub struct Unshield<'info> {
    /// User's vault
    #[account(
        mut,
        seeds = [b"shadow_vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ AshbornError::Unauthorized,
    )]
    pub vault: Account<'info, ShadowVault>,

    /// The note being unshielded
    #[account(
        mut,
        seeds = [b"shielded_note", vault.key().as_ref(), &source_note.index.to_le_bytes()],
        bump = source_note.bump,
        constraint = !source_note.spent @ AshbornError::NoteAlreadySpent,
    )]
    pub source_note: Account<'info, ShieldedNote>,

    /// Global nullifier tree
    #[account(
        mut,
        seeds = [b"nullifier_tree"],
        bump = nullifier_tree.bump,
    )]
    pub nullifier_tree: Account<'info, NullifierTree>,

    /// Protocol state for fee recipient
    #[account(
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    /// Shielded pool token account
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    /// User's destination token account
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

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
    let nullifier_tree = &mut ctx.accounts.nullifier_tree;
    let protocol_state = &ctx.accounts.protocol_state;
    let clock = Clock::get()?;

    // 1. Privacy delay check (ZachXBT-proof: must wait 24h)
    require!(
        clock.unix_timestamp >= source_note.unshield_after,
        AshbornError::TooSoonToUnshield
    );

    let time_waited = clock.unix_timestamp - source_note.created_at;
    msg!("Privacy delay satisfied: {} seconds elapsed", time_waited);

    // 2. Verify nullifier not already used
    require!(
        !nullifier_tree.is_valid_root(&nullifier),
        AshbornError::NullifierAlreadyUsed
    );

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

    // 4. Insert nullifier into tree
    nullifier_tree.insert(nullifier, &merkle_siblings)?;

    // 5. Mark note as spent
    source_note.spent = true;

    // 6. Calculate fee
    let fee = (amount as u128 * protocol_state.fee_bps as u128 / 10000) as u64;
    let net_amount = amount.saturating_sub(fee);

    // 7. Transfer tokens from pool to user
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

    // 8. Update vault state
    vault.shadow_balance = vault.shadow_balance.saturating_sub(amount);
    vault.note_count = vault.note_count.saturating_sub(1);
    vault.last_activity = clock.unix_timestamp;

    msg!("Assets unshielded successfully");
    msg!("Amount: {}, Fee: {}, Net: {}", amount, fee, net_amount);
    msg!("Nullifier recorded: {:?}", &nullifier[..8]);

    Ok(())
}
