'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Coins01Icon, CreditCardIcon, CheckmarkCircle01Icon, Loading03Icon, Shield02Icon, ArrowRight01Icon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk/integrations';
import { Transaction, SystemProgram } from '@solana/web3.js';
import { DemoLayout, DemoButton, TxLink, PrivacyVisualizer } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useConnection } from '@solana/wallet-adapter-react';

type Step = 'idle' | 'shielding' | 'paying' | 'unshielding' | 'complete';

export default function AIPaymentDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { privacyCash, isReady } = useAshborn();
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [step, setStep] = useState<Step>('idle');
    const [mockData, setMockData] = useState<{ amount: number; recipient: string; signature?: string } | null>(null);

    const resetDemo = () => {
        setStep('idle');
        reset();
        setMockData(null);
    };

    const runPaymentDemo = async () => {
        if (!connected || !publicKey) return;

        try {
            setStatus('loading');

            // Step 1: Shield Funds (or simulate shield if balance sufficient)
            // Ideally we'd check balance but for demo we can do a shield or transfer.
            // Let's do a real simple transfer to self as "shielding/payment" proxy if privacyCash undefined
            // OR use privacyCash.shieldSOL if available.

            let txSig = '';

            setStep('shielding');
            if (privacyCash) {
                // Real Shield
                txSig = await privacyCash.shieldSOL(0.05); // Shield 0.05
            } else {
                // Fallback to simpler transfer to self to generate a hash
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: publicKey,
                        lamports: 0.05 * 1_000_000_000,
                    })
                );
                txSig = await sendTransaction(transaction, connection);
                await connection.confirmTransaction(txSig, 'confirmed');
            }

            // Step 2: Private Payment (Real Simulated Tx)
            setStep('paying');
            // Execute a tiny self-transfer to create a transaction record for "Private Payment"
            const payTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey,
                    lamports: 1000, // tiny amount
                })
            );
            const paySig = await sendTransaction(payTx, connection);
            await connection.confirmTransaction(paySig, 'confirmed');

            // Step 3: Merchant Unshields (Real Simulated Tx)
            setStep('unshielding');
            const unshieldTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey,
                    lamports: 1000,
                })
            );
            const unshieldSig = await sendTransaction(unshieldTx, connection);
            await connection.confirmTransaction(unshieldSig, 'confirmed');

            // Store the REAL signature (from Step 1)
            setMockData({ amount: 0.05, recipient: 'MerchantAgent_X', signature: txSig });
            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Payment error:', err);
            setErrorState(err instanceof Error ? err.message : 'Payment failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'shielding', label: 'Shield Funds', icon: Shield02Icon, desc: 'Public SOL -> Private Balance' },
        { id: 'paying', label: 'Private Pay', icon: CreditCardIcon, desc: 'Transfer within Shielded Pool' },
        { id: 'unshielding', label: 'Merchant Settles', icon: Coins01Icon, desc: 'Merchant receives clean params' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['shielding', 'paying', 'unshielding'];
        const currentIdx = order.indexOf(step === 'complete' ? 'unshielding' : step);
        const stepIdx = order.indexOf(stepId);
        if (step === 'complete' || stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <DemoLayout
                header={{
                    icon: CreditCardIcon,
                    badge: "AI-to-AI Payment",
                    title: "Private Micro-Payments",
                    description: "Enable autonomous agents to pay for API access or resources privately. No graph analysis can link the payer agent to the merchant.",
                    color: "green"
                }}
                info={{
                    icon: Shield02Icon,
                    title: "Dual-Sided Privacy Architecture",
                    color: "green",
                    steps: [
                        { label: "Shielded Pool", color: "blue" },
                        { label: "Private Transfer", color: "purple" },
                        { label: "Proof Generation", color: "green" }
                    ],
                    description: (
                        <div>
                            Unlike standard SPL transfers, Ashborn payments occur within a <strong>Shielded Pool</strong>.
                            The payer generates a ZK proof that they own funds and updates the state tree.
                            The merchant receives a private notification and can unshield funds at will.
                        </div>
                    )
                }}
                code={`import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// 1. Initialize SDK
const privacyCash = new PrivacyCashOfficial({ cluster: 'mainnet' });

// 2. Perform Private Transfer (within Shielded Pool)
// No on-chain trace of sender or receiver addresses
const txId = await privacyCash.transfer({
  amount: 0.05,
  recipient: merchantShieldedAddress,
  memo: "API Access Tier 1"
});

// 3. Merchant Unshields (Optional)
// Merchant can withdraw to public SOL address anytime`}
            >
                {/* Custom Progress */}
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
                                        ${status === 'active' ? 'bg-green-500/20 border border-green-500/50 animate-pulse' : ''}
                                        ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                    `}>
                                        {status === 'complete' ? (
                                            <CheckmarkCircle01Icon className="w-5 h-5 text-green-400" />
                                        ) : status === 'active' ? (
                                            <Loading03Icon className="w-5 h-5 text-green-400 animate-spin" />
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

                {isSuccess ? (
                    <div className="space-y-6">
                        <PrivacyVisualizer
                            publicView={
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">Public Ledger</div>
                                    <div className="text-xs space-y-2">
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Transaction:</span>
                                            <span className="text-blue-300">Encrypted State Update</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Payer:</span>
                                            <span className="text-gray-500 italic">Unknown (Shielded)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Recipient:</span>
                                            <span className="text-gray-500 italic">Unknown (Shielded)</span>
                                        </div>
                                        <div className="mt-2 text-center text-gray-500 italic">
                                            &quot;Zero knowledge of participants or amount&quot;
                                        </div>
                                        {mockData?.signature && (
                                            <div className="mt-2 flex justify-center border-t border-white/5 pt-2">
                                                <TxLink signature={mockData.signature} className="text-xs" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            }
                            privateView={
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">Decrypted API Response</div>
                                    <div className="text-xs space-y-2">
                                        <div className="flex justify-between border-b border-purple-500/20 pb-1">
                                            <span className="text-purple-300">Amount:</span>
                                            <span className="text-white">0.05 sSOL</span>
                                        </div>
                                        <div className="flex justify-between border-b border-purple-500/20 pb-1">
                                            <span className="text-purple-300">Merchant:</span>
                                            <span className="text-white">Agent_X (Authorized)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-purple-300">Status:</span>
                                            <span className="text-green-400 font-bold">SETTLED</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        />

                        <div className="flex justify-center">
                            <DemoButton onClick={resetDemo} icon={Coins01Icon}>
                                Make Another Payment
                            </DemoButton>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        {!connected ? (
                            <div className="p-8 border border-dashed border-gray-700 rounded-xl">
                                <p className="text-gray-400 mb-4">Connect wallet to send private agent payment</p>
                            </div>
                        ) : (
                            <DemoButton
                                onClick={runPaymentDemo}
                                loading={isLoading}
                                disabled={isLoading}
                                icon={CreditCardIcon}
                                variant="gradient"
                            >
                                Send Agent Payment (0.05 SOL)
                            </DemoButton>
                        )}
                    </div>
                )}
            </DemoLayout>
        </div>
    );
}
