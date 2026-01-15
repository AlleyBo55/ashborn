'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Bot, Send, CheckCircle, Loader2, Users, Eye, EyeOff, ArrowRight } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';

type Step = 'idle' | 'generating' | 'transferring' | 'scanning' | 'complete';

export default function AITransferDemoPage() {
    const { connected } = useWallet();
    const [step, setStep] = useState<Step>('idle');
    const [amount, setAmount] = useState('0.5');
    const [recipientPubkey, setRecipientPubkey] = useState('');
    const [txData, setTxData] = useState<{ stealthAddr?: string; decoys?: string[]; signature?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        setTxData({});
    };

    const runTransferDemo = async () => {
        if (!connected) return;

        // Step 1: Generate stealth address
        setStep('generating');
        await new Promise(r => setTimeout(r, 1500));
        setTxData({ stealthAddr: `stealth_${Math.random().toString(16).slice(2, 12)}` });

        // Step 2: Transfer with decoys
        setStep('transferring');
        await new Promise(r => setTimeout(r, 2500));
        const decoys = Array.from({ length: 3 }, () => `decoy_${Math.random().toString(16).slice(2, 10)}`);
        setTxData(prev => ({ ...prev, decoys }));

        // Step 3: Recipient scans
        setStep('scanning');
        await new Promise(r => setTimeout(r, 1500));
        setTxData(prev => ({ ...prev, signature: `tx_${Math.random().toString(16).slice(2, 16)}` }));

        setStep('complete');
    };

    const steps = [
        { id: 'generating', label: 'Generate Stealth Address', icon: Eye, desc: 'One-time address for recipient' },
        { id: 'transferring', label: 'Transfer + Decoys', icon: Users, desc: '1 real + 3 fake outputs' },
        { id: 'scanning', label: 'Recipient Scans', icon: EyeOff, desc: 'Only recipient can identify real output' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['generating', 'transferring', 'scanning'];
        const currentIdx = order.indexOf(step === 'complete' ? 'scanning' : step);
        const stepIdx = order.indexOf(stepId);
        if (step === 'complete' || stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
                    <Send className="w-4 h-4 text-purple-400" />
                    AI-to-AI Transfer
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Stealth Transfer + Decoys</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Direct agent-to-agent transfer using <strong className="text-purple-400">Stealth Addresses</strong> +
                    <strong className="text-pink-400"> Decoy Outputs</strong>. Fully untraceable.
                </p>
            </motion.div>

            {/* Concept */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    How Decoys Work
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                    The transaction creates <strong>4 identical outputs</strong> on-chain: 1 real + 3 decoys.
                    Only the recipient (with View Key) knows which is real.
                </p>
                <div className="grid grid-cols-4 gap-2 text-xs">
                    {['Output 1', 'Output 2', 'Output 3', 'Output 4'].map((o, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                            <span className="text-gray-400">{o}</span>
                            <p className="text-[10px] text-gray-600 mt-1">
                                {i === 2 ? '(Real?)' : '(Decoy?)'}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-gray-600 mt-3 text-center font-mono">
                    Observer cannot determine which output is real → Graph analysis broken
                </p>
            </motion.div>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8"
            >
                <div className="space-y-3 mb-8">
                    {steps.map((s, i) => {
                        const status = getStepStatus(s.id);
                        const Icon = s.icon;
                        return (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${status === 'complete' ? 'bg-purple-500/20 border border-purple-500/50' : ''}
                                    ${status === 'active' ? 'bg-purple-500/20 border border-purple-500/50 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-5 h-5 text-purple-400" />
                                    ) : status === 'active' ? (
                                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{s.label}</p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                                {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-700" />}
                            </div>
                        );
                    })}
                </div>

                {!connected ? (
                    <div className="text-center py-8">
                        <Send className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-gray-400">Connect wallet to simulate AI transfer.</p>
                    </div>
                ) : step === 'complete' ? (
                    <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">Transfer Complete!</h3>
                        <p className="text-gray-400 mb-4">{amount} SOL sent privately to stealth address.</p>

                        <div className="bg-[#0E0E0E] rounded-lg p-4 mb-4 border border-white/5 text-left space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Stealth Address</p>
                                <code className="text-xs text-purple-300 font-mono">{txData.stealthAddr}</code>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Decoy Outputs</p>
                                <div className="flex flex-wrap gap-1">
                                    {txData.decoys?.map((d, i) => (
                                        <code key={i} className="text-[10px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">{d}</code>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                            Run Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Recipient Pubkey</label>
                                <input type="text" value={recipientPubkey} onChange={(e) => setRecipientPubkey(e.target.value)}
                                    placeholder="Agent B's public key..."
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono placeholder:text-gray-600" disabled={step !== 'idle'} />
                            </div>
                        </div>
                        <button onClick={runTransferDemo} disabled={step !== 'idle'}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {step !== 'idle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-5 h-5" /> Simulate Stealth Transfer</>}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Code */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, ShadowWire, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

const ashborn = new Ashborn(connection, wallet);
const shadowWire = new ShadowWire(connection, wallet);

// 1. Generate one-time stealth address for recipient
const stealth = await shadowWire.generateStealthAddress(recipientPubkey);

// 2. Transfer with decoys (Monero-style)
const tx = await ashborn.shadowTransfer({
  amount: 500_000_000n,              // 0.5 SOL
  recipientStealthAddress: stealth.address,
  useDecoys: true,                    // Adds 3 fake outputs
  viaRelayer: true,                   // Hide sender IP
});

console.log("Tx:", tx.signature);
console.log("Decoys:", tx.decoyOutputs);  // 3 fake addresses

// 3. Recipient scans with View Key
const incoming = await shadowWire.scanForIncoming(viewKey);`}
                    filename="ai-transfer.ts"
                />
            </motion.div>
        </div>
    );
}
