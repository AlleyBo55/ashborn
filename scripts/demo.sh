#!/bin/bash
# Ashborn - Demo Script
# Runs the complete demo flow

set -e

echo "🌑 ASHBORN DEMO"
echo "═══════════════════════════════════════"
echo ""

# Start frontend
echo "🚀 Starting demo application..."
echo ""

cd app

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting Next.js dev server..."
echo ""
echo "═══════════════════════════════════════"
echo ""
echo "  Demo app starting at: http://localhost:3000"
echo ""
echo "  Features to try:"
echo "  1. Connect wallet (Phantom/Backpack)"
echo "  2. Initialize Shadow Vault"
echo "  3. Shield SOL"
echo "  4. Send Shadow Transfer"
echo "  5. Generate Compliance Proof"
echo ""
echo "═══════════════════════════════════════"
echo ""
echo "\"The shadows await your command...\" — Shadow Monarch"
echo ""

npm run dev
