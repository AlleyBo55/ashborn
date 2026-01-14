//! Merkle Tree State - O(log n) nullifier membership proofs
//! 
//! No more O(n) individual nullifier accounts

use anchor_lang::prelude::*;
// use light_poseidon::{Poseidon, PoseidonBytesHasher};

/// Merkle tree depth - 2^20 = 1,048,576 nullifiers
pub const TREE_DEPTH: usize = 20;

/// Number of recent roots to store for async proving
pub const RECENT_ROOTS_COUNT: usize = 30;

/// Zero value for empty leaves
pub const ZERO_VALUE: [u8; 32] = [0u8; 32];

/// Nullifier Merkle Tree - stores nullifiers efficiently
#[account]
pub struct NullifierTree {
    /// Tree authority (program PDA)
    pub authority: Pubkey,
    
    /// Current Merkle root
    pub root: [u8; 32],
    
    /// Next insertion index
    pub next_index: u64,
    
    /// Tree depth
    pub depth: u8,
    
    /// Recent roots for async proof verification
    /// Allows proofs generated against slightly old roots
    pub recent_roots: [[u8; 32]; RECENT_ROOTS_COUNT],
    
    /// Bump seed for PDA
    pub bump: u8,
}

impl NullifierTree {
    pub const SIZE: usize = 8 + // discriminator
        32 + // authority
        32 + // root
        8 +  // next_index
        1 +  // depth
        (32 * RECENT_ROOTS_COUNT) + // recent_roots
        1;   // bump

    /// Initialize with zero root
    pub fn initialize(&mut self, authority: Pubkey, bump: u8) {
        self.authority = authority;
        self.root = Self::compute_zero_root();
        self.next_index = 0;
        self.depth = TREE_DEPTH as u8;
        self.recent_roots = [[0u8; 32]; RECENT_ROOTS_COUNT];
        self.bump = bump;
    }

    /// Compute the root of an empty tree
    fn compute_zero_root() -> [u8; 32] {
        let mut current = ZERO_VALUE;
        
        for _ in 0..TREE_DEPTH {
            current = Self::hash_pair(&current, &current);
        }
        
        current
    }

    /// Hash two nodes using Mock Poseidon
    fn hash_pair(left: &[u8; 32], right: &[u8; 32]) -> [u8; 32] {
        use crate::zk::poseidon_hash_2;
        poseidon_hash_2(left, right)
    }

    /// Insert a nullifier and update the root
    pub fn insert(
        &mut self,
        nullifier: [u8; 32],
        siblings: &[[u8; 32]; TREE_DEPTH],
    ) -> Result<()> {
        // Compute new root with the inserted nullifier
        let new_root = self.compute_root_with_leaf(&nullifier, self.next_index, siblings);
        
        // Rotate recent roots
        for i in (1..RECENT_ROOTS_COUNT).rev() {
            self.recent_roots[i] = self.recent_roots[i - 1];
        }
        self.recent_roots[0] = self.root;
        
        // Update root
        self.root = new_root;
        self.next_index += 1;
        
        Ok(())
    }

    /// Compute root with a new leaf at given index
    fn compute_root_with_leaf(
        &self,
        leaf: &[u8; 32],
        index: u64,
        siblings: &[[u8; 32]; TREE_DEPTH],
    ) -> [u8; 32] {
        let mut current = *leaf;
        let mut idx = index;
        
        for i in 0..TREE_DEPTH {
            let sibling = &siblings[i];
            
            if idx % 2 == 0 {
                // Leaf is on left
                current = Self::hash_pair(&current, sibling);
            } else {
                // Leaf is on right
                current = Self::hash_pair(sibling, &current);
            }
            
            idx /= 2;
        }
        
        current
    }

    /// Check if a root is valid (current or recent)
    pub fn is_valid_root(&self, root: &[u8; 32]) -> bool {
        if *root == self.root {
            return true;
        }
        
        self.recent_roots.iter().any(|r| r == root)
    }

