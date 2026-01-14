'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, AlertCircle, Users } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';

type DemoStatus = 'idle' | 'confirming' | 'processing' | 'success' | 'error';

export default function TransferDemoPage() {
    const { connected, publicKey } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('0.5');
    const [status, setStatus] = useState<DemoStatus>('idle');
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [decoys, setDecoys] = useState<string[]>([]);

    const handleTransfer = async () => {
        if (!connected || !publicKey || !recipient) return;

        setStatus('confirming');
        setError(null);

        try {
            setStatus('processing');
            await new Promise(resolve => setTimeout(resolve, 2500));
            const fakeDecoys = Array.from({ length: 3 }, () => Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
            setDecoys(fakeDecoys);
            const fakeSignature = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
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
        setDecoys([]);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-300 px-4 py-2 rounded-full text-sm mb-6 border border-green-500/20">
                    <Send className="w-4 h-4" />
                    Interactive Demo
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Shadow Transfer</h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Send privately to a stealth address. Includes 3 decoy outputs to break graph analysis.
                </p>
            </motion.div>

            {/* What is Shadow Transfer? */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-green-400" />
                    What is Shadow Transfer?
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    Shadow Transfer sends your shielded assets to a <strong className="text-white">stealth address</strong> (one-time address).
                    The transaction includes <strong className="text-green-300">3 decoy outputs</strong> making it mathematically impossible to determine which output is real.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30">1. Enter Recipient</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/30">2. Generate Decoys</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/30">3. Nullify Old Note</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30">4. Create New Note</span>
                </div>
                <p className="text-[10px] text-gray-600 mt-3 font-mono">
                    Real output + 3 Decoys = 4 identical-looking outputs → Graph analysis broken
                </p>
            </motion.div>

            {/* Main Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                {!connected ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Send className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-gray-400 mb-6 font-light">Connect a Solana wallet to try the transfer demo.</p>
                        <div className="text-sm text-green-300/70 animate-pulse">(Use button in top right)</div>
                    </div>
                ) : status === 'success' ? (
                    <div className="text-center py-8">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Transfer Complete!</h3>
                        <p className="text-gray-400 mb-6">{amount} SOL sent privately with 3 decoy outputs.</p>

                        <div className="bg-[#0E0E0E] rounded-xl p-5 mb-6 text-left border border-white/5 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                <Users className="w-4 h-4" />
                                On-Chain Outputs (1 Real + 3 Decoys)
                            </div>
                            <div className="space-y-2">
                                {[...decoys, 'REAL_OUTPUT'].map((output, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`flex items-center gap-3 p-2.5 rounded-lg border ${i === 3 ? 'bg-green-900/10 border-green-500/30' : 'bg-white/5 border-white/5'}`}>
                                        <span className="text-[10px] text-gray-500 font-mono w-4">{i + 1}</span>
                                        <code className="text-xs font-mono text-gray-300 truncate flex-1 opacity-80">
                                            {output === 'REAL_OUTPUT' ? 'ENCRYPTED_PAYLOAD_XXXXXXXXXXXXXXXXXXXXXXXX' : output}
                                        </code>
                                        {i === 3 && <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">You</span>}
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 italic mt-2 border-t border-white/5 pt-2">
                                * To an outside observer, all 4 outputs look identical. Only the recipient with the View Key can identify and spend the real output.
                            </p>
                        </div>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition font-medium">Try Again</button>
                    </div>
                ) : status === 'error' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-red-400" /></div>
                        <h3 className="text-xl font-semibold mb-2 text-red-400">Transfer Failed</h3>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">Try Again</button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Recipient Stealth Address</label>
                                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Paste stealth address or pubkey..." className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 focus:outline-none transition placeholder:text-gray-600 font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Amount (SOL)</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.1" min="0.1" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 focus:outline-none transition font-mono" />
                            </div>
                        </div>
                        <button onClick={handleTransfer} disabled={status === 'processing' || status === 'confirming' || !recipient} className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {status === 'processing' || status === 'confirming' ? <><Loader2 className="w-5 h-5 animate-spin" /> {status === 'confirming' ? 'Check Wallet...' : 'Mixing Outputs...'}</> : <><Send className="w-5 h-5" /> Send Privately</>}
                        </button>
                        <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                            <p className="text-xs text-yellow-200/60"><strong>Note:</strong> Requires ~0.005 SOL for rent assurance of decoy accounts.</p>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Code Snippet */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, createRelayer } from '@alleyboss/ashborn-sdk';

const ashborn = new Ashborn(connection, wallet);

// Private transfer with decoys
await ashborn.shadowTransfer({
  amount: ${parseFloat(amount) * 1_000_000_000}n,
  recipientStealthAddress: '${recipient || '<stealth_address>'}',
  useDecoys: true,  // Adds 3 fake outputs for graph obfuscation
  viaRelayer: true, // Hides sender IP/Wallet
});`}
                    filename="transfer.ts"
                />
            </motion.div>
        </div>
    );
}
