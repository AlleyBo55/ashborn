
<h1 align="center">🌑 @alleyboss/ashborn-sdk</h1>

<p align="center">
  <strong>THE SHADOW RELAY — Privacy Layer for Solana</strong>
</p>

<p align="center">
  <em>"I shall protect my family, even if it means turning the entire world against me.<br/>
  There is no need for words among shadows."</em><br/>
  — The Shadow Monarch
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/v/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@alleyboss/ashborn-sdk"><img src="https://img.shields.io/npm/dm/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://github.com/AlleyBo55/ashborn/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@alleyboss/ashborn-sdk.svg?style=flat-square" alt="license" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🛡️_Shadow_Relay-Network_Privacy-red?style=flat-square" />
  <img src="https://img.shields.io/badge/🤖_Shadow_Agents-AI_Commerce-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/👻_Shadow_Wire-Stealth_Address-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/🎭_Shadow_Seal-ZK_Compliance-green?style=flat-square" />
</p>

---

## 🌑 THE SHADOW ARSENAL

Ashborn is not just a relay. It is a **complete privacy operating system** for Solana.

### 1. ⚡ THE SHADOW RELAY (Network Privacy)
**"The Monarch stands in front. The world sees only Him."**
Ashborn acts as a sovereign entity, wrapping your interactions with other protocols.
- **PrivacyCash** sees "Ashborn Relay".
- **Radr Labs** sees "Ashborn Relay".
- **You** remain a ghost.

### 2. 🤖 SHADOW AGENTS (Private AI Commerce)
**"My soldiers trade in silence."**
Compute-to-Compute payments where neither AI reveals its strategy or wallet.
- **AI Buyers** pay for inference/data without exposing their treasury.
- **AI Sellers** receive funds without revealing their earnings.

### 3. 👻 SHADOW WIRE (Stealth Addresses)
**"I am everywhere, yet nowhere."**
Deterministic stealth addresses based on `secp256k1` (Vitalik's formula).
- Generate infinite one-time deposit addresses from a single root key.
- mathematically unlinkable on-chain.

### 4. 🎭 SHADOW SEAL (ZK Compliance)
**"Prove your power without revealing your face."**
Zero-Knowledge Range Proofs (Groth16) to satisfy requirements without doxxing.
- Prove "I have > 10 SOL" without revealing exact balance.
- Compatible with regulatory gateways (e.g. "User is not sanctioned").

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
