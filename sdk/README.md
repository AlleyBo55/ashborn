
<h1 align="center">🌑 @alleyboss/ashborn-sdk</h1>

<p align="center">
  <strong>THE SHADOW RELAY — Privacy Layer for Solana</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/v/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/dm/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://github.com/AlleyBo55/ashborn/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="license" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Shadow_Relay-Protocol_Anonymity-red?style=flat-square" alt="Shadow Relay" />
  <img src="https://img.shields.io/badge/Integration-PrivacyCash-blueviolet?style=flat-square" alt="PrivacyCash" />
  <img src="https://img.shields.io/badge/Integration-Radr_Labs-purple?style=flat-square" alt="Radr Labs" />
</p>

---

## ⚡ THE SHADOW RELAY

**Stop exposing yourself to every protocol.**

When you use PrivacyCash directly → **PrivacyCash knows your wallet.**  
When you use Radr Labs directly → **Radr Labs knows your identity.**  

### With Ashborn? **They see NOTHING.**

```
YOU ───▶ ASHBORN RELAY ───▶ PrivacyCash (sees "Ashborn")
                       ───▶ Radr Labs   (sees "Ashborn")
                       ───▶ Light Proto (sees "Ashborn")
```

**K-Anonymity Amplified.** You hide in Ashborn's traffic + the protocol's pool.

---

## 🚀 Quick Start

```bash
npm install @alleyboss/ashborn-sdk
```

### Server-Side Privacy Relay

```typescript
import { PrivacyRelay } from '@alleyboss/ashborn-sdk';

const relay = new PrivacyRelay({
  relayKeypair: serverKeypair,
  rpcUrl: 'https://api.devnet.solana.com',
});

// PrivacyCash NEVER sees your user
await relay.shield({ amount: 0.1 });

// Radr Labs NEVER sees your user
await relay.generateStealth({ viewPubKey, spendPubKey });

// ZK proof WITHOUT identity exposure  
await relay.prove({ balance: 0.5, min: 0.1, max: 1.0 });
```

### Client-Side (Direct SDK)

```typescript
import { Ashborn } from '@alleyboss/ashborn-sdk';

const ashborn = new Ashborn(connection, wallet);
await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
```

---

## 🔥 What Protocols See

| Protocol | Without Ashborn | With Shadow Relay |
|----------|-----------------|-------------------|
| **PrivacyCash** | Your wallet address | `Ashborn Relay` |
| **Radr Labs** | Your stealth meta | `Ashborn Relay` |
| **Light Protocol** | Your ZK identity | `Ashborn Relay` |

---

## 🛡️ Features

| Feature | Description |
|---------|-------------|
| **Shadow Relay** | Protocols see Ashborn, not you |
| **K-Anonymity²** | Hide in Ashborn pool + protocol pool |
| **ECDH Stealth** | Vitalik's formula: `P = H(r*A)*G + B` |
| **ZK Compliance** | Prove statements without revealing data |
| **Ring Signatures** | 4+ decoys per transfer |

---

## 📦 Modules

```typescript
// Core
import { Ashborn, PrivacyRelay } from '@alleyboss/ashborn-sdk';

// Stealth (ECDH)
import { ShadowWire, generateDecoys } from '@alleyboss/ashborn-sdk/stealth';

// ZK Proofs
import { RangeCompliance } from '@alleyboss/ashborn-sdk/zk';

// Integrations
import { PrivacyCashOfficial, HeliusEnhanced } from '@alleyboss/ashborn-sdk/integrations';
```

---

## 🔒 Security

- **Non-Custodial**: Ashborn is a RELAY. Funds transit through, never stored.
- **Real ECDH**: Uses @noble/curves for proper elliptic curve operations.
- **Groth16 Proofs**: Real ZK via snarkjs (not simulated).
- **Metadata Stripped**: IP, User-Agent removed at relay layer.

---

## 📚 Resources

- 🎮 [Live Demo](https://ashborn.vercel.app)
- 📖 [Documentation](https://github.com/AlleyBo55/ashborn#readme)

---

<p align="center">
  <strong>PrivacyCash sees nothing. Radr Labs sees nothing.</strong><br/>
  <strong>ARISE.</strong> 🌑
</p>