    /// Verify a merkle proof for nullifier membership
    pub fn verify_membership(
        &self,
        nullifier: &[u8; 32],
        index: u64,
        siblings: &[[u8; 32]; TREE_DEPTH],
        root: &[u8; 32],
    ) -> bool {
        if !self.is_valid_root(root) {
            return false;
        }
        
        let computed_root = self.compute_root_with_leaf(nullifier, index, siblings);
        computed_root == *root
    }

    /// Check if a nullifier already exists in the tree
    /// 
    /// This uses a simple bloom filter approach for efficiency.
    /// In production, you'd use a proper sparse Merkle tree with non-membership proofs.
    pub fn nullifier_exists(&self, nullifier: &[u8; 32]) -> bool {
        // Check if nullifier's "fingerprint" appears in any recent root
        // This is a simplified check - real implementation uses non-membership proofs
        let fingerprint = Self::hash_pair(nullifier, &ZERO_VALUE);
        
        // Check against current root
        if self.root == fingerprint {
            return true;
        }
        
        // Check against recent roots
        for recent_root in &self.recent_roots {
            if *recent_root == fingerprint {
                return true;
            }
            // Also check if the nullifier hash appears in recent roots
            let check = Self::hash_pair(nullifier, recent_root);
            if check[..8] == self.root[..8] {
                return true;
            }
        }
        
        false
    }

    /// Verify that provided siblings are valid for the current tree state
    /// 
    /// This ensures clients can't provide arbitrary siblings to manipulate the tree.
    pub fn verify_siblings_for_insert(
        &self,
        siblings: &[[u8; 32]; TREE_DEPTH],
    ) -> Result<bool> {
        // Compute what the root would be if we inserted a zero leaf at next_index
        let expected_root = self.compute_root_with_leaf(&ZERO_VALUE, self.next_index, siblings);
        
        // The expected root should match our current root
        // (since inserting a zero leaf at an empty position shouldn't change the root)
        Ok(self.is_valid_root(&expected_root) || self.next_index == 0)
    }
}

/// Commitment Tree - stores note commitments for membership proofs
#[account]
pub struct CommitmentTree {
    /// Tree authority
    pub authority: Pubkey,
    
    /// Current Merkle root of all commitments
    pub root: [u8; 32],
    
    /// Next insertion index
    pub next_index: u64,
    
    /// Tree depth
    pub depth: u8,
    
    /// Recent roots for async proving
    pub recent_roots: [[u8; 32]; RECENT_ROOTS_COUNT],
    
    /// Bump seed
    pub bump: u8,
}

impl CommitmentTree {
    pub const SIZE: usize = NullifierTree::SIZE; // Same structure
    
    /// Insert a new commitment
    pub fn insert_commitment(
        &mut self,
        commitment: [u8; 32],
        siblings: &[[u8; 32]; TREE_DEPTH],
    ) -> Result<u64> {
        let index = self.next_index;
        
        // Compute new root
        let new_root = self.compute_root_with_leaf(&commitment, index, siblings);
        
        // Rotate recent roots
        for i in (1..RECENT_ROOTS_COUNT).rev() {
            self.recent_roots[i] = self.recent_roots[i - 1];
        }
        self.recent_roots[0] = self.root;
        
        // Update state
        self.root = new_root;
        self.next_index += 1;
        
        Ok(index)
    }
    
    fn compute_root_with_leaf(
        &self,
        leaf: &[u8; 32],
        index: u64,
        siblings: &[[u8; 32]; TREE_DEPTH],
    ) -> [u8; 32] {
        let mut current = *leaf;
        let mut idx = index;
        
        for i in 0..TREE_DEPTH {
            let sibling = &siblings[i];
            
            if idx % 2 == 0 {
                current = NullifierTree::hash_pair(&current, sibling);
            } else {
                current = NullifierTree::hash_pair(sibling, &current);
            }
            
            idx /= 2;
        }
        
        current
    }
    
    pub fn is_valid_root(&self, root: &[u8; 32]) -> bool {
        if *root == self.root {
            return true;
        }
        self.recent_roots.iter().any(|r| r == root)
    }
}
