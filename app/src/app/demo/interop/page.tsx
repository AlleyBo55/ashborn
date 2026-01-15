'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ArrowRight01Icon, Shield02Icon, SentIcon, Coins01Icon, CheckmarkCircle01Icon, Loading03Icon, FlashIcon, LinkSquare02Icon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';

type Step = 'idle' | 'shielding' | 'transferring' | 'unshielding' | 'complete';

export default function InteropDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { shadowWire, privacyCash, isReady } = useAshborn();

    // Status
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [amount, setAmount] = useState('0.01');
    const [recipient, setRecipient] = useState('');
    const [txHashes, setTxHashes] = useState<{ shield?: string; transfer?: string; unshield?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setTxHashes({});
    };

    const runInteropDemo = async () => {
        if (!connected || !publicKey || !sendTransaction) {
            console.log('Not ready:', { connected, publicKey: !!publicKey, sendTransaction: !!sendTransaction });
            return;
        }

        console.log('Starting interop demo...');

        try {
            setStatus('loading');
            const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
            const recipientPubkey = recipient ? new PublicKey(recipient) : publicKey;

            // Step 1: Shield (to self - simulates pool deposit)
            setStep('shielding');
            const tx1 = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey,
                    lamports: amountLamports,
                })
            );
            const shieldSig = await sendTransaction(tx1, connection);
            await connection.confirmTransaction(shieldSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, shield: shieldSig }));

            // Step 2: Stealth Transfer (to generated stealth address)
            setStep('transferring');
            const stealth = await shadowWire.generateStealthAddress();
            const tx2 = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: stealth.stealthPubkey,
                    lamports: amountLamports,
                })
            );
            const transferSig = await sendTransaction(tx2, connection);
            await connection.confirmTransaction(transferSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, transfer: transferSig }));

            // Step 3: Unshield (to final recipient)
            setStep('unshielding');
            const tx3 = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey,
                    lamports: amountLamports,
                })
            );
            const unshieldSig = await sendTransaction(tx3, connection);
            await connection.confirmTransaction(unshieldSig, 'confirmed');
            setTxHashes(prev => ({ ...prev, unshield: unshieldSig }));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Interop error:', err);
            setErrorState(err instanceof Error ? err.message : 'failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'shielding', label: 'Shield via PrivacyCash', icon: Shield02Icon, color: 'blue' },
        { id: 'transferring', label: 'Stealth Transfer (Ashborn)', icon: SentIcon, color: 'purple' },
        { id: 'unshielding', label: 'Unshield via PrivacyCash', icon: Coins01Icon, color: 'green' },
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
        <div className="max-w-3xl mx-auto space-y-8">
            <DemoPageHeader
                icon={FlashIcon}
                badge="Ashborn × PrivacyCash Interop"
                title="Interoperability Demo"
                description="Shield via PrivacyCash, transfer via Ashborn Stealth, unshield via PrivacyCash. The best of both worlds."
                color="amber"
            />

            <InfoCard
                icon={FlashIcon}
                title="Why Interoperability?"
                color="amber"
                steps={[
                    { label: "Shield (Pool)", color: "blue" },
                    { label: "Stealth (Transfer)", color: "purple" },
                    { label: "Unshield (Relay)", color: "green" }
                ]}
            >
                <div>
                    <strong>PrivacyCash</strong> provides a large anonymity set (Shielded Pool).
                    <strong>Ashborn</strong> provides unlinkable addressing (Stealth Addresses).
                    Combined: Maximum privacy + Regulatory compliance + Large anonymity set.
                </div>
            </InfoCard>

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
                                    ${status === 'complete' ? 'bg-green-500/20 border border-green-500/50' : ''}
                                    ${status === 'active' ? 'bg-amber-500/20 border border-amber-500/50 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckmarkCircle01Icon className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loading03Icon className="w-5 h-5 text-amber-400 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>
                                        {s.label}
                                    </p>
                                    {txHashes[s.id as keyof typeof txHashes] && (
                                        <div className="mt-1">
                                            <TxLink signature={txHashes[s.id as keyof typeof txHashes]!} label={txHashes[s.id as keyof typeof txHashes]?.slice(0, 8) + '...'} className="text-xs" />
                                        </div>
                                    )}
                                </div>
                                {i < steps.length - 1 && (
                                    <ArrowRight01Icon className="w-4 h-4 text-gray-600" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {isSuccess ? (
                <div className="space-y-6">
                    <PrivacyVisualizer
                        publicView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Public Ledger</div>
                                <div className="text-xs space-y-2">
                                    {txHashes.shield && <TxLink signature={txHashes.shield} label="Shield Tx (PrivacyCash)" />}
                                    {txHashes.transfer && <TxLink signature={txHashes.transfer} label="Stealth Tx (Ashborn)" />}
                                    {txHashes.unshield && <TxLink signature={txHashes.unshield} label="Unshield Tx (PrivacyCash)" />}

                                    <div className="mt-2 text-center text-gray-500 italic border-t border-white/5 pt-2">
                                        &quot;Looks like unrelated transactions&quot;
                                    </div>
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Private Flow (Simulated)</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex items-center gap-2 text-blue-300">
                                        <Shield02Icon className="w-3 h-3" /> Shielded {amount} SOL → PrivacyCash Pool
                                    </div>
                                    <div className="flex justify-center text-gray-600">↓</div>
                                    <div className="flex items-center gap-2 text-purple-300 bg-purple-500/10 p-1 rounded">
                                        <SentIcon className="w-3 h-3" /> Stealth Transfer → Unlinkable Address
                                    </div>
                                    <div className="flex justify-center text-gray-600">↓</div>
                                    <div className="flex items-center gap-2 text-green-300">
                                        <Coins01Icon className="w-3 h-3" /> Unshielded → {recipient || 'Self'}
                                    </div>
                                    <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300 text-[10px]">
                                        ⚠️ Demo simulation: Real PrivacyCash requires mainnet. Stealth addresses are real (step 2).
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <div className="flex justify-center">
                        <DemoButton onClick={resetDemo} icon={FlashIcon}>
                            Run Again
                        </DemoButton>
                    </div>
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {!connected ? (
                        <div className="text-center p-4 border border-dashed border-gray-700 rounded-xl">
                            <p className="text-gray-400 text-sm">Connect wallet to execute interop flow</p>
                        </div>
                    ) : (
                        <DemoButton
                            onClick={runInteropDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={FlashIcon}
                            variant="gradient"
                        >
                            Run Interop Flow
                        </DemoButton>
                    )}
                </div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { ShadowWire, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// 1. Shield: Deposit to PrivacyCash pool
const shieldResult = await privacyCash.shieldSOL(0.1);

// 2. Generate stealth address for recipient
const stealth = await shadowWire.generateStealthAddress();

// 3. Send to stealth address (unlinkable)
await sendTransaction(transfer(stealth.stealthPubkey, amount));

// 4. Unshield: Withdraw from pool to final recipient
const unshieldResult = await privacyCash.unshieldSOL(0.1, recipient);`}
                    filename="interop.ts"
                />
            </motion.div>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
                <p className="text-xs text-gray-600 mb-2">Easy Integration with</p>
                <div className="flex items-center justify-center gap-6">
                    <Link href="https://privacy.cash" target="_blank" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                        PrivacyCash <LinkSquare02Icon className="w-3 h-3" />
                    </Link>
                    <span className="text-gray-700">|</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                        Radr Labs <FlashIcon className="w-3 h-3" />
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
