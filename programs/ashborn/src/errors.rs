//! Custom errors for the Ashborn protocol
//! 
//! Linus says: Proper error handling, not panic-and-pray.

use anchor_lang::prelude::*;

#[error_code]
pub enum AshbornError {
    // ============ Vault Errors (6000-6099) ============
    
    #[msg("Vault already initialized for this owner")]
    VaultAlreadyExists,
    
    #[msg("Vault not found or not initialized")]
    VaultNotFound,
    
    #[msg("Unauthorized: caller is not the vault owner")]
    UnauthorizedVaultAccess,
    
    #[msg("Vault is locked and cannot perform operations")]
    VaultLocked,
    
    // ============ Shielding Errors (6100-6199) ============
    
    #[msg("Invalid commitment format")]
    InvalidCommitment,
    
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    
    #[msg("Amount exceeds maximum allowed for single shield")]
    AmountTooLarge,
    
    #[msg("Insufficient balance for this operation")]
    InsufficientBalance,
    
    #[msg("Deposit amount doesn't match commitment")]
    CommitmentMismatch,
    
    // ============ Transfer Errors (6200-6299) ============
    
    #[msg("Nullifier has already been used (double-spend attempt)")]
    NullifierAlreadyUsed,
    
    #[msg("Invalid nullifier format")]
    InvalidNullifier,
    
    #[msg("Invalid transfer proof")]
    InvalidTransferProof,
    
    #[msg("Proof verification failed")]
    ProofVerificationFailed,
    
    #[msg("Recipient commitment is invalid")]
    InvalidRecipientCommitment,
    
    // ============ Disclosure Errors (6300-6399) ============
    
    #[msg("Invalid range proof")]
    InvalidRangeProof,
    
    #[msg("Range minimum cannot exceed maximum")]
    InvalidRange,
    
    #[msg("Proof type not supported")]
    UnsupportedProofType,
    
    #[msg("Proof has expired")]
    ProofExpired,
    
    #[msg("Compliance proof already exists")]
    ProofAlreadyExists,
    
    // ============ Protocol Errors (6400-6499) ============
    
    #[msg("Protocol is currently paused")]
    ProtocolPaused,

    #[msg("Unauthorized access to vault")]
    Unauthorized,

    #[msg("Invalid denomination amount")]
    InvalidDenomination,

    #[msg("Note has already been spent")]
    NoteAlreadySpent,

    #[msg("Invalid Merkle root")]
    InvalidMerkleRoot,

    #[msg("Invalid ownership proof")]
    InvalidOwnershipProof,

    #[msg("Custom proof verification failed")]
    CustomProofFailed,

    #[msg("Too soon to unshield (24h lock)")]
    TooSoonToUnshield,

    #[msg("Invalid withdraw proof")]
    InvalidWithdrawProof,
    
    #[msg("Invalid admin authority")]
    InvalidAdmin,
    
    #[msg("Fee exceeds maximum allowed")]
    FeeTooHigh,
    
    #[msg("Invalid fee recipient")]
    InvalidFeeRecipient,
    
    // ============ Crypto Errors (6500-6599) ============
    
    #[msg("Hash computation failed")]
    HashError,
    
    #[msg("Invalid signature")]
    InvalidSignature,
    
    #[msg("Encryption failed")]
    EncryptionError,
    
    #[msg("Decryption failed")]
    DecryptionError,
    
    #[msg("Invalid public key format")]
    InvalidPublicKey,
    
    // ============ Integration Errors (6600-6699) ============
    
    #[msg("ShadowWire integration error")]
    ShadowWireError,
    
    #[msg("Privacy Cash integration error")]
    PrivacyCashError,
    
    #[msg("Range Compliance integration error")]
    RangeComplianceError,
    
    #[msg("External SDK call failed")]
    ExternalSdkError,
}
