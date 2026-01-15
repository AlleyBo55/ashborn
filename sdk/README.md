

<h1 align="center">🌑 @alleyboss/ashborn-sdk</h1>

<p align="center">
  <strong>The Shadow Monarch SDK — Privacy Layer for Solana</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/v/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/dm/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://github.com/AlleyBo55/ashborn/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="license" /></a>
  <br />
  <img src="https://img.shields.io/badge/Easy%20Integration-Radr_Labs-purple?style=flat-square&logo=solana" alt="Radr Labs" />
  <img src="https://img.shields.io/badge/Easy%20Integration-PrivacyCash-blueviolet?style=flat-square&logo=solana" alt="PrivacyCash" />
</p>

<p align="center">
  <em>"I alone level up."</em> — Build private dApps on Solana with real ZK proofs.
</p>

---

## ✨ Why Ashborn?

Every Solana transaction is **public**. Your wallet balance, transaction history, and business dealings are visible to everyone. **Ashborn changes that.**

| Feature | Without Ashborn | With Ashborn |
|---------|-----------------|--------------|
| Balance | 👁️ Public | 🔒 Hidden in commitments |
| Transfers | 👁️ Sender/recipient visible | 👻 Stealth addresses |
| Amounts | 👁️ Exact amounts exposed | 📊 Range proofs only |
| Compliance | ❌ All or nothing | ✅ Selective disclosure |

---

## 🚀 Quick Start

```bash
npm install @alleyboss/ashborn-sdk
```

```typescript
import { Ashborn } from '@alleyboss/ashborn-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const ashborn = new Ashborn(connection, wallet);

// 🛡️ Shield: Deposit into privacy pool
await ashborn.shield({
  amount: 1_000_000_000n,  // 1 SOL
  mint: 'So11111111111111111111111111111111111111112',
});

// 👻 Transfer: Send privately with decoys
await ashborn.shadowTransfer({
  amount: 500_000_000n,
  recipientStealth: '<stealth-address>',
});

// 📊 Prove: Show compliance without revealing balance
await ashborn.proveRange({
  min: 0n,
  max: 10_000_000_000_000n,  // Prove balance < $10,000
});

// 💰 Unshield: Exit privacy pool
await ashborn.unshield({
  amount: 200_000_000n,
});
```

---

## 🔥 Key Features

### 🛡️ Shielded Transfers
Hide sender, recipient, and amount in a single transaction.

```typescript
await ashborn.shield({ amount: 1_000_000_000n });
// ✅ Amount hidden in Pedersen commitment
// ✅ Encrypted with your view key
// ✅ Only you can see your balance
```

### 👻 Stealth Addresses (Proper ECDH)
Generate one-time addresses using Vitalik's stealth address formula: `P = H(r*A)*G + B`

```typescript
// Recipient: Generate view/spend keys ONCE
const meta = shadowWire.generateStealthMetaAddress();
// Share meta.viewPubKey and meta.spendPubKey with senders

// Sender: Generate stealth address for recipient
const { ephemeralPubkey, stealthPubkey } = shadowWire.generateStealthAddress(
  recipientViewPubKey,
  recipientSpendPubKey
);
// ✅ Publish ephemeralPubkey with tx
// ✅ Send funds to stealthPubkey

// Recipient: Scan for incoming payments
const matches = shadowWire.scanForPayments(
  meta.viewPrivKey,
  meta.spendPubKey,
  [ephemeralPubkey1, ephemeralPubkey2, ...]
);

// Recipient: Derive spending key
const spendKey = shadowWire.deriveStealthPrivateKey(
  meta.viewPrivKey,
  meta.spendPrivKey,
  ephemeralPubkey
);
// ✅ Use spendKey to claim funds
```

### 📊 Range Proofs (Compliance-Ready)
Prove statements about your balance without revealing the exact amount.

