# Wallet Integration Implementation Guide

## Status: READY TO IMPLEMENT

### ✅ Completed:
1. Backend API updated with two-keypair architecture
2. WalletProvider component created
3. Dependencies already installed

### 📝 Remaining Tasks:

#### 1. Wrap app with WalletProvider
**File:** `/app/src/app/layout.tsx`
```tsx
import { WalletProvider } from '@/components/WalletProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

#### 2. Add wallet connection to shadow-agent demo
**File:** `/app/src/app/demo/shadow-agent/page.tsx`

Add imports:
```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
```

Add wallet hook:
```tsx
const { publicKey, sendTransaction } = useWallet();
```

Add wallet button in UI (after DEMO_WALLET section):
```tsx
<TerminalSection title="WALLET_CONNECTION">
  <div className="flex items-center justify-between">
    <div className="text-xs text-gray-400">
      {publicKey ? (
        <span>Connected: {publicKey.toBase58().slice(0, 8)}...</span>
      ) : (
        <span>No wallet connected (using server wallet)</span>
      )}
    </div>
    <WalletMultiButton />
  </div>
</TerminalSection>
```

Add deposit step before shield (in runShadowAgentDemo):
```tsx
// After negotiation complete, before shield
if (publicKey) {
  addLog('💳 Depositing to Ashborn Relay...');
  
  // Get relay address
  const relayRes = await fetch('/api/ashborn', {
    method: 'POST',
    body: JSON.stringify({ action: 'relay-address' })
  });
  const { relayAddress } = await relayRes.json();
  
  // Create transfer transaction
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(relayAddress),
      lamports: 0.025 * LAMPORTS_PER_SOL
    })
  );
  
  // User signs
  const signature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature);
  
  addLog(`✅ Deposited to relay: ${signature.slice(0, 16)}...`);
}
```

Add wallet comparison display (in TRANSACTION_COMPLETE section):
```tsx
{publicKey && (
  <div className="bg-black/40 border border-white/10 p-3 rounded mt-3">
    <div className="text-[10px] text-gray-500 mb-2">PRIVACY ARCHITECTURE</div>
    <div className="space-y-1 text-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-blue-400">👤 Your Wallet:</span>
        <span className="font-mono">{publicKey.toBase58().slice(0,8)}... (HIDDEN)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-purple-400">🛡️ Ashborn Relay:</span>
        <span className="font-mono">2VQB...Cvh (VISIBLE)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-400">🏛️ PrivacyCash:</span>
        <span className="font-mono">9TW3...R9f (VISIBLE)</span>
      </div>
    </div>
  </div>
)}
```

### 🎯 Expected Behavior:
- Without wallet: Demo runs with server wallet (current behavior)
- With wallet: User deposits → Relay shields → PrivacyCash sees relay

### 📚 No SDK/NPM Updates Needed:
- This is a demo-only feature
- SDK remains unchanged
- No npm publish required

Should I proceed with implementing these changes?
