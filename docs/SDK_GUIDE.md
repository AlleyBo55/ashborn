# Ashborn SDK Integration Guide

This guide shows how to integrate each SDK into your own applications.

## Quick Start

```bash
npm install @ashborn/sdk @solana/web3.js @coral-xyz/anchor
```

## Basic Usage

```typescript
import { Ashborn } from '@ashborn/sdk';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';

// Initialize
const connection = new Connection(clusterApiUrl('devnet'));
const wallet = useWallet(); // From wallet adapter
const ashborn = new Ashborn(connection, wallet);

// Initialize vault (one-time)
await ashborn.initializeVault();

// Shield assets
const { noteAddress, commitment } = await ashborn.shield({
  amount: 1_000_000_000n, // 1 SOL
  mint: SOL_MINT,
});

// Shadow transfer (private P2P)
await ashborn.shadowTransfer({
  sourceNoteAddress: noteAddress,
  amount: 500_000_000n,
  recipientStealthAddress: recipientStealth,
});

// Generate compliance proof
const { proofData } = await ashborn.generateProof({
  proofType: ProofType.RangeProof,
  rangeMin: 0n,
  rangeMax: 10_000_000_000n, // $10k
});

// Unshield (withdraw)
await ashborn.unshield({
  sourceNoteAddress: otherNote,
  amount: 500_000_000n,
  destinationTokenAccount: myTokenAccount,
});
```

## SDK Wrappers

### ShadowWire (Radr Labs)

```typescript
// Generate stealth address for receiving
const stealth = await ashborn.shadowWire.generateStealthAddress();
console.log('Share this stealth address:', stealth.stealthPubkey.toBase58());

// Scan for incoming payments
const payments = await ashborn.shadowWire.scanForPayments(myScanKey);

// Create transfer commitments
const { senderCommitment, recipientCommitment } = 
  await ashborn.shadowWire.createTransferCommitments(
    amount,
    recipientStealthAddress
  );
```

### Privacy Cash

```typescript
// Create shield commitment
const commitment = await ashborn.privacyCash.createShieldCommitment(
  amount,
  blindingFactor
);

// Generate withdrawal proof
const proof = await ashborn.privacyCash.generateWithdrawalProof(
  amount,
  nullifier
);

// Generate view key for optional disclosure
const viewKey = ashborn.privacyCash.generateViewKey();
```

### Range Compliance

```typescript
// Range proof (balance in range)
const proof = await ashborn.rangeCompliance.generateProof({
  type: ProofType.RangeProof,
  rangeMin: 0n,
  rangeMax: 10_000n,
  vaultAddress: myVault,
});

// Ownership proof (prove you own vault)
const ownershipProof = await ashborn.rangeCompliance.generateProof({
  type: ProofType.OwnershipProof,
  vaultAddress: myVault,
});

// Create disclosure authorization for auditor
const auth = ashborn.rangeCompliance.createDisclosureAuth(
  auditorPubkey,
  Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
);
```

## React Hooks (Coming Soon)

```typescript
import { useAshborn, useShadowVault, useShield } from '@ashborn/react';

function MyComponent() {
  const ashborn = useAshborn();
  const { vault, loading } = useShadowVault();
  const { shield, shielding } = useShield();

  return (
    <button onClick={() => shield({ amount: 1_000_000_000n })}>
      {shielding ? 'Shielding...' : 'Shield 1 SOL'}
    </button>
  );
}
```

## Error Handling

```typescript
import { AshbornError, ERROR_CODES } from '@ashborn/sdk';

try {
  await ashborn.shield({ amount });
} catch (err) {
  if (err.code === ERROR_CODES.INSUFFICIENT_BALANCE) {
    console.log('Not enough balance');
  } else if (err.code === ERROR_CODES.NULLIFIER_ALREADY_USED) {
    console.log('Note already spent!');
  }
}
```

## Best Practices

1. **Store blinding factors securely** — They're needed to spend notes
2. **Keep view keys safe** — They decrypt your balances
3. **Verify proofs client-side** — Before submitting to chain
4. **Use fresh stealth addresses** — One per payment for max privacy
