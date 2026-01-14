'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const DENOMINATIONS = [
    { label: '0.1 SOL', value: BigInt(100_000_000), display: '0.1' },
    { label: '1 SOL', value: BigInt(1_000_000_000), display: '1' },
    { label: '10 SOL', value: BigInt(10_000_000_000), display: '10' },
];

type DemoStatus = 'idle' | 'confirming' | 'processing' | 'success' | 'error';

export default function ShieldDemoPage() {
    const { connected, publicKey } = useWallet();
    const [selectedAmount, setSelectedAmount] = useState(DENOMINATIONS[0]);
    const [status, setStatus] = useState<DemoStatus>('idle');
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleShield = async () => {
        if (!connected || !publicKey) return;

        setStatus('confirming');
        setError(null);

        // Simulate shield operation
        try {
            setStatus('processing');
            await new Promise(resolve => setTimeout(resolve, 2000));
            const fakeSignature = Array.from({ length: 64 }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');

            setTxSignature(fakeSignature);
            setStatus('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setStatus('error');
        }
    };

    const resetDemo = () => {
        setStatus('idle');
        setTxSignature(null);
        setError(null);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full text-sm mb-6 border border-purple-500/20">
                    <Shield className="w-4 h-4" />
                    Interactive Demo
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Shield Assets</h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Deposit SOL into the privacy pool. Your amount is hidden in a cryptographic commitment.
                </p>
            </motion.div>

            {/* Demo Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
            >
                {!connected ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-gray-400 mb-6">Connect a Solana wallet to try the shield demo on devnet.</p>
                        {/* Wallet Button is in Layout, so we point user there or show a placeholder hint */}
                        <div className="text-sm text-purple-300 animate-pulse">
                            (Use button in top right)
                        </div>
                    </div>
                ) : status === 'success' ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Shield Successful!</h3>
                        <p className="text-gray-400 mb-4">
                            {selectedAmount.display} SOL has been shielded into the privacy pool.
                        </p>
                        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5">
                            <div className="text-xs text-gray-500 mb-1">Transaction Signature</div>
                            <code className="text-xs text-purple-300 break-all font-mono">{txSignature}</code>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-left mb-6">
                            <div className="text-sm text-purple-300 mb-2">What happened:</div>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Created commitment: <code className="text-purple-300">C = Poseidon(amount, blinding)</code></li>
                                <li>• Amount encrypted with your view key</li>
                                <li>• Only the commitment is visible on-chain</li>
                            </ul>
                        </div>
                        <button
                            onClick={resetDemo}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : status === 'error' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-red-400">Transaction Failed</h3>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={resetDemo}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Wallet Info */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                            <div>
                                <div className="text-xs text-gray-500 mb-1 font-mono">CONNECTED_WALLET</div>
                                <code className="text-sm text-purple-300 font-mono">
                                    {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                                </code>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1 font-mono">NETWORK</div>
                                <span className="text-sm text-yellow-400 flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                    Devnet
                                </span>
                            </div>
                        </div>

                        {/* Amount Selection */}
                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 mb-3 font-medium">Select Amount (Fixed Denominations)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {DENOMINATIONS.map((denom) => (
                                    <button
                                        key={denom.display}
                                        onClick={() => setSelectedAmount(denom)}
                                        className={`py-4 rounded-xl font-semibold transition border ${selectedAmount.value === denom.value
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {denom.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * Fixed amounts prevent fingerprinting analysis.
                            </p>
                        </div>

                        {/* Shield Button */}
                        <button
                            onClick={handleShield}
                            disabled={status === 'processing' || status === 'confirming'}
                            className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {status === 'processing' || status === 'confirming' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {status === 'confirming' ? 'Check Wallet...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Shield {selectedAmount.display} SOL
                                </>
                            )}
                        </button>

                        {/* Info Box */}
                        <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                            <p className="text-xs text-amber-200/60 leading-relaxed">
                                <strong>Simulation Mode:</strong> This interface mimics the Shielding process. On a live deployment, this would invoke the Ashborn program to create a ZK note on-chain.
                            </p>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Code Example */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
            >
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <div className="bg-[#0E0E0E] rounded-xl overflow-hidden border border-white/10">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <span className="text-sm text-gray-400 font-mono">shield.ts</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                    </div>
                    <pre className="p-6 overflow-x-auto text-sm font-mono">
                        <code className="text-gray-300">{`import { Ashborn } from '@ashborn/sdk';

const ashborn = new Ashborn(connection, wallet);

// Shield SOL into privacy pool
const result = await ashborn.shield({
  amount: ${selectedAmount.value.toString()}n, // ${selectedAmount.display} SOL
  mint: SOL_MINT,
});

console.log('Commitment:', result.commitment);
console.log('Signature:', result.signature);`}</code>
                    </pre>
                </div>
            </motion.div>
        </div>
    );
}
