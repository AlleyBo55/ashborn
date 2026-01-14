//! Shielded notes state

use anchor_lang::prelude::*;

/// Shielded Note - An encrypted UTXO-style note
#[account]
#[derive(InitSpace)]
pub struct ShieldedNote {
    /// The vault this note belongs to
    pub vault: Pubkey,
    
    /// Poseidon commitment: C = Poseidon(amount, blinding)
    pub commitment: [u8; 32],
    
    /// Encrypted amount (ChaCha20-Poly1305)
    pub encrypted_amount: [u8; 48],
    
    /// Note index in the commitment tree
    pub index: u64,
    
    /// Denomination tier (ZachXBT-proof)
    pub denomination_tier: u8,
    
    /// Whether this note has been spent
    pub spent: bool,
    
    /// Timestamp of note creation
    pub created_at: i64,
    
    /// Minimum unshield time (24h delay for privacy)
    pub unshield_after: i64,
    
    /// Bump seed for PDA
    pub bump: u8,
}

impl ShieldedNote {
    pub const SIZE: usize = 8 + // discriminator
        32 + // vault
        32 + // commitment
        48 + // encrypted_amount
        8 +  // index
        1 +  // denomination_tier
        1 +  // spent
        8 +  // created_at
        8 +  // unshield_after
        1;   // bump
}

/// Denominations for ZachXBT-proof privacy (uniform amounts)
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Denomination {
    /// 0.1 SOL
    Tier1 = 0,
    /// 1 SOL
    Tier2 = 1,
    /// 10 SOL
    Tier3 = 2,
    /// 100 SOL
    Tier4 = 3,
    /// 1000 SOL
    Tier5 = 4,
}

impl Denomination {
    pub const VALUES: [u64; 5] = [
        100_000_000,      // 0.1 SOL
        1_000_000_000,    // 1 SOL
        10_000_000_000,   // 10 SOL
        100_000_000_000,  // 100 SOL
        1_000_000_000_000, // 1000 SOL
    ];
    
    pub fn from_amount(amount: u64) -> Option<Self> {
        match amount {
            100_000_000 => Some(Self::Tier1),
            1_000_000_000 => Some(Self::Tier2),
            10_000_000_000 => Some(Self::Tier3),
            100_000_000_000 => Some(Self::Tier4),
            1_000_000_000_000 => Some(Self::Tier5),
            _ => None,
        }
    }
    
    pub fn to_amount(&self) -> u64 {
        Self::VALUES[*self as usize]
    }
}

/// Compliance Proof stored on-chain
#[account]
pub struct ComplianceProof {
    /// Vault this proof is for
    pub vault: Pubkey,
    
    /// Proof type
    pub proof_type: u8,
    
    /// ZK proof data (Groth16)
    pub proof_data: Vec<u8>,
    
    /// Range bounds
    pub range_min: u64,
    pub range_max: u64,
    
    /// Verification status
    pub verified: bool,
    
    /// Expiration timestamp
    pub expires_at: i64,
    
    /// Bump seed
    pub bump: u8,
}

impl ComplianceProof {
    pub const BASE_SIZE: usize = 8 + 32 + 1 + 4 + 8 + 8 + 1 + 8 + 1;
    
    pub fn size(proof_len: usize) -> usize {
        Self::BASE_SIZE + proof_len
    }
}
