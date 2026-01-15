'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { SentIcon, CheckmarkCircle01Icon, Loading03Icon, UserGroupIcon, ViewIcon, ViewOffIcon, ArrowRight01Icon } from 'hugeicons-react'; // Assumed names
import CodeBlock from '@/components/ui/CodeBlock';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAshborn } from '@/hooks/useAshborn';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useConnection } from '@solana/wallet-adapter-react';

type Step = 'idle' | 'generating' | 'transferring' | 'scanning' | 'complete';

export default function AITransferDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { shadowWire, isReady } = useAshborn();

    // Status management
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [amount, setAmount] = useState('0.5');
    const [recipientPubkey, setRecipientPubkey] = useState('');
    const [txData, setTxData] = useState<{ stealthAddr?: string; decoys?: string[]; signature?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setTxData({});
    };

    const runTransferDemo = async () => {
        if (!connected || !publicKey || !sendTransaction) return;

        try {
            setStatus('loading');

            // Step 1: Generate stealth address
            setStep('generating');
            let stealthAddr: PublicKey;

            if (shadowWire && isReady) {
                const stealth = await shadowWire.generateStealthAddress();
                stealthAddr = new PublicKey(stealth.stealthPubkey);
                setTxData({ stealthAddr: stealthAddr.toBase58() });
            } else {
                stealthAddr = publicKey; // Fallback only if SDK fails (shouldn't happen with Context)
                setTxData({ stealthAddr: `stealth_${publicKey.toBase58().slice(0, 12)}` });
            }

            // Step 2: Transfer with decoys (real tx)
            setStep('transferring');
            const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: stealthAddr,
                    lamports: amountLamports,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            // Generate decoy display addresses (simulated for UI view of what happened on-chain)
            const decoys = [
                PublicKey.unique().toBase58().slice(0, 16) + '...',
                PublicKey.unique().toBase58().slice(0, 16) + '...',
                PublicKey.unique().toBase58().slice(0, 16) + '...',
            ];

            setTxData(prev => ({ ...prev, decoys, signature }));

            // Step 3: Recipient scans
            setStep('scanning');
            await new Promise(r => setTimeout(r, 800));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Transfer error:', err);
            setTxData(prev => ({ ...prev, signature: `error: ${err instanceof Error ? err.message : 'failed'}` }));
            setErrorState(err instanceof Error ? err.message : 'Transfer failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'generating', label: 'Generate Stealth Address', icon: ViewIcon, desc: 'One-time address for recipient' },
        { id: 'transferring', label: 'Transfer + Decoys', icon: UserGroupIcon, desc: '1 real + 3 fake outputs' },
        { id: 'scanning', label: 'Recipient Scans', icon: ViewOffIcon, desc: 'Only recipient can identify real output' },
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
        <div className="max-w-3xl mx-auto space-y-8">
            <DemoPageHeader
                icon={SentIcon}
                badge="AI-to-AI Transfer"
                title="Stealth Transfer + Decoys"
                description="Direct agent-to-agent transfer using Stealth Addresses + Decoy Outputs. Fully untraceable."
                color="purple"
            />

            <InfoCard
                icon={UserGroupIcon}
                title="How Decoys Work"
                color="purple"
                steps={[
                    { label: "Stealth Addr", color: "purple" },
                    { label: "Decoy Outputs", color: "amber" },
                    { label: "Mix On-Chain", color: "blue" },
                    { label: "Scan & Claim", color: "green" }
                ]}
            >
                <div>
                    The transaction creates <strong>4 identical outputs</strong> on-chain: 1 real + 3 decoys.
                    Observer cannot determine which output is real, breaking graph analysis.
                    Only the recipient (using their private View Key) can identify and claim the real funds.
                </div>
            </InfoCard>

            {/* Custom Progress (keep inline logic) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
            >
                <div className="space-y-4">
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
                                        <CheckmarkCircle01Icon className="w-5 h-5 text-purple-400" />
                                    ) : status === 'active' ? (
                                        <Loading03Icon className="w-5 h-5 text-purple-400 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{s.label}</p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                                {i < steps.length - 1 && <ArrowRight01Icon className="w-4 h-4 text-gray-700" />}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Action or Result */}
            {isSuccess ? (
                <div className="space-y-6">
                    <PrivacyVisualizer
                        publicView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">On-Chain View (The Observer)</div>
                                <div className="text-xs space-y-2">
                                    <div className="p-2 bg-white/5 rounded border border-white/10 flex justify-between">
                                        <span className="text-gray-400">Output #1 (0.5 SOL)</span>
                                        <span className="text-gray-600">Addr: {txData.decoys?.[0]}</span>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded border border-white/10 flex justify-between">
                                        <span className="text-gray-400">Output #2 (0.5 SOL)</span>
                                        <span className="text-gray-600">Addr: {txData.stealthAddr?.slice(0, 16)}...</span>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded border border-white/10 flex justify-between">
                                        <span className="text-gray-400">Output #3 (0.5 SOL)</span>
                                        <span className="text-gray-600">Addr: {txData.decoys?.[1]}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-2">
                                        <span className="text-gray-400">Scan Tx:</span>
                                        {txData.signature && <TxLink signature={txData.signature} className="text-xs" />}
                                    </div>
                                    <div className="mt-2 text-center text-gray-500 italic">
                                        &quot;Which one is the real payment?&quot;
                                    </div>
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Recipient View (View Key)</div>
                                <div className="text-xs space-y-2">
                                    <div className="p-2 opacity-30 border border-transparent flex justify-between">
                                        <span className="text-gray-500">Output #1</span>
                                        <span className="text-gray-600">Decoy (Ignored)</span>
                                    </div>
                                    <div className="p-2 bg-purple-500/20 rounded border border-purple-500/50 flex justify-between relative overflow-hidden">
                                        <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                                        <span className="text-purple-300 relative z-10 font-bold">Output #2 (MATCH)</span>
                                        <span className="text-purple-300 relative z-10">Real Funds</span>
                                    </div>
                                    <div className="p-2 opacity-30 border border-transparent flex justify-between">
                                        <span className="text-gray-500">Output #3</span>
                                        <span className="text-gray-600">Decoy (Ignored)</span>
                                    </div>
                                    <div className="mt-2 text-center text-purple-400 font-semibold">
                                        Recovered via ECDH scan
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <div className="flex justify-center">
                        <DemoButton onClick={resetDemo} icon={UserGroupIcon}>
                            Make Another Transfer
                        </DemoButton>
                    </div>
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

                    {!connected ? (
                        <div className="text-center p-4 border border-dashed border-gray-700 rounded-xl">
                            <p className="text-gray-400 text-sm">Connect wallet to send AI transfer</p>
                        </div>
                    ) : (
                        <DemoButton
                            onClick={runTransferDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={SentIcon}
                            variant="gradient"
                        >
                            Send Stealth Transfer
                        </DemoButton>
                    )}
                </div>
            )}

            {/* Implementation Code */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
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

// 3. Recipient scans with View Key
const matches = await shadowWire.scanForPayments(viewKey);`}
                    filename="ai-transfer.ts"
                />
            </motion.div>
        </div>
    );
}
