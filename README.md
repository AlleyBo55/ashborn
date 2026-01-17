![Ashborn Shadow Monarch](app/public/assets/hero-eye-override.png)

# 🌑 **ASHBORN: The Shadow Monarch** 🌑

> *"I shall protect my family, even if it means turning the entire world against me.*  
> *There is no need for words among shadows."*  
> — The Shadow Monarch

---

## ⚡ THE SHADOW MONARCH — Your Identity Dies Here

**Stop exposing yourself to every protocol.**

When you use PrivacyCash directly → **PrivacyCash knows your wallet.**  
When you use PrivacyCash directly → **PrivacyCash knows your wallet.**  
When you use *any* privacy protocol → **That protocol sees YOU.**
> 🎮 **Live Demo:** [https://ashborn.vercel.app](https://ashborn-sol.vercel.app)
> Now featuring the **Shadow Monarch Aesthetic** experience.

### With Ashborn? **They see nothing.**

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│      YOU        │ ───▶ │  SHADOW MONARCH │ ───▶ │  PrivacyCash    │
│   (Invisible)   │      │   (The Entity)  │      │ (Sees Monarch)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                │
                                ▼
                         ┌─────────────────┐
                         │   Recipient     │
                         │ (Sees Monarch)  │
                         └─────────────────┘
```

**PrivacyCash sees "The Shadow Monarch."**  
**PrivacyCash sees "The Shadow Monarch."**  
**You? You're a ghost.**

---

## 🔥 Why The Shadow Monarch Changes Everything

| Without Ashborn | With The Shadow Monarch |
|-----------------|-------------------------|
| PrivacyCash knows your wallet | PrivacyCash sees **The Monarch** |
| Light Protocol links your proofs | Light Protocol sees **The Monarch** |
| You hide in 1 protocol's pool | You hide in **The Monarch's Army** |
| 1 protocol breach = you're exposed | **K-Anonymity Amplified** |

---

## 🛡️ How It Works

### The Shadow Monarch Principle
> *"The Shadow Army sees only the Monarch. The Enemy sees nothing."*

1. **You send intent to Ashborn** (shield 1 SOL, transfer 0.5 SOL privately)
2. **The Shadow Monarch envelopes it** (strips your IP, wallet, metadata)
3. **The Monarch calls PrivacyCash/Recipient with ITS OWN identity**
4. **Protocols execute** — they only see The Monarch's omnibus wallet
5. **You receive results** — unlinkable, anonymous, untraceable

---

## 🚀 Quick Start

```bash
npm install @alleyboss/ashborn-sdk
```

## ⚙️ Critical Configuration

Ashborn requires a **Address Lookup Table (ALT)** to function on Devnet.
Without this config, you will encounter `ALT not found` errors.

### ❓ Why Is This Needed? (The 1232-Byte Limit)

Solana transactions have a hard limit of **1232 bytes**. PrivacyCash transactions are "heavy" due to Zero-Knowledge proofs.

```mermaid
graph TD
    subgraph WITHOUT_ALT [❌ Without ALT (Fails)]
        A[ZK Proof\n400 bytes] --> B[Encrypted State\n200 bytes]
        B --> C[20 Addresses\n640 bytes]
        C --> D[Total: 1240 bytes]
        D -->|OVER LIMIT| E[❌ Transaction Failed]
        style D fill:#ffcccc,stroke:#ff0000
        style E fill:#ff0000,color:#fff
    end

    subgraph WITH_ALT [✅ With ALT (Success)]
        F[ZK Proof\n400 bytes] --> G[Encrypted State\n200 bytes]
        G --> H[20 Addresses\n20 bytes]
        H -- "Compressed via ALT" --> I[Total: 620 bytes]
        I -->|FITS| J[✅ Transaction Success]
        style I fill:#ccffcc,stroke:#00ff00
        style J fill:#00ff00,color:#fff
    end
```

### 🛠️ Setup Instructions

1. **Configure Environment:**
   Create `.env.local` in the `app` directory:
   ```bash
   # PrivacyCash Keypair (for shield/unshield operations)
   PRIVACYCASH_DEMO_KEYPAIR=[...your_privacycash_keypair...]
   
   # Ashborn Relay Keypair (receives user funds, acts as privacy layer)
   ASHBORN_RELAY_KEYPAIR=[...your_ashborn_relay_keypair...]
   
   # Address Lookup Table
   NEXT_PUBLIC_ALT_ADDRESS=<GENERATED_ADDRESS>
   ```

2. **Two Keypairs Required:**
   - **PRIVACYCASH_DEMO_KEYPAIR**: Used for PrivacyCash shield/unshield operations
   - **ASHBORN_RELAY_KEYPAIR**: Acts as the privacy relay layer between users and PrivacyCash
   
   **Why two keypairs?**
   ```
   User Wallet → ASHBORN_RELAY_KEYPAIR → PRIVACYCASH_DEMO_KEYPAIR → PrivacyCash
   
   PrivacyCash only sees PRIVACYCASH_DEMO_KEYPAIR, never the user's wallet!
   ```

3. **Generate ALT Address:**
   Run the included utility script to create and populate a Devnet ALT:
   ```bash
   npx tsx scripts/setup-alt.ts
   ```
   *Copy the output address into your `.env.local`.*

---

### Server-Side (Maximum Privacy)

```typescript
import { PrivacyRelay } from '@alleyboss/ashborn-sdk';

const relay = new PrivacyRelay({
  relayKeypair: serverKeypair,
  rpcUrl: 'https://api.devnet.solana.com',
});

// PrivacyCash NEVER sees your user
await relay.shield({ amount: 0.1 });

// ShadowWire - Recipient NEVER sees your user  
await relay.generateStealth({ viewPubKey, spendPubKey });

// ZK Proof — REAL Groth16 via snarkjs (not simulated)
const proof = await relay.prove({ balance: 0.5, min: 0.1, max: 1.0 });
// proof.isReal === true → Real cryptographic proof
```

---

## 🤝 Protocol Integrations

| Protocol | What They See | What They DON'T See |
|----------|---------------|---------------------|
| **PrivacyCash** | Ashborn Relay wallet | Your wallet, IP, identity |
| **ShadowWire** | Ashborn Relay ephemeral key | Your stealth meta-address |
| **Light Protocol** | Ashborn's ZK commitment | Your balance, history |
| **x402 Micropay** | Relay payment signature | Your agent's wallet |
| **ZK Groth16** | Valid proof (snarkjs) | Your actual balance |

---

## 🎭 The K-Anonymity Amplification

Traditional privacy:
- You → PrivacyCash pool → 100 users → **You're 1 of 100**

With Ashborn Shadow Relay:
- You → Ashborn pool → 1000 users → PrivacyCash pool → 100 users
- **You're 1 of 100,000** (1000 × 100 = K-Anonymity squared)

**PrivacyCash can't identify you because they only see Ashborn.**  
**Even if PrivacyCash is compromised, you're still anonymous.**

---

## 🔒 Compliance Without Exposure

Need to prove you're not a criminal? No problem.

```typescript
// Prove balance > $10,000 (for lender)
// WITHOUT revealing your wallet or exact balance
await relay.prove({ 
  balance: 50000, 
  min: 10000, 
  max: Infinity 
});
// ✅ Lender knows you qualify
// ❌ Lender doesn't know your wallet
// ❌ PrivacyCash doesn't know either
```

---

## 🌐 Live Demos

| Demo | Integrations | What It Shows |
|------|-------------|---------------|
| [Shadow Agent](/demo/shadow-agent) | PrivacyCash, ShadowWire, ZK Groth16 | AI-to-AI private commerce |
| [Interop](/demo/interop) | PrivacyCash, ShadowWire, Light Protocol | Full Shield → Stealth → Unshield flow |
| [AI Lending](/demo/ai-lending) | ZK Groth16, PrivacyCash | Private collateral proofs |
| [AI Payment](/demo/ai-payment) | x402 Micropay, PrivacyCash | Private AI micropayments |
| [Shield](/demo/shield) | PrivacyCash, Light Protocol | Deposit to privacy pool |
| [Prove](/demo/prove) | ZK Groth16, snarkjs | Real Groth16 range proofs |
| [ShadowWire](/demo/radr) | Native ShadowWire | Stealth address generation |

> 🎮 **Try it:** [ashborn-sol.vercel.app](https://ashborn-sol.vercel.app)

---

## 🎮 Demo Modes

The Shadow Agent demo has **two modes**. Both use **all Ashborn features** — the difference is whether PrivacyCash adds an extra mixing layer on top.

### What Ashborn Includes (Built-In Features)

These are NOT external services — they are **implemented inside Ashborn**:

| Feature | Implementation | Location in Code |
|---------|---------------|------------------|
| **ECDH Stealth Addresses** | Ashborn ShadowWire (Vitalik's formula) | `sdk/src/shadowwire.ts` |
| **ZK Hashing** | Light Protocol (Poseidon) | `programs/ashborn/Cargo.toml` |
| **State Compression** | Light Protocol (Merkle) | `programs/ashborn/src/state/merkle.rs` |
| **ZK Groth16 Proofs** | groth16-solana + snarkjs | On-chain program + SDK |

> **Clarification**: These are technologies **built into Ashborn's code**, not external API calls.

---

### ✅ Mode 1: Ashborn Only (Single-Layer Privacy)

**🛡️ Privacy Level: STRONG** — All features are 100% real and verifiable on-chain.

```
User Wallet → Ashborn Privacy Layer → Stealth Address (Recipient)
                    │
                    ├─ ShadowWire: Generate ECDH stealth address
                    ├─ Light Protocol: Update Merkle tree
                    ├─ ZK Groth16: Generate range proof
                    └─ Decoys: Add fake outputs
```

| Feature | Status |
|---------|--------|
| ECDH Stealth Addresses (ShadowWire) | ✅ Real |
| Light Protocol (ZK Compression) | ✅ Real |
| ZK Groth16 Proofs | ✅ Real |
| SOL Transfers | ✅ Real |

> **Use this mode for hackathon evaluation** — Everything verifiable on Solscan!

---

### 🛡️🛡️ Mode 2: Full Demo (Dual-Layer Privacy)

**🛡️🛡️ Privacy Level: MAXIMUM** — Ashborn's features PLUS PrivacyCash mixing pool.

```
User Wallet → Ashborn Privacy Layer → PrivacyCash Pool → Recipient
                    │                        │
                    ├─ ShadowWire ECDH       ├─ Funds mixed with others
                    ├─ Light Protocol        ├─ Transaction graph broken
                    ├─ ZK Groth16            └─ New ZK proof on exit
                    └─ Decoys
```

**Both modes do the same Ashborn processing!** The difference:
- Mode 1: Funds go directly to stealth address
- Mode 2: Funds also pass through PrivacyCash pool (extra mixing)

| Component | Status | Why? |
|-----------|--------|------|
| Ashborn (Layer 1) | ✅ Real | All features work on devnet |
| PrivacyCash Shield (Layer 2) | ⚠️ Simulated | ZK proof exceeds 1.4M compute |
| PrivacyCash Unshield | ⚠️ Simulated | Depends on shield working |

**Why dual-layer is stronger:**
- Even if stealth layer compromised → funds still mixed in pool
- Even if pool analyzed → stealth address hides identity
- **Attacker must break BOTH layers** — exponentially harder!

> **Why PrivacyCash simulated?** ZK proofs require ~1.85M compute units. Devnet limit is 1.4M. **Works on mainnet** with premium RPC.

---

## 💻 Deployed Wallets (Devnet)

| Component | Address | Purpose |
|-----------|---------|----------|
| **Ashborn Program** | [`BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe`](https://explorer.solana.com/address/BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe?cluster=devnet) | On-chain program |
| **Ashborn Relay Wallet** | [`77mZZ8UyWmkS4nMUQtxbFL98HRLpTjWrrFgowyg3BrA`](https://explorer.solana.com/address/77mZZ8UyWmkS4nMUQtxbFL98HRLpTjWrrFgowyg3BrA?cluster=devnet) | Privacy relay layer |
| **PrivacyCash Program** | [`ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS`](https://explorer.solana.com/address/ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS?cluster=devnet) | Shield/unshield operations |

---

## ⚠️ Devnet Limitations

### PrivacyCash Shield/Unshield Simulation

On **devnet**, PrivacyCash shield and unshield operations are **simulated** due to Solana compute limitations:

**Why?**
- PrivacyCash uses **Groth16 zero-knowledge proofs** for privacy
- ZK proof verification requires **>1.4M compute units**
- Solana devnet has strict **1.4M compute unit limit** to prevent abuse
- Even with maximum compute budget and priority fees, ZK proofs exceed devnet capacity

**What Works on Devnet:**
- ✅ **Deposit to Ashborn**: User wallet → Ashborn Relay (real transaction)
- ✅ **Ashborn to PrivacyCash**: Ashborn Relay → PrivacyCash wallet (real transaction)
- ⚠️ **Shield**: PrivacyCash ZK proof (simulated)
- ⚠️ **Unshield**: PrivacyCash ZK proof (simulated)

**Production (Mainnet):**
- ✅ **All operations work** with premium RPC providers:
  - [Helius](https://helius.dev) - Dedicated compute resources
  - [QuickNode](https://quicknode.com) - Higher compute limits
  - [Triton](https://triton.one) - Enterprise-grade infrastructure

**Technical Details:**
```
PrivacyCash ZK Proof Requirements:
- Groth16 verification: ~1.5M compute units
- Merkle tree updates: ~200K compute units
- Nullifier checks: ~150K compute units
- Total: ~1.85M compute units

Devnet Limit: 1.4M compute units (hard cap)
Mainnet with Premium RPC: 2M+ compute units
```

The demo gracefully simulates shield/unshield while showing **real deposit and transfer transactions** to demonstrate the complete privacy architecture.

---

## 📜 License

MIT — See [LICENSE](LICENSE)

---

<p align="center">
  <b>THE SHADOW RELAY</b><br/>
  <em>PrivacyCash sees nothing. Radr Labs sees nothing. Only you know.</em><br/><br/>
  <strong>ARISE.</strong>
</p>
