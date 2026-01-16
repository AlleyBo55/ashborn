'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins01Icon, CreditCardIcon, CheckmarkCircle01Icon, Loading03Icon, Shield02Icon, ArrowRight01Icon, AlertCircleIcon } from 'hugeicons-react';
import { DemoLayout, DemoButton, TxLink, PrivacyVisualizer } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'shielding' | 'paying' | 'unshielding' | 'complete';

export default function AIPaymentDemoPage() {
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [step, setStep] = useState<Step>('idle');
    const [mockData, setMockData] = useState<{ amount: number; recipient: string; signature?: string } | null>(null);

    const resetDemo = () => {
        setStep('idle');
        reset();
        setMockData(null);
    };

    const runPaymentDemo = async () => {
        try {
            setStatus('loading');

            // Step 1: Shield Funds via server API
            setStep('shielding');
            const shieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', amount: 0.01 })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) {
                throw new Error(shieldData.error || 'Shield failed');
            }

            // Step 2: Private Payment (simulated in-pool transfer)
            setStep('paying');
            // In a real scenario, this would be a private transfer within the shielded pool
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 3: Merchant Unshields via server API
            setStep('unshielding');
            const unshieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unshield', amount: 0.01 })
            });
            const unshieldData = await unshieldRes.json();
            if (!unshieldData.success) {
                throw new Error(unshieldData.error || 'Unshield failed');
            }

            setMockData({
                amount: 0.01,
                recipient: 'MerchantAgent_X',
                signature: shieldData.signature
            });
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
            {/* Demo Wallet Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
                <div className="flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="text-amber-300 font-medium mb-1">Server-Side Demo Wallet</p>
                        <p className="text-amber-200/70 text-xs leading-relaxed">
                            PrivacyCash SDK requires a raw keypair for signing (no browser wallet support).
                            This demo uses a shared server-side wallet for demonstration purposes.
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-amber-400/60 text-xs">Demo Signer:</span>
                            <code className="text-amber-300 text-xs font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                                {DEMO_WALLET}
                            </code>
                        </div>
                    </div>
                </div>
            </motion.div>

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

// PrivacyCash requires a raw Keypair (designed for AI agents)
// Keys stay on your server, never exposed to clients
const privacyCash = new PrivacyCashOfficial({
  rpcUrl: process.env.RPC_URL,
  owner: agentKeypair, // Server-side keypair
});

// 1. Shield funds into private pool
await privacyCash.shieldSOL(0.05);

// 2. Perform Private Transfer (within Shielded Pool)
// No on-chain trace of sender or receiver addresses
const txId = await privacyCash.transfer({
  amount: 0.05,
  recipient: merchantShieldedAddress,
});

// 3. Merchant Unshields (Optional)
await privacyCash.unshieldSOL(0.05, merchantPublicAddress);`}
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
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Recipient:</span>
                                            <span className="text-gray-500 italic">Unknown (Shielded)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Signer:</span>
                                            <span className="text-amber-300 text-[10px] font-mono">{DEMO_WALLET.slice(0, 8)}...</span>
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
                                            <span className="text-white">0.01 sSOL</span>
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
                    <div className="text-center space-y-4">
                        <DemoButton
                            onClick={runPaymentDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={CreditCardIcon}
                            variant="gradient"
                        >
                            {isLoading ? 'Processing...' : 'Send Agent Payment (0.01 SOL)'}
                        </DemoButton>

                        <p className="text-xs text-gray-500">
                            Uses demo wallet • No wallet connection required
                        </p>
                    </div>
                )}
            </DemoLayout>
        </div>
    );
}
