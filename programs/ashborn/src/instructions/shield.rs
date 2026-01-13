//! Updated Shield Instruction with Denomination Validation and Merkle Tree
//!
//! ZachXBT-proof: Fixed denominations only
//! Privacy Cash integration point

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::{ShadowVault, ShieldedNote, CommitmentTree, Denomination};
use crate::errors::AshbornError;
use crate::zk::{verify_shield_proof, create_commitment};

/// Accounts for shield deposit
#[derive(Accounts)]
pub struct ShieldDeposit<'info> {
    /// The user's vault
    #[account(
        mut,
        seeds = [b"shadow_vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ AshbornError::Unauthorized,
    )]
    pub vault: Account<'info, ShadowVault>,

    /// User's token account to deposit from
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    /// Shielded pool token account
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    /// Global commitment tree
    #[account(
        mut,
        seeds = [b"commitment_tree"],
        bump = commitment_tree.bump,
    )]
    pub commitment_tree: Account<'info, CommitmentTree>,

    /// The new shielded note
    #[account(
        init,
        payer = owner,
        space = ShieldedNote::SIZE,
        seeds = [b"shielded_note", vault.key().as_ref(), &(vault.note_count + 1).to_le_bytes()],
        bump,
    )]
    pub note: Account<'info, ShieldedNote>,

    /// Owner (payer)
    #[account(mut)]
    pub owner: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

/// Shield assets with denomination validation (ZachXBT-proof)
pub fn handler(
    ctx: Context<ShieldDeposit>,
    amount: u64,
    commitment: [u8; 32],
    proof: Vec<u8>,
    merkle_siblings: [[u8; 32]; 20],
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let note = &mut ctx.accounts.note;
    let commitment_tree = &mut ctx.accounts.commitment_tree;
    let clock = Clock::get()?;

    // 1. Validate denomination (ZachXBT-proof: fixed amounts only)
    let denomination = Denomination::from_amount(amount)
        .ok_or(AshbornError::InvalidDenomination)?;

    msg!("Shield amount validated: {} lamports (tier {})", amount, denomination as u8);

    // 2. Verify shield proof (proves commitment is well-formed)
    let proof_valid = verify_shield_proof(&proof, amount, &commitment)?;
    require!(proof_valid, AshbornError::InvalidCommitment);

    // 3. Transfer tokens to shielded pool
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // 4. Insert commitment into Merkle tree
    let note_index = commitment_tree.insert_commitment(commitment, &merkle_siblings)?;

    // 5. Create shielded note
    note.vault = vault.key();
    note.commitment = commitment;
    note.index = note_index;
    note.denomination_tier = denomination as u8;
    note.spent = false;
    note.created_at = clock.unix_timestamp;
    note.unshield_after = clock.unix_timestamp + 24 * 60 * 60; // 24h privacy delay
    note.bump = ctx.bumps.note;

    // 6. Update vault state
    vault.shadow_balance += amount;
    vault.note_count += 1;
    vault.last_activity = clock.unix_timestamp;

    msg!("Assets shielded successfully");
    msg!("Note #{} created with commitment: {:?}", note_index, &commitment[..8]);

    Ok(())
}
