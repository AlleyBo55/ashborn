#!/bin/bash

# Ashborn Devnet Deployment Script
# Run this to deploy the program to Solana devnet

set -e

echo "🌑 ASHBORN DEVNET DEPLOYMENT"
echo "==============================="

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Install from https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Check Anchor CLI
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Install with: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

# Set cluster to devnet
echo "📍 Setting cluster to devnet..."
solana config set --url https://api.devnet.solana.com

# Check wallet balance
BALANCE=$(solana balance --lamports 2>/dev/null || echo "0")
echo "💰 Wallet balance: $BALANCE lamports"

if [ "$BALANCE" -lt "1000000000" ]; then
    echo "⚠️  Low balance. Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build the program
echo ""
echo "🔨 Building program..."
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/ashborn-keypair.json 2>/dev/null || echo "")

if [ -z "$PROGRAM_ID" ]; then
    echo "📝 Generating new program keypair..."
    solana-keygen new -o target/deploy/ashborn-keypair.json --no-bip39-passphrase --force
    PROGRAM_ID=$(solana address -k target/deploy/ashborn-keypair.json)
fi

echo "🔑 Program ID: $PROGRAM_ID"

# Update Anchor.toml and lib.rs with correct program ID
echo ""
echo "📝 Updating program IDs in config files..."

# Update Anchor.toml
sed -i.bak "s/ashborn = \".*\"/ashborn = \"$PROGRAM_ID\"/" Anchor.toml
rm -f Anchor.toml.bak

# Update lib.rs
sed -i.bak "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" programs/ashborn/src/lib.rs
rm -f programs/ashborn/src/lib.rs.bak

# Rebuild with correct ID
echo ""
echo "🔨 Rebuilding with correct program ID..."
anchor build

# Deploy to devnet
echo ""
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Program ID: $PROGRAM_ID"
echo "Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo "Next steps:"
echo "  1. Update app/.env.local with NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID"
echo "  2. Run: cd app && npm run dev"
echo "  3. Connect wallet and test!"
echo ""
echo "🌑 ARISE."