```typescript
// Prove to a lender you have > $10,000 collateral
const proof = await ashborn.proveRange({
  min: 10_000_000_000n,  // $10,000 minimum
  max: BigInt(Number.MAX_SAFE_INTEGER),
});
// ✅ Lender knows you qualify
// ❌ Lender doesn't know your exact wealth
```

### 🎭 Decoy Outputs (ZachXBT-Proof)
Every transfer includes 3+ fake outputs to break graph analysis.

```typescript
await ashborn.shadowTransfer({
  amount: 100_000_000n,
  recipientStealth: stealthAddr,
  useDecoys: true,  // Adds 3 indistinguishable outputs
});
// Even chain analysts can't determine the real recipient
```

### 🤖 AI-Powered Commands
Execute complex privacy operations with natural language.

```typescript
import { NaturalLanguageAshborn } from '@ashborn/sdk';

const nlp = new NaturalLanguageAshborn(ashborn);
await nlp.execute("send 0.5 SOL privately to alice.sol");
// Parses → Resolves → Shields → Transfers
```

### 🖼️ NFT Privacy
Prove you own an NFT with specific traits without revealing which one.

```typescript
await ashborn.nftPrivacy.proveOwnership({
  collection: 'DeGods',
  trait: { background: 'Gold' },
});
// ✅ Proves: "I own a DeGod with Gold background"
// ❌ Doesn't reveal: Which specific DeGod ID
```

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────┐
│              YOUR DAPP                         │
└────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────┐
│          @ashborn/sdk (this package)           │
│  ┌──────────┬──────────┬──────────┬─────────┐  │
│  │ ShadowWire│ Privacy │ Range    │ Crypto  │  │
│  │ (Stealth) │ Cash    │ Compliance│ Poseidon│  │
│  └──────────┴──────────┴──────────┴─────────┘  │
│  • snarkjs Groth16 proofs                      │
│  • @noble/curves EC operations                 │
│  • WebCrypto AES-256-GCM encryption            │
└────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────┐
│       Solana Program (Rust/Anchor)             │
│  • ark_groth16 on-chain verification           │
│  • Poseidon Merkle trees                       │
│  • Nullifier registry (anti-double-spend)      │
└────────────────────────────────────────────────┘
```

---

## 📦 What's Included

| Module | Description |
|--------|-------------|
| `Ashborn` | Main SDK class with all operations |
| `ShadowWire` | Stealth address generation & scanning |
| `PrivacyCash` | Shielded pool deposits/withdrawals |
| `RangeCompliance` | ZK range proofs for compliance |
| `NaturalLanguageAshborn` | AI command parsing |
| `NFTPrivacy` | Private NFT ownership proofs |

---

## ⚙️ Configuration

```typescript
const ashborn = new Ashborn(connection, wallet, {
  programId: '<custom-program-id>',  // Default: devnet
  heliusApiKey: '<key>',             // Enhanced indexing
  relayerEndpoint: '<url>',          // Privacy relay
});
```

---

## 🌐 Network Support

| Network | Status | Program ID |
|---------|--------|------------|
| Devnet | ✅ Ready | `ASHBrn...` |
| Mainnet | 🔜 Coming | TBD |

---

## 🔐 Security

- **Real ZK Proofs**: Groth16 via snarkjs (not simulated)
- **Audited Crypto**: @noble/curves, WebCrypto APIs
- **On-Chain Verification**: ark_groth16 on Solana
- **Open Source**: Full transparency

---

## 📚 Resources

- 📖 [Full Documentation](https://github.com/AlleyBo55/ashborn#readme)
- 🎮 [Live Demo](https://ashborn.vercel.app)
- 💬 [Discord](https://discord.gg/ashborn)
- 🐦 [Twitter](https://twitter.com/ashborn_sol)

---

## 📄 License

MIT © [AlleyBo55](https://github.com/AlleyBo55)

---

<p align="center">
  <strong>ARISE.</strong> 🌑
</p>
