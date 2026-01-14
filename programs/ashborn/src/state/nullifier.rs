//! Nullifier State
//!
//! A PDA derived from the nullifier hash.
//! Existence of this account proves the note has been spent.

use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Nullifier {
    /// The nullifier hash (32 bytes)
    pub hash: [u8; 32],
    
    /// The timestamp when it was spent
    pub spent_at: i64,
    
    /// The transaction signature (for debugging/audit) - optional, can be omitted to save space
    /// but useful for tracking. We'll store just the bump for now to keep it minimal.
    pub bump: u8,
}

impl Nullifier {
    pub const SIZE: usize = 8 + // discriminator
        32 + // hash
        8 +  // spent_at
        1;   // bump
}
