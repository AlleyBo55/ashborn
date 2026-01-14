//! Groth16 Verification Keys
//!
//! These are the verification key constants for our ZK circuits.
//! In production, these would be generated from a trusted setup ceremony.
//!
//! For now, we use placeholder values that work with the groth16-solana crate.
//! Replace with real VK from `snarkjs export verificationkey` output.

/// Verification key for the Transfer circuit
/// Format: [alpha, beta, gamma, delta, ic]
/// Each G1 point is 64 bytes (x, y), each G2 point is 128 bytes
pub mod transfer_vk {
    /// Alpha point (G1)
    pub const ALPHA_G1: [u8; 64] = [
        // Placeholder - replace with real VK from circuit
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
    ];

    /// Beta point (G2) 
    pub const BETA_G2: [u8; 128] = [0u8; 128];

    /// Gamma point (G2)
    pub const GAMMA_G2: [u8; 128] = [0u8; 128];

    /// Delta point (G2)
    pub const DELTA_G2: [u8; 128] = [0u8; 128];

    /// IC points (G1) - one per public input + 1
    /// For our transfer circuit: [commitment, nullifier, output, change, merkle_root] = 5 inputs + 1 = 6 points
    pub const IC: [[u8; 64]; 6] = [[0u8; 64]; 6];
}

/// Verification key for the Shield circuit
pub mod shield_vk {
    pub const ALPHA_G1: [u8; 64] = [0u8; 64];
    pub const BETA_G2: [u8; 128] = [0u8; 128];
    pub const GAMMA_G2: [u8; 128] = [0u8; 128];
    pub const DELTA_G2: [u8; 128] = [0u8; 128];
    /// IC for shield: [amount, commitment] = 2 inputs + 1 = 3 points
    pub const IC: [[u8; 64]; 3] = [[0u8; 64]; 3];
}

/// Demo mode flag - when true, ZK verification is bypassed
/// Set to false when real verification keys are deployed
pub const DEMO_MODE: bool = true;
