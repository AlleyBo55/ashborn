//! Updated Transfer Instruction with Real ZK and Merkle Trees
//!
//! Real Groth16 verification
//! Merkle tree nullifiers

use anchor_lang::prelude::*;
use crate::state::{ShadowVault, ShieldedNote, NullifierTree, CommitmentTree, Denomination};
use crate::errors::AshbornError;
use crate::zk::{verify_transfer_proof, poseidon_hash_2};

/// Accounts for shadow transfer
#[derive(Accounts)]
pub struct ShadowTransfer<'info> {
    /// The sender's vault
    #[account(
        mut,
        seeds = [b"shadow_vault", sender.key().as_ref()],
        bump = sender_vault.bump,
        has_one = owner @ AshbornError::Unauthorized,
    )]
    pub sender_vault: Account<'info, ShadowVault>,

    /// The source shielded note being spent
    #[account(
        mut,
        seeds = [b"shielded_note", sender_vault.key().as_ref(), &source_note.index.to_le_bytes()],
        bump = source_note.bump,
        constraint = !source_note.spent @ AshbornError::NoteAlreadySpent,
    )]
    pub source_note: Account<'info, ShieldedNote>,

    /// Global nullifier tree (Merkle tree for O(log n) storage)
    #[account(
        mut,
        seeds = [b"nullifier_tree"],
        bump = nullifier_tree.bump,
    )]
    pub nullifier_tree: Account<'info, NullifierTree>,

    /// Global commitment tree
    #[account(
        mut,
        seeds = [b"commitment_tree"],
        bump = commitment_tree.bump,
    )]
    pub commitment_tree: Account<'info, CommitmentTree>,

    /// The change note created for sender
    #[account(
        init,
        payer = sender,
        space = ShieldedNote::SIZE,
        seeds = [b"shielded_note", sender_vault.key().as_ref(), &(sender_vault.note_count + 1).to_le_bytes()],
        bump,
    )]
    pub change_note: Account<'info, ShieldedNote>,

    /// Sender (payer for change note)
    #[account(mut)]
    pub sender: Signer<'info>,

    /// Vault owner must sign
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Execute a shadow transfer with real ZK proofs
pub fn handler(
    ctx: Context<ShadowTransfer>,
    nullifier: [u8; 32],
    output_commitment: [u8; 32],
    change_commitment: [u8; 32],
    proof: Vec<u8>,
    merkle_siblings: [[u8; 32]; 20],
    merkle_root: [u8; 32],
) -> Result<()> {
    let source_note = &ctx.accounts.source_note;
    let nullifier_tree = &mut ctx.accounts.nullifier_tree;
    let commitment_tree = &mut ctx.accounts.commitment_tree;
    let sender_vault = &mut ctx.accounts.sender_vault;
    let change_note = &mut ctx.accounts.change_note;
    let clock = Clock::get()?;

    // 1. Verify Merkle root is valid (current or recent)
    require!(
        commitment_tree.is_valid_root(&merkle_root),
        AshbornError::InvalidMerkleRoot
    );

    // 2. Verify nullifier hasn't been used
    // Check if nullifier already exists in the tree
    require!(
        !nullifier_tree.nullifier_exists(&nullifier),
        AshbornError::NullifierAlreadyUsed
    );

    // 3. REAL Groth16 proof verification 
    let proof_valid = verify_transfer_proof(
        &proof,
        &source_note.commitment,
        &nullifier,
        &output_commitment,
        &change_commitment,
        &merkle_root,
    )?;

    require!(proof_valid, AshbornError::ProofVerificationFailed);

    // 4. Verify Merkle siblings before insertion
    let siblings_valid = nullifier_tree.verify_siblings_for_insert(&merkle_siblings)?;
    require!(siblings_valid, AshbornError::InvalidMerkleSiblings);

    // 5. Insert nullifier into Merkle tree
    nullifier_tree.insert(nullifier, &merkle_siblings)?;

    // 6. Mark source note as spent
    ctx.accounts.source_note.spent = true;

    // 7. Insert new commitments into commitment tree
    let change_index = commitment_tree.insert_commitment(change_commitment, &merkle_siblings)?;

    // 7. Create change note
    change_note.vault = sender_vault.key();
    change_note.commitment = change_commitment;
    change_note.index = change_index;
    change_note.spent = false;
    change_note.created_at = clock.unix_timestamp;
    change_note.unshield_after = clock.unix_timestamp + 24 * 60 * 60; // 24h delay
    change_note.bump = ctx.bumps.change_note;

    // 8. Update vault state
    sender_vault.note_count += 1;
    sender_vault.last_activity = clock.unix_timestamp;

    msg!("Shadow transfer executed successfully");
    msg!("Nullifier recorded: {:?}", &nullifier[..8]);
    msg!("Output commitment: {:?}", &output_commitment[..8]);

    Ok(())
}
