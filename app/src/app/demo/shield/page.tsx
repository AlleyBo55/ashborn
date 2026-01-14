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
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Shadow Extraction</h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Extract SOL into the Shadow Domain. Your assets become invisible to the public ledger.
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
                        <p className="text-gray-400 mb-6">Connect a Solana wallet to initiate extraction.</p>
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
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Extraction Complete</h3>
                        <p className="text-gray-400 mb-4">
                            {selectedAmount.display} SOL is now in the Shadow Domain.
                        </p>
                        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5">
                            <div className="text-xs text-gray-500 mb-1">Shadow Trace (Signature)</div>
                            <code className="text-xs text-purple-300 break-all font-mono">{txSignature}</code>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-left mb-6">
                            <div className="text-sm text-purple-300 mb-2">Extraction Analysis:</div>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Commitment Forged: <code className="text-purple-300">C = Poseidon(amount, blinding)</code></li>
                                <li>• Note encrypted with view key</li>
                                <li>• Public trace erased</li>
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
                                    Extract {selectedAmount.display} SOL
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
                )}
            </motion.div>

            {/* Privacy Visualizer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="grid md:grid-cols-2 gap-6 mt-8"
            >
                {/* Public View (Solscan) */}
                <div className="bg-[#1a1b26] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-3 bg-[#13141f] border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">S</div>
                            <span className="text-xs font-medium text-gray-400">Solscan (Public Ledger)</span>
                        </div>
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">PUBLIC</span>
                    </div>
                    <div className="p-5 font-mono text-sm space-y-4">
                        <div>
                            <div className="text-gray-500 text-xs mb-1">Wallet Balance</div>
                            <div className="text-red-400 font-bold flex items-center gap-2">
                                {status === 'success' ? (
                                    <>
                                        <span>0.50 SOL</span>
                                        <span className="text-[10px] text-gray-500 font-normal line-through">1.0 SOL</span>
                                    </>
                                ) : (
                                    <span>1.00 SOL</span>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-dashed border-gray-700/50 pt-4">
                            <div className="text-gray-500 text-xs mb-2">Recent Activity</div>
                            {status === 'success' ? (
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-blue-400">Tx: {txSignature?.slice(0, 6)}...</span>
                                        <span className="text-gray-500">Just now</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-400">- 0.5 SOL</span>
                                        <span className="text-gray-600">→</span>
                                        <span className="text-gray-400">Ashborn Prog...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 italic">No recent transactions</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Private View (Ashborn) */}
                <div className="bg-[#0E0E0E] border border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <div className="px-4 py-3 bg-purple-900/10 border-b border-purple-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">A</div>
                            <span className="text-xs font-medium text-purple-200">Ashborn Vault (Private)</span>
                        </div>
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">ENCRYPTED</span>
                    </div>
                    <div className="p-5 font-mono text-sm space-y-4">
                        <div>
                            <div className="text-gray-500 text-xs mb-1">Shadow Balance</div>
                            <div className="text-green-400 font-bold flex items-center gap-2">
                                {status === 'success' ? (
                                    <>
                                        <span>0.50 SOL</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400">spendable</span>
                                    </>
                                ) : (
                                    <span className="text-gray-600">0.00 SOL</span>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-dashed border-gray-800 pt-4">
                            <div className="text-gray-500 text-xs mb-2">Encrypted Notes</div>
                            {status === 'success' ? (
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <span className="text-purple-300">Note #1</span>
                                        <span className="text-green-400">+ 0.5 SOL</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 break-all">
                                        Owner: {publicKey?.toBase58().slice(0, 15)}... (Hidden)
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 italic">Vault empty</div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Code Example */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
            >
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn } from '@ashborn/sdk';

const ashborn = new Ashborn(connection, wallet);

// Shield SOL into privacy pool
const result = await ashborn.shield({
  amount: ${selectedAmount.value.toString()}n, // ${selectedAmount.display} SOL
  mint: SOL_MINT,
});

console.log('Commitment:', result.commitment);
console.log('Signature:', result.signature);`}
                    filename="shield.ts"
                />
            </motion.div>
        </div>
    );
}
