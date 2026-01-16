#!/bin/bash
# Ashborn - Deploy Script
# Deploys the program to Solana devnet

set -e

echo "🌑 Ashborn: The Shadow Monarch Awakens..."
echo ""

# Check for required tools
command -v anchor >/dev/null 2>&1 || { echo "Error: anchor is not installed"; exit 1; }
command -v solana >/dev/null 2>&1 || { echo "Error: solana CLI is not installed"; exit 1; }

# Configuration
CLUSTER=${1:-devnet}
echo "📡 Deploying to: $CLUSTER"

# Set cluster
solana config set --url $CLUSTER

# Check wallet balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "⚠️  Low balance! Requesting airdrop..."
    solana airdrop 2 || echo "Airdrop failed, proceeding anyway..."
fi

echo ""
echo "🔨 Building program..."
anchor build

echo ""
echo "🚀 Deploying program..."
anchor deploy --provider.cluster $CLUSTER

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/ashborn-keypair.json)
echo ""
echo "✅ Program deployed!"
echo "📋 Program ID: $PROGRAM_ID"

# Update Anchor.toml with new program ID
echo ""
echo "📝 Updating Anchor.toml..."
sed -i.bak "s/ashborn = \".*\"/ashborn = \"$PROGRAM_ID\"/" Anchor.toml

# Update lib.rs declare_id!
echo "📝 Updating lib.rs..."
sed -i.bak "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" programs/ashborn/src/lib.rs

echo ""
echo "🌑 The Shadow Monarch has risen!"
echo ""
echo "Next steps:"
echo "  1. Run tests: anchor test --provider.cluster $CLUSTER"
echo "  2. Start demo: cd app && npm run dev"
echo "  3. Visit: http://localhost:3000"
echo ""
echo "\"I alone level up.\" — Sung Jin-Woo"
