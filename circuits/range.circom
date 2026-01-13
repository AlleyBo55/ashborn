pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/bitify.circom";

/**
 * RangeProof - Proves value is within a range WITHOUT revealing it
 * 
 * Proves: min <= value <= max
 * 
 * Range Compliance integration - makes ZachXBT and regulators happy
 */
template RangeProof() {
    // Private inputs
    signal input value;
    signal input blinding;
    
    // Public inputs  
    signal input commitment;    // Commitment to the value
    signal input minValue;      // Public minimum
    signal input maxValue;      // Public maximum
    
    // Verify commitment = Poseidon(value, blinding)
    component commitmentHash = Poseidon(2);
    commitmentHash.inputs[0] <== value;
    commitmentHash.inputs[1] <== blinding;
    commitmentHash.out === commitment;
    
    // Range check: value >= minValue
    component geMin = GreaterEqThan(64);
    geMin.in[0] <== value;
    geMin.in[1] <== minValue;
    geMin.out === 1;
    
    // Range check: value <= maxValue
    component leMax = LessEqThan(64);
    leMax.in[0] <== value;
    leMax.in[1] <== maxValue;
    leMax.out === 1;
}

/**
 * OwnershipProof - Proves ownership without revealing balance
 */
template OwnershipProof() {
    // Private inputs
    signal input nullifierSecret;
    signal input viewKey;
    
    // Public inputs
    signal input ownerCommitment; // Public commitment to owner identity
    signal input vaultAddress;    // The vault being proven
    
    // Prove knowledge of nullifier secret
    component ownerHash = Poseidon(3);
    ownerHash.inputs[0] <== nullifierSecret;
    ownerHash.inputs[1] <== viewKey;
    ownerHash.inputs[2] <== vaultAddress;
    ownerHash.out === ownerCommitment;
}

component main {public [commitment, minValue, maxValue]} = RangeProof();
