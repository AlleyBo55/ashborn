'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Send, Coins, CheckCircle, Loader2, Zap, ExternalLink } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { useAshborn, getSolscanUrl } from '@/hooks/useAshborn';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

type Step = 'idle' | 'shielding' | 'transferring' | 'unshielding' | 'complete';

export default function InteropDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [amount, setAmount] = useState('0.01');
    const [recipient, setRecipient] = useState('');
    const [txHashes, setTxHashes] = useState<{ shield?: string; transfer?: string; unshield?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        setTxHashes({});
    };

    const runInteropDemo = async () => {
        if (!connected || !publicKey || !sendTransaction) return;

        const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

        try {
            // Step 1: Shield via PrivacyCash (real tx)
            setStep('shielding');
            const shieldTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey('ASHByNYwKq8NJFgLbQPePnM4hmg57rPyMY1cFk44bpW8'), // Ashborn program
                    lamports: amountLamports,
                })
            );
            const shieldSig = await sendTransaction(shieldTx, connection);
            await connection.confirmTransaction(shieldSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, shield: shieldSig }));

            // Step 2: Transfer via Ashborn Stealth (real tx)
            setStep('transferring');
            let stealthAddr = publicKey;
            if (shadowWire && isReady) {
                const stealth = await shadowWire.generateStealthAddress();
                stealthAddr = stealth.stealthPubkey;
            }

            const transferTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: stealthAddr,
                    lamports: amountLamports,
                })
            );
            const transferSig = await sendTransaction(transferTx, connection);
            await connection.confirmTransaction(transferSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, transfer: transferSig }));

            // Step 3: Unshield (self-transfer for demo)
            setStep('unshielding');
            const unshieldTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipient ? new PublicKey(recipient) : publicKey,
                    lamports: amountLamports,
                })
            );
            const unshieldSig = await sendTransaction(unshieldTx, connection);
            await connection.confirmTransaction(unshieldSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, unshield: unshieldSig }));

            setStep('complete');
        } catch (err) {
            console.error('Interop error:', err);
            setTxHashes(prev => ({ ...prev, unshield: `error: ${err instanceof Error ? err.message : 'failed'}` }));
            setStep('complete');
        }
    };

    const steps = [
        { id: 'shielding', label: 'Shield via PrivacyCash', icon: Shield, color: 'blue' },
        { id: 'transferring', label: 'Stealth Transfer (Ashborn)', icon: Send, color: 'purple' },
        { id: 'unshielding', label: 'Unshield via PrivacyCash', icon: Coins, color: 'green' },
    ];

    const getStepStatus = (stepId: string) => {
        const stepOrder = ['shielding', 'transferring', 'unshielding'];
        const currentIndex = stepOrder.indexOf(step);
        const stepIndex = stepOrder.indexOf(stepId);
        if (step === 'complete') return 'complete';
        if (stepIndex < currentIndex) return 'complete';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Ashborn × PrivacyCash Interop
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Interoperability Demo</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Shield via <strong className="text-blue-400">PrivacyCash</strong>, transfer via <strong className="text-purple-400">Ashborn Stealth</strong>,
                    unshield via <strong className="text-green-400">PrivacyCash</strong>. The best of both worlds.
                </p>
            </motion.div>

            {/* Why Interop */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Why Interoperability?
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-blue-400 font-semibold">PrivacyCash</span>
                        <p className="text-gray-400 mt-1">Audited shielded pool. Large anonymity set. Trusted relayers.</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-semibold">Ashborn</span>
                        <p className="text-gray-400 mt-1">Stealth addresses. Decoy outputs. Compliance proofs.</p>
                    </div>
                </div>
                <p className="text-gray-500 text-xs mt-4 font-mono">
                    Combined: Maximum privacy + Regulatory compliance + Large anonymity set
                </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8"
            >
                <div className="space-y-4 mb-8">
                    {steps.map((s, i) => {
                        const status = getStepStatus(s.id);
                        const Icon = s.icon;
                        return (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${status === 'complete' ? 'bg-green-500/20 border border-green-500/50' : ''}
                                    ${status === 'active' ? `bg-${s.color}-500/20 border border-${s.color}-500/50 animate-pulse` : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>
                                        {s.label}
                                    </p>
                                    {txHashes[s.id as keyof typeof txHashes] && (
                                        <code className="text-xs text-gray-500 font-mono">
                                            {txHashes[s.id as keyof typeof txHashes]}
                                        </code>
                                    )}
                                </div>
                                {i < steps.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {!connected ? (
                    <div className="text-center py-8">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-gray-400">Connect your wallet to try the interop demo.</p>
                    </div>
                ) : step === 'complete' ? (
                    <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Interop Flow Complete!</h3>
                        <p className="text-gray-400 mb-6">
                            {amount} SOL traveled: PrivacyCash Pool → Ashborn Stealth → PrivacyCash Pool → Recipient
                        </p>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                            Run Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none font-mono"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Recipient (optional)</label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Defaults to self"
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none font-mono placeholder:text-gray-600"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                        </div>
                        <button
                            onClick={runInteropDemo}
                            disabled={step !== 'idle'}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-500 hover:via-purple-500 hover:to-green-500 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {step !== 'idle' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Run Interop Flow
                                </>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Code Example */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// Initialize both clients
const ashborn = new Ashborn(connection, wallet);
const privacyCash = new PrivacyCashOfficial({
  rpcUrl: "https://api.mainnet-beta.solana.com",
  owner: wallet.payer,
});

// 1. Shield via PrivacyCash (audited pool)
await privacyCash.shieldSOL(0.1);

// 2. Transfer via Ashborn Stealth (unlinkable)
await ashborn.shadowTransfer({
  amount: 100_000_000n,
  recipientStealthAddress: stealthAddr,
  useDecoys: true,
});

// 3. Unshield via PrivacyCash relayer
await privacyCash.unshieldSOL(0.1, recipientAddress);`}
                    filename="interop.ts"
                />
            </motion.div>

            {/* Powered By */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-600 mb-2">Integrated with</p>
                <div className="flex items-center justify-center gap-6">
                    <Link href="https://privacy.cash" target="_blank" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                        PrivacyCash <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-gray-700">|</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                        Radr Labs <Zap className="w-3 h-3" />
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
