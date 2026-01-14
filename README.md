![Ashborn Shadow Monarch](app/public/assets/hero-eye-override.png)

# 🌑 **ASHBORN: The Shadow Monarch** 🌑

> *"I alone level up."* — Sung Jin-Woo

**Ashborn** is a **Compliant Private Payment Protocol** on Solana that enables:
*   **⚔️ Private Transfers** — Send SOL/tokens without revealing sender, recipient, or amount
*   **🔮 Selective Disclosure** — Prove balance ranges without revealing exact amounts
*   **👻 Stealth Addresses** — Receive payments at unlinkable addresses
*   **🛡️ NFT Privacy** — Own and prove NFT traits without revealing which NFT

Built with **real ZK proofs (Groth16)**, **Merkle tree nullifiers**, and a **compliance-friendly** design.

---

## 📦 SDK Status

> ⚠️ **NOT YET PUBLISHED to npm** — The `@ashborn/sdk` package is a local package. To use:
> ```bash
> npm install ./sdk  # From monorepo root
> ```
> Once published, it will be available as `npm install @ashborn/sdk`.

---

## 🏗️ Architecture: How It All Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                         │
│                  (Next.js Demo at localhost:3000)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SDK (TypeScript)                            │
│                     sdk/src/ashborn.ts                          │
│  ┌──────────────┬──────────────┬──────────────┬───────────────┐ │
│  │  ShadowWire  │ PrivacyCash  │   Range      │    Crypto     │ │
│  │  (Stealth    │ (Shielding)  │  Compliance  │ (Poseidon,    │ │
│  │   Addresses) │              │  (ZK Proofs) │  AES-GCM)     │ │
│  └──────────────┴──────────────┴──────────────┴───────────────┘ │
│                              │                                   │
│  Generates:                  │ Uses:                             │
│  - snarkjs Groth16 proofs    │ - @noble/curves (Schnorr, Ed25519)│
│  - Poseidon commitments      │ - WebCrypto (AES-GCM, HKDF)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (RPC via @solana/web3.js)
┌─────────────────────────────────────────────────────────────────┐
│                 SOLANA PROGRAM (Rust/Anchor)                    │
│                 programs/ashborn/src/lib.rs                     │
│  ┌──────────────┬──────────────┬──────────────────────────────┐ │
│  │  ZK Verifier │ Merkle Tree  │    Instructions              │ │
│  │  (Groth16    │ (Nullifiers  │    - shield_deposit          │ │
│  │   ark_bn254) │  Commitments)│    - shadow_transfer         │ │
│  │              │              │    - selective_reveal        │ │
│  │              │              │    - unshield                │ │
│  └──────────────┴──────────────┴──────────────────────────────┘ │
│                                                                  │
│  Verifies:                                                       │
│  - Groth16 proofs via ark_groth16                               │
│  - Poseidon hashes for commitments                              │
│  - Merkle paths for nullifier checking                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SOLANA BLOCKCHAIN                           │
│                     (Devnet / Mainnet)                          │
└─────────────────────────────────────────────────────────────────┘
```

### How SDK Connects to Rust

1. **SDK creates transactions** using `@solana/web3.js` and `@coral-xyz/anchor`
2. **SDK generates ZK proofs** using `snarkjs` (in browser) from circuit WASM files
3. **SDK sends transactions** to Solana RPC which forwards to the on-chain program
4. **Program verifies proofs** using `ark_groth16` crate and embedded verification keys

---

## 🎮 Demo Pages Explained

| Demo | URL | What it Simulates | Real Code |
|------|-----|-------------------|-----------|
| **Shield** | `/demo/shield` | Depositing SOL into privacy pool | Creates Poseidon commitment, encrypts with view key |
| **Transfer** | `/demo/transfer` | Private P2P payment with decoys | Generates stealth address, adds 3 dummy outputs |
| **Prove** | `/demo/prove` | Range proof for compliance | Real Groth16 proof structure (π_A, π_B, π_C) |
| **NLP** | `/demo/nlp` | Natural language parsing | AI parses "send 1 SOL to alice.sol" |

> ⚠️ **Demo Mode**: The demos run in **simulation mode** without requiring a deployed program. They demonstrate the UI/UX and data structures. For real transactions, deploy the program to devnet/mainnet.

---

## 🚀 Running the Project

### Prerequisites
*   Node.js 18+
*   Rust 1.70+ (for Anchor program)
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
git clone https://github.com/your-org/ashborn.git
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

# 4. Build the Rust Program (optional)
anchor build
# Outputs: target/deploy/ashborn.so
```

---

## 🌐 Devnet vs Mainnet

### Current State: Devnet (Simulated)

The demos currently run in **simulation mode**:
- Proofs are generated but not verified on-chain
- No real tokens are moved
- Program is not deployed

### Moving to Mainnet

| Step | Action | Status |
|------|--------|--------|
| 1 | **Compile Circuits** | Run `cd circuits && npm run build` |
| 2 | **Trusted Setup** | Generate `range.zkey`, `transfer.zkey`, `shield.zkey` |
| 3 | **Export VK** | `snarkjs zkey export verificationkey` → embed in `vkeys.rs` |
| 4 | **Deploy Program** | `anchor deploy --provider.cluster mainnet` |
| 5 | **Update SDK** | Set `PROGRAM_ID` in `constants.ts` to mainnet address |
| 6 | **Configure RPC** | Set `SOLANA_RPC_URL` to mainnet-beta |

### Environment Variables

```bash
# .env.local for app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your-mainnet-program-id>

# For SDK
HELIUS_API_KEY=<key>          # Enhanced indexing
OPENAI_API_KEY=<key>          # NLP parsing
RELAYER_ENDPOINT=<url>        # Privacy relay (optional)
```

---

## 🔮 SDK Usage

### Installation (Local)
```bash
# From monorepo root
npm install ./sdk

# Or link for development
cd sdk && npm link
cd ../app && npm link @ashborn/sdk
```

### Basic Usage
```typescript
import { Ashborn } from '@ashborn/sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const ashborn = new Ashborn(connection, wallet);

// Shield SOL (deposit into privacy pool)
await ashborn.shield({
  amount: 1_000_000_000n,  // 1 SOL
  mint: 'So11111111111111111111111111111111111111112',
});

// Private transfer with decoys
await ashborn.shadowTransfer({
  amount: 500_000_000n,
  recipientStealth: '<stealth-address>',
});

// Prove balance is in range (for compliance)
await ashborn.proveRange({
  min: 0n,
  max: 10_000_000_000_000n,  // Under $10,000
});
```

---

## 📚 Documentation Pages

The `/docs` page at `localhost:3000/docs` covers:
- **Getting Started** — Installation and first transaction
- **Core Concepts** — Commitments, nullifiers, stealth addresses
- **API Reference** — Full SDK method documentation
- **Demo Walkthroughs** — Interactive tutorials for each feature
- **Deployment Guide** — Devnet → Mainnet migration

---

## 🧪 Testing

```bash
# SDK unit tests
cd sdk && npm run test

# Rust program tests
anchor test

# E2E integration
cd sdk && npm run test:e2e
```

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
