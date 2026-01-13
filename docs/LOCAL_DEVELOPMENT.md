# Local Development Guide 🛠️

Run Ashborn entirely on your machine without spending Devnet SOL.

## Prerequisites
- Solana Tool Suite (`solana --version`)
- Anchor CLI (`anchor --version`)
- Node.js & NPM

## Step 1: Start Local Validator
Open a new terminal and run:
```bash
solana-test-validator
```
*Keep this terminal running. It simulates the Solana blockchain locally.*

## Step 2: Configure for Localnet
In a **new terminal**, configure your Solana CLI to use localhost:
```bash
solana config set --url localhost
```

## Step 3: Deploy Program
Build and deploy the Smart Contract to your local validator:

```bash
# 1. Build
anchor build

# 2. Get your new Program ID
solana address -k target/deploy/ashborn-keypair.json

# 3. Update Anchor.toml and lib.rs with this new ID if it changed
anchor keys sync

# 4. Deploy
anchor deploy --provider.cluster localnet
```

## Step 4: Configure App
The frontend needs to know it's running locally.

1.  Copy the example env file:
    ```bash
    cp app/.env.example app/.env.local
    ```
2.  Open `app/.env.local` and update:
    *   `NEXT_PUBLIC_SOLANA_RPC_URL`: `http://127.0.0.1:8899`
    *   `NEXT_PUBLIC_ASHBORN_PROGRAM_ID`: *(Paste the address from Step 3)*

## Step 5: Run App
```bash
cd app
npm run dev
```

Open `http://localhost:3000`.

## Step 6: Get Local SOL
You need SOL on localnet to test.
```bash
# Airdrop 10 SOL to your wallet address (copy from Phantom/Backpack)
solana airdrop 10 <YOUR_WALLET_ADDRESS>
```
*Note: Ensure your wallet extension is switched to "Localhost" or "Localnet".*

---

## Troubleshooting

### "Program ID mismatch"
If you see an error about program ID mismatch, it means `lib.rs` (in the program) and `Anchor.toml` have different IDs than the deployed keypair.
**Fix:** Run `anchor keys sync` and rebuild/redeploy.

### "Simulation failed"
Ensure your wallet is connected to **Localhost**, not Devnet or Mainnet.
