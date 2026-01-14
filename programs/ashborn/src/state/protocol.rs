//! Protocol state

use anchor_lang::prelude::*;

/// Global protocol configuration
#[account]
pub struct ProtocolState {
    /// Protocol admin
    pub admin: Pubkey,
    
    /// Total value locked
    pub total_shielded: u64,
    
    /// Total transactions
    pub tx_count: u64,
    
    /// Protocol fee (basis points)
    pub fee_bps: u16,
    
    /// Fee recipient
    pub fee_recipient: Pubkey,
    
    /// Pause flag
    pub paused: bool,
    
    /// Commitment tree address
    pub commitment_tree: Pubkey,
    
    /// Nullifier tree address
    pub nullifier_tree: Pubkey,
    
    /// Minimum privacy delay (seconds)
    pub min_privacy_delay: i64,
    
    /// Bump seed
    pub bump: u8,
}

impl ProtocolState {
    pub const SIZE: usize = 8 + // discriminator
        32 + // admin
        8 +  // total_shielded
        8 +  // tx_count
        2 +  // fee_bps
        32 + // fee_recipient
        1 +  // paused
        32 + // commitment_tree
        32 + // nullifier_tree
        8 +  // min_privacy_delay
        1;   // bump
        
    /// Default minimum delay: 24 hours (privacy-preserving)
    pub const DEFAULT_DELAY: i64 = 24 * 60 * 60;
}
