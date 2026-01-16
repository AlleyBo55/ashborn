'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight01Icon, Shield02Icon, SentIcon, Coins01Icon, CheckmarkCircle01Icon, Loading03Icon, FlashIcon, LinkSquare02Icon, AlertCircleIcon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import Link from 'next/link';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'shielding' | 'transferring' | 'unshielding' | 'complete';

export default function InteropDemoPage() {
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [amount, setAmount] = useState('0.01');
    const [txHashes, setTxHashes] = useState<{ shield?: string; transfer?: string; unshield?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setTxHashes({});
    };

    const runInteropDemo = async () => {
        try {
            setStatus('loading');

            // Step 1: Shield via /api/ashborn
            setStep('shielding');
            const shieldRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', params: { amount: parseFloat(amount) } })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) throw new Error(shieldData.error || 'Shield failed');
            setTxHashes(prev => ({ ...prev, shield: shieldData.signature }));

            // Step 2: Generate Stealth Address via /api/ashborn
            setStep('transferring');
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth failed');
            setTxHashes(prev => ({ ...prev, transfer: stealthData.stealthAddress }));

            // Step 3: Unshield via /api/ashborn
            setStep('unshielding');
            const unshieldRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unshield', params: { amount: parseFloat(amount), recipient: DEMO_WALLET } })
            });
            const unshieldData = await unshieldRes.json();
            if (!unshieldData.success) throw new Error(unshieldData.error || 'Unshield failed');
            setTxHashes(prev => ({ ...prev, unshield: unshieldData.signature }));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Interop error:', err);
            setErrorState(err instanceof Error ? err.message : 'failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'shielding', label: 'Shield to PrivacyCash Pool', icon: Shield02Icon, color: 'blue' },
        { id: 'transferring', label: 'Generate Stealth Address', icon: SentIcon, color: 'purple' },
        { id: 'unshielding', label: 'Unshield to Recipient', icon: Coins01Icon, color: 'green' },
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
            {/* Demo Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
                <div className="flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="text-amber-300 font-medium mb-1">Server-Side Demo</p>
                        <p className="text-amber-200/70 text-xs">All operations run via /api/ashborn. No wallet required.</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                icon={FlashIcon}
                badge="Privacy Relay"
                title="PrivacyCash × Ashborn Interop"
                description="Full privacy flow via Ashborn Relay. Shield, stealth transfer, unshield — protocols never see your identity."
                color="amber"
                privacyRelay
            />

            <InfoCard
                icon={FlashIcon}
                title="Real Privacy Flow"
                color="amber"
                steps={[
                    { label: "Shield (API)", color: "blue" },
                    { label: "Stealth (API)", color: "purple" },
                    { label: "Unshield (API)", color: "green" }
                ]}
            >
                <div>
                    All steps run server-side via <code className="text-amber-300">/api/ashborn</code>.
                    No SDK loaded client-side = instant page load.
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
                                            <TxLink signature={txHashes[s.id as keyof typeof txHashes]!} label={txHashes[s.id as keyof typeof txHashes]?.slice(0, 12) + '...'} className="text-xs" />
                                        </div>
                                    )}
                                </div>
                                {i < steps.length - 1 && <ArrowRight01Icon className="w-4 h-4 text-gray-600" />}
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
                                    {txHashes.shield && <TxLink signature={txHashes.shield} label="Shield Tx ✓" />}
                                    {txHashes.transfer && <div className="text-purple-300">Stealth: {txHashes.transfer.slice(0, 12)}... ✓</div>}
                                    {txHashes.unshield && <TxLink signature={txHashes.unshield} label="Unshield Tx ✓" />}
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Private Flow</div>
                                <div className="text-xs space-y-2">
                                    <div className="text-blue-300">Shielded {amount} SOL → Pool</div>
                                    <div className="text-purple-300">Stealth Transfer → Unlinkable</div>
                                    <div className="text-green-300">Unshielded → Demo Wallet</div>
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
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono"
                            disabled={isLoading}
                        />
                    </div>

                    <DemoButton
                        onClick={runInteropDemo}
                        loading={isLoading}
                        disabled={isLoading}
                        icon={FlashIcon}
                        variant="gradient"
                    >
                        Run Privacy Flow
                    </DemoButton>

                    <p className="text-center text-xs text-gray-500">
                        Server-side API • No wallet required
                    </p>
                </div>
            )}

            <CodeBlock
                language="typescript"
                code={`// All operations via /api/ashborn
await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'shield', params: { amount: 0.01 } })
});

await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'stealth', params: { recipient } })
});

await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'unshield', params: { amount: 0.01 } })
});`}
                filename="interop.ts"
            />

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
                <div className="flex items-center justify-center gap-6 text-sm">
                    <Link href="https://privacy.cash" target="_blank" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                        PrivacyCash <LinkSquare02Icon className="w-3 h-3" />
                    </Link>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                        Radr Labs <FlashIcon className="w-3 h-3" />
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
