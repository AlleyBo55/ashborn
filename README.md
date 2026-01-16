![Ashborn Shadow Monarch](app/public/assets/hero-eye-override.png)

# 🌑 **ASHBORN: The Shadow Monarch** 🌑

> *"I alone level up."* — Sung Jin-Woo

---

## ⚡ THE SHADOW RELAY — Your Identity Dies Here

**Stop exposing yourself to every protocol.**

When you use PrivacyCash directly → **PrivacyCash knows your wallet.**  
When you use Radr Labs directly → **Radr Labs knows your identity.**  
When you use *any* privacy protocol → **That protocol sees YOU.**
> 🎮 **Live Demo:** [https://ashborn.vercel.app](https://ashborn-sol.vercel.app)
> Now featuring the **Shadow Monarch Aesthetic** experience.

### With Ashborn? **They see nothing.**

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│      YOU        │ ───▶ │  ASHBORN RELAY  │ ───▶ │  PrivacyCash    │
│   (Invisible)   │      │ "The Monarch"   │      │  (Sees Ashborn) │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                │
                                ▼
                         ┌─────────────────┐
                         │   Radr Labs     │
                         │  (Sees Ashborn) │
                         └─────────────────┘
```

**PrivacyCash sees "Ashborn Relay."**  
**Radr Labs sees "Ashborn Relay."**  
**You? You're a ghost.**

---

## 🔥 Why The Shadow Relay Changes Everything

| Without Ashborn | With Ashborn Shadow Relay |
|-----------------|---------------------------|
| PrivacyCash knows your wallet | PrivacyCash sees **Ashborn** |
| Radr Labs tracks your stealth | Radr Labs sees **Ashborn** |
| Light Protocol links your proofs | Light Protocol sees **Ashborn** |
| You hide in 1 protocol's pool | You hide in **Ashborn + ALL protocols** |
| 1 protocol breach = you're exposed | **K-Anonymity Amplified** |

---

## 🛡️ How It Works

### The Shadow Monarch Principle
> *"The Shadow Army sees only the Monarch. The Enemy sees nothing."*

1. **You send intent to Ashborn** (shield 1 SOL, transfer 0.5 SOL privately)
2. **Ashborn wraps it in a Shadow Envelope** (strips your IP, wallet, metadata)
3. **Ashborn calls PrivacyCash/Radr with ITS OWN identity**
4. **Protocols execute** — they only see Ashborn's omnibus wallet
5. **You receive results** — unlinkable, anonymous, untraceable

---

## 🚀 Quick Start

```bash
npm install @alleyboss/ashborn-sdk
```

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

// ZK Proof WITHOUT identity exposure
await relay.prove({ balance: 0.5, min: 0.1, max: 1.0 });
```

---

## 🤝 Protocol Integrations

| Protocol | What They See | What They DON'T See |
|----------|---------------|---------------------|
| **PrivacyCash** | Ashborn Relay wallet | Your wallet, IP, identity |
| **Radr Labs** | Ashborn Relay ephemeral key | Your stealth meta-address |
| **Light Protocol** | Ashborn's ZK commitment | Your balance, history |

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

| Demo | What It Shows |
|------|---------------|
| [Shadow Agent](/demo/shadow-agent) | AI-to-AI private commerce via Relay |
| [Interop](/demo/interop) | Shield → Stealth → Unshield (all via Relay) |
| [AI Lending](/demo/ai-lending) | ZK Collateral proofs via Relay |
| [Stealth Transfer](/demo/ai-transfer) | Ring signatures via Relay |

> 🎮 **Try it:** [ashborn.vercel.app](https://ashborn-sol.vercel.app)
Visit the **Documentation** page in the live demo (`https://ashborn-sol.vercel.app/docs`) to learn about:
- **Core Concepts** — Commitments, nullifiers, stealth addresses
- **API Reference** — Full SDK method documentation
- **Circuit Logic** — How the ZK proofs enforce integrity

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
