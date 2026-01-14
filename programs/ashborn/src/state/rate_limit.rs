//! Rate Limiting State for deposit protection
//!
//! Prevents spam attacks that could fill the Merkle tree

use anchor_lang::prelude::*;

/// Rate limit configuration for deposits
#[account]
pub struct RateLimitState {
    /// Authority that can update rate limits
    pub authority: Pubkey,
    
    /// Current epoch (based on slots)
    pub current_epoch: u64,
    
    /// Number of deposits in current epoch
    pub deposits_this_epoch: u64,
    
    /// Maximum deposits allowed per epoch
    pub max_deposits_per_epoch: u64,
    
    /// Duration of an epoch in slots
    pub epoch_duration_slots: u64,
    
    /// Total deposits all time
    pub total_deposits: u64,
    
    /// Bump seed
    pub bump: u8,
}

impl RateLimitState {
    pub const SIZE: usize = 8 + // discriminator
        32 + // authority
        8 +  // current_epoch
        8 +  // deposits_this_epoch
        8 +  // max_deposits_per_epoch
        8 +  // epoch_duration_slots
        8 +  // total_deposits
        1;   // bump

    /// Default max deposits per epoch (1000)
    pub const DEFAULT_MAX_DEPOSITS: u64 = 1000;
    
    /// Default epoch duration (~10 minutes at 400ms slots)
    pub const DEFAULT_EPOCH_SLOTS: u64 = 1500;

    /// Initialize rate limit state
    pub fn initialize(&mut self, authority: Pubkey, bump: u8) {
        self.authority = authority;
        self.current_epoch = 0;
        self.deposits_this_epoch = 0;
        self.max_deposits_per_epoch = Self::DEFAULT_MAX_DEPOSITS;
        self.epoch_duration_slots = Self::DEFAULT_EPOCH_SLOTS;
        self.total_deposits = 0;
        self.bump = bump;
    }

    /// Check if deposit is allowed and record it
    pub fn record_deposit(&mut self, current_slot: u64) -> Result<()> {
        // Calculate current epoch
        let epoch = current_slot / self.epoch_duration_slots;
        
        // Reset counter if new epoch
        if epoch > self.current_epoch {
            self.current_epoch = epoch;
            self.deposits_this_epoch = 0;
        }
        
        // Check rate limit
        require!(
            self.deposits_this_epoch < self.max_deposits_per_epoch,
            RateLimitError::RateLimitExceeded
        );
        
        // Record deposit
        self.deposits_this_epoch += 1;
        self.total_deposits += 1;
        
        Ok(())
    }
    
    /// Check if deposit would be allowed (without recording)
    pub fn can_deposit(&self, current_slot: u64) -> bool {
        let epoch = current_slot / self.epoch_duration_slots;
        
        if epoch > self.current_epoch {
            // New epoch, limit reset
            true
        } else {
            self.deposits_this_epoch < self.max_deposits_per_epoch
        }
    }
    
    /// Update rate limit configuration (admin only)
    pub fn update_config(&mut self, max_deposits: u64, epoch_slots: u64) {
        self.max_deposits_per_epoch = max_deposits;
        self.epoch_duration_slots = epoch_slots;
    }
}

#[error_code]
pub enum RateLimitError {
    #[msg("Rate limit exceeded. Please wait for the next epoch.")]
    RateLimitExceeded,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rate_limit() {
        let mut state = RateLimitState {
            authority: Pubkey::default(),
            current_epoch: 0,
            deposits_this_epoch: 0,
            max_deposits_per_epoch: 2,
            epoch_duration_slots: 100,
            total_deposits: 0,
            bump: 0,
        };

        // Should allow first deposit
        assert!(state.can_deposit(50));
        
        // Simulate recording
        state.deposits_this_epoch = 2;
        
        // Should reject (at limit)
        assert!(!state.can_deposit(50));
        
        // Should allow in next epoch
        assert!(state.can_deposit(150));
    }
}
