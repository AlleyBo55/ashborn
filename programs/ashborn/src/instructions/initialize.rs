//! Initialize a user's Shadow Vault
//!
//! The vault is the user's personal privacy fortress - everything flows through it.

use anchor_lang::prelude::*;

use crate::state::ShadowVault;

/// Accounts for initializing a shadow vault
#[derive(Accounts)]
pub struct InitializeVault<'info> {
    /// The user who will own this vault
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The shadow vault PDA
    #[account(
        init,
        payer = owner,
        space = ShadowVault::SIZE,
        seeds = [b"shadow_vault", owner.key().as_ref()],
        bump
    )]
    pub shadow_vault: Account<'info, ShadowVault>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}

/// Initialize a new shadow vault for the user
///
/// # Arguments
/// * `ctx` - The instruction context
///
/// # Effects
/// - Creates a new ShadowVault PDA owned by the caller
/// - Sets initial balance to 0
/// - Records creation timestamp
pub fn handler(ctx: Context<InitializeVault>) -> Result<()> {
    let vault = &mut ctx.accounts.shadow_vault;
    let clock = Clock::get()?;

    vault.owner = ctx.accounts.owner.key();
    vault.bump = ctx.bumps.shadow_vault;
    vault.note_count = 0;
    vault.view_key_hash = [0u8; 32]; // User can set later
    vault.encrypted_nullifier_secret = [0u8; 48];
    vault.encrypted_balance_hint = [0u8; 48]; // Privacy: balance computed locally
    vault.created_at = clock.unix_timestamp;
    vault.last_activity = clock.unix_timestamp;
    vault._reserved = [0u8; 64];

    msg!("Shadow Vault initialized for: {}", vault.owner);

    Ok(())
}
