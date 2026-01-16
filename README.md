![Ashborn Shadow Monarch](app/public/assets/hero-eye-override.png)

# 🌑 **ASHBORN: The Shadow Monarch** 🌑

> *"I shall protect my family, even if it means turning the entire world against me.*  
> *There is no need for words among shadows."*  
> — The Shadow Monarch

---

## ⚡ THE SHADOW MONARCH — Your Identity Dies Here

**Stop exposing yourself to every protocol.**

When you use PrivacyCash directly → **PrivacyCash knows your wallet.**  
When you use Radr Labs directly → **Radr Labs knows your identity.**  
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
                         │   Radr Labs     │
                         │ (Sees Monarch)  │
                         └─────────────────┘
```

**PrivacyCash sees "The Shadow Monarch."**  
**Radr Labs sees "The Shadow Monarch."**  
**You? You're a ghost.**

---

## 🔥 Why The Shadow Monarch Changes Everything

| Without Ashborn | With The Shadow Monarch |
|-----------------|-------------------------|
| PrivacyCash knows your wallet | PrivacyCash sees **The Monarch** |
| Radr Labs tracks your stealth | Radr Labs sees **The Monarch** |
| Light Protocol links your proofs | Light Protocol sees **The Monarch** |
| You hide in 1 protocol's pool | You hide in **The Monarch's Army** |
| 1 protocol breach = you're exposed | **K-Anonymity Amplified** |

---

## 🛡️ How It Works

### The Shadow Monarch Principle
> *"The Shadow Army sees only the Monarch. The Enemy sees nothing."*

1. **You send intent to Ashborn** (shield 1 SOL, transfer 0.5 SOL privately)
2. **The Shadow Monarch envelopes it** (strips your IP, wallet, metadata)
3. **The Monarch calls PrivacyCash/Radr with ITS OWN identity**
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
   PRIVACYCASH_DEMO_KEYPAIR=[...your_keypair_array...]
   NEXT_PUBLIC_ALT_ADDRESS=<GENERATED_ADDRESS>
   ```

2. **Generate ALT Address:**
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

// Radr Labs NEVER sees your user  
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
| **Radr Labs** | Ashborn Relay ephemeral key | Your stealth meta-address |
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
| [Shadow Agent](/demo/shadow-agent) | PrivacyCash, Radr Labs, ZK Groth16 | AI-to-AI private commerce |
| [Interop](/demo/interop) | PrivacyCash, Radr Labs, Light Protocol | Full Shield → Stealth → Unshield flow |
| [AI Lending](/demo/ai-lending) | ZK Groth16, PrivacyCash | Private collateral proofs |
| [AI Payment](/demo/ai-payment) | x402 Micropay, PrivacyCash | Private AI micropayments |
| [Shield](/demo/shield) | PrivacyCash, Light Protocol | Deposit to privacy pool |
| [Prove](/demo/prove) | ZK Groth16, snarkjs | Real Groth16 range proofs |
| [ShadowWire](/demo/radr) | Radr Labs, ShadowWire | Stealth address generation |

> 🎮 **Try it:** [ashborn-sol.vercel.app](https://ashborn-sol.vercel.app)

---

## 📦 Deployed (Devnet)

| Component | Address |
|-----------|---------|
| **Ashborn Program** | [`BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe`](https://explorer.solana.com/address/BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe?cluster=devnet) |
| **PrivacyCash** | [`ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS`](https://explorer.solana.com/address/ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS?cluster=devnet) |

---

## 📜 License

MIT — See [LICENSE](LICENSE)

---

<p align="center">
  <b>THE SHADOW RELAY</b><br/>
  <em>PrivacyCash sees nothing. Radr Labs sees nothing. Only you know.</em><br/><br/>
  <strong>ARISE.</strong>
</p>
