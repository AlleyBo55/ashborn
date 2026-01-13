//! Shadow Vault state - refactored from original state.rs

use anchor_lang::prelude::*;

/// Shadow Vault - A user's personal privacy fortress
#[account]
#[derive(Default)]
pub struct ShadowVault {
    /// The owner's public key
    pub owner: Pubkey,
    
    /// Bump seed for PDA derivation
    pub bump: u8,
    
    /// Total shielded balance (encrypted)
    pub shadow_balance: u64,
    
    /// Number of shielded notes
    pub note_count: u32,
    
    /// View key commitment for optional disclosure
    pub view_key_hash: [u8; 32],
    
    /// Nullifier secret (encrypted with owner's key)
    pub encrypted_nullifier_secret: [u8; 48],
    
    /// Timestamp of vault creation
    pub created_at: i64,
    
    /// Last activity timestamp
    pub last_activity: i64,
    
    /// Reserved for future upgrades
    pub _reserved: [u8; 64],
}

impl ShadowVault {
    pub const SIZE: usize = 8 + // discriminator
        32 + // owner
        1 +  // bump
        8 +  // shadow_balance
        4 +  // note_count
        32 + // view_key_hash
        48 + // encrypted_nullifier_secret
        8 +  // created_at
        8 +  // last_activity
        64;  // reserved
}
