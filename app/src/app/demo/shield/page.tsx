'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield02Icon, LockIcon, CheckmarkCircle01Icon, Loading03Icon, AlertCircleIcon } from 'hugeicons-react';
import { DemoLayout, DemoButton, TxLink, PrivacyVisualizer } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'shielding' | 'complete';

export default function ShieldDemoPage() {
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();
    const [step, setStep] = useState<Step>('idle');
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [amount, setAmount] = useState('0.01');

    const resetDemo = () => {
        setStep('idle');
        setTxSignature(null);
        reset();
    };

    const runShieldDemo = async () => {
        try {
            setStatus('loading');
            setStep('shielding');

            // Call server-side API that uses the demo keypair
            const res = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', amount: parseFloat(amount) })
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Shielding failed');
            }

            setTxSignature(data.signature);
            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Shield error:', err);
            setErrorState(err instanceof Error ? err.message : 'Shielding failed');
            setStep('complete');
        }
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
                    icon: Shield02Icon,
                    badge: "Shielded Pool",
                    title: "Shield SOL",
                    description: "PrivacyCash handles the shielding. Ashborn wraps it for unified SDK access. Convert public SOL into private notes.",
                    color: "blue"
                }}
                info={{
                    icon: LockIcon,
                    title: "How Shielding Works",
                    color: "blue",
                    steps: [
                        { label: "Public SOL", color: "blue" },
                        { label: "Deposit to Pool", color: "purple" },
                        { label: "Receive Note", color: "green" }
                    ],
                    description: (
                        <div>
                            When you shield SOL, you deposit it into a shared anonymity set (smart contract).
                            You receive an encrypted <strong>Note</strong> (private receipt) that allows you to withdraw later.
                            Observers see a deposit, but cannot link it to any future withdrawal.
                        </div>
                    )
                }}
                code={`import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// PrivacyCash requires a raw Keypair (no browser wallet support)
// This is by design for maximum security - keys never leave your control
const privacyCash = new PrivacyCashOfficial({
  rpcUrl: "https://api.devnet.solana.com",
  owner: keypair, // Keypair, not wallet adapter
  programId: "ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS"
});

// Shield 0.1 SOL (Deposit into pool)
const result = await privacyCash.shieldSOL(0.1);

// Result: 0.1 sSOL note added to your private vault`}
            >
                {/* Main Action Area */}
                {isSuccess ? (
                    <div className="space-y-6">
                        <PrivacyVisualizer
                            publicView={
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">On-Chain Transaction</div>
                                    <div className="text-xs space-y-2">
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Action:</span>
                                            <span className="text-blue-300">Interact with Shield Program</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Amount:</span>
                                            <span className="text-white">{amount} SOL</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Signer:</span>
                                            <span className="text-amber-300 text-[10px] font-mono">{DEMO_WALLET.slice(0, 8)}...</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-gray-400">Program:</span>
                                            <span className="text-blue-300 text-[10px] font-mono">PrivacyCash</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Tx:</span>
                                            {txSignature && <TxLink signature={txSignature} />}
                                        </div>
                                    </div>
                                </div>
                            }
                            privateView={
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">Your Private Note</div>
                                    <div className="text-xs space-y-2">
                                        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-green-300 font-mono break-all">
                                            note_7x9... (Saved to Vault)
                                        </div>
                                        <p className="text-gray-500 italic text-[10px]">
                                            Only the keypair holder can spend this note.
                                        </p>
                                    </div>
                                </div>
                            }
                        />

                        <div className="flex justify-center">
                            <DemoButton onClick={resetDemo} icon={Shield02Icon}>
                                Shield More SOL
                            </DemoButton>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Amount to Shield (SOL)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:outline-none font-mono"
                                disabled={step !== 'idle'}
                                min="0.001"
                                step="0.01"
                            />
                        </div>

                        <DemoButton
                            onClick={runShieldDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={LockIcon}
                            variant="gradient"
                        >
                            {isLoading ? 'Shielding...' : 'Shield Funds'}
                        </DemoButton>

                        <p className="text-center text-xs text-gray-500">
                            Uses demo wallet • No wallet connection required
                        </p>
                    </div>
                )}
            </DemoLayout>
        </div>
    );
}
