pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/bitify.circom";

/**
 * ShieldProof - Proves a valid shielding operation
 * 
 * Proves:
 * 1. The commitment is well-formed from amount and blinding
 * 2. The amount matches the public deposit amount
 * 3. Amount is within valid range (0 < amount <= MAX)
 * 
 * Privacy Cash integration point
 */
template ShieldProof() {
    // Private inputs
    signal input blinding;
    
    // Public inputs
    signal input amount;        // Public - matches token transfer
    signal input commitment;    // Output commitment
    
    // Verify commitment = Poseidon(amount, blinding)
    component commitmentHash = Poseidon(2);
    commitmentHash.inputs[0] <== amount;
    commitmentHash.inputs[1] <== blinding;
    commitmentHash.out === commitment;
    
    // Range check: amount must fit in 64 bits
    component amountBits = Num2Bits(64);
    amountBits.in <== amount;
    
    // Amount must be positive (at least 1)
    component isPositive = GreaterThan(64);
    isPositive.in[0] <== amount;
    isPositive.in[1] <== 0;
    isPositive.out === 1;
}

component main {public [amount, commitment]} = ShieldProof();
