![Ashborn Shadow Monarch](app/public/assets/hero-eye-override.png)

# 🌑 **ASHBORN: The Shadow Monarch** 🌑

> *"I alone level up."* — Sung Jin-Woo

**Ashborn** is a **Compliant Private Payment Protocol** on Solana that enables:
*   **⚔️ Private Transfers** — Send SOL/tokens without revealing sender, recipient, or amount
*   **🔮 Selective Disclosure** — Prove balance ranges without revealing exact amounts
*   **👻 Stealth Addresses** — Receive payments at unlinkable addresses
*   **🛡️ NFT Privacy** — Own and prove NFT traits without revealing which NFT

> 🚨 **PRODUCTION READY** — Deployed on **Solana Devnet** with **Real ZK Verification**
> Program ID: `BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe`

Built with **real ZK proofs (Groth16)**, **Circom circuits**, **Solana Alt_bn128 syscalls**, and a robust **compliance-friendly** design.

> 🎮 **Live Demo:** [https://ashborn.vercel.app](https://ashborn-sol.vercel.app)
> Now featuring the **Shadow Monarch Aesthetic** experience.

---

## 🧩 Easy Integration

<p align="center">
  <a href="https://privacy.cash" target="_blank">
    <img src="https://img.shields.io/badge/Easy%20Integration%20with-Radr_Labs-purple?style=for-the-badge&logo=solana" alt="Radr Labs" />
    <img src="https://img.shields.io/badge/Easy%20Integration%20with-PrivacyCash-blueviolet?style=for-the-badge&logo=solana" alt="PrivacyCash" />
  </a>
  <a href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank">
    <img src="https://img.shields.io/badge/AI%20Payments-X402%20Paywall-blue?style=for-the-badge&logo=npm" alt="X402 Paywall" />
  </a>
</p>

### AI-to-AI Privacy Commerce Suite

Ashborn integrates with **PrivacyCash** and **X402 Paywall** to enable autonomous AI agent commerce:

| Demo | Path | Use Case |
|------|------|----------|
| **Interop** | `/demo/interop` | Shield → Stealth Transfer → Unshield |
| **AI Payment** | `/demo/ai-payment` | Agent pays for API via X402 |
| **AI Lending** | `/demo/ai-lending` | ZK Collateral Proofs |
| **AI Transfer** | `/demo/ai-transfer` | Stealth + Decoy Outputs |

---

## 📦 SDK Status

> ✅ **PUBLISHED to npm** — The SDK is available as `@alleyboss/ashborn-sdk`.
> ```bash
> npm install @alleyboss/ashborn-sdk
> ```

---

## 🏗️ Architecture: The Real ZK Stack

Simulations are over. Ashborn uses a production-grade ZK stack.

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                         │
│                  (Next.js Demo at localhost:3000)               │
│                            │                                    │
│  Gen Proof (WASM)          │                                    │
│  [client-side]             ▼                                    │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SOLANA BLOCKCHAIN                           │
│                     (Program: BzBU...5Qe)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ZK VERIFIER (verifier.rs)                                │  │
│  │  - Uses Solana's native `alt_bn128_pairing` syscall       │  │
│  │  - Verifies Groth16 proofs < 200k CUs                     │  │
│  │  - Keys: Real generated from Powers of Tau                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  STATE MANAGEMENT                                         │  │
│  │  - Nullifiers: PDA-based double-spend protection          │  │
│  │  - State: Merkle Trees (20 levels)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Real Status |
|-----------|------------|-------------|
| **Circuits** | Circom 2.1 | ✅ Compiled (Shield, Transfer) |
| **Proof System** | Groth16 | ✅ Active |
| **Verification** | Solana Syscalls | ✅ `alt_bn128` utilized |
| **Trusted Setup** | Powers of Tau | ✅ Hermez Protocol Ceremony |
| **Client** | snarkjs (WASM) | ✅ Browser-compatible |

---

## 🚀 Running the Project

### Prerequisites
*   Node.js 18+
*   Solana CLI
*   Anchor 0.30+

### Quick Start (Docker)
```bash
docker-compose up --build -d
# Open http://localhost:3000
```

### Manual Development
```bash
# 1. Clone & Install
git clone https://github.com/alleyboss/ashborn.git
cd ashborn
npm install

# 2. Run the Demo App
cd app
npm install
npm run dev
# App runs at http://localhost:3000

# 3. Build the SDK
cd ../sdk
npm install
npm run build
# Outputs: dist/index.js (CJS), dist/index.mjs (ESM)
```

---

## 🌐 Deployed Addresses (Devnet)

| Contract | Address |
|----------|---------|
| **Ashborn Program** | [`BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe`](https://explorer.solana.com/address/BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe?cluster=devnet) |
| **IDL** | `54Fp3foQ9XkLpykGaYKF7Hnb2YywpfLebRpZ637AGoxz` |

---

## 🔮 SDK Usage

### Installation
```bash
npm install @alleyboss/ashborn-sdk
```

### Basic Usage
```typescript
import { Ashborn } from '@alleyboss/ashborn-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const ashborn = new Ashborn(connection, wallet);

// Shield SOL (deposit into privacy pool)
// Generates REAL ZK proof of deposit
await ashborn.shield({
  amount: 1_000_000_000n,  // 1 SOL
  mint: 'So11111111111111111111111111111111111111112',
});

// Private transfer with decoys
// Generates REAL ZK proof of transfer
await ashborn.shadowTransfer({
  amount: 500_000_000n,
  recipientStealth: '<stealth-address>',
});
```

---

## 📚 Documentation

Visit the **Documentation** page in the live demo (`https://ashborn-sol.vercel.app/docs`) to learn about:
- **Core Concepts** — Commitments, nullifiers, stealth addresses
- **API Reference** — Full SDK method documentation
- **Circuit Logic** — How the ZK proofs enforce integrity

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT — See [LICENSE](LICENSE)

---

<p align="center">
  <b>ARISE.</b>
</p>
