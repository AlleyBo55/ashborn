'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SentIcon, CheckmarkCircle01Icon, Loading03Icon, UserGroupIcon, ViewIcon, ViewOffIcon, ArrowRight01Icon, AlertCircleIcon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'generating' | 'transferring' | 'scanning' | 'complete';

export default function AITransferDemoPage() {
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [amount, setAmount] = useState('0.01');
    const [txData, setTxData] = useState<{ stealthAddr?: string; decoys?: string[]; signature?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setTxData({});
    };

    const runTransferDemo = async () => {
        try {
            setStatus('loading');

            // Step 1: Generate stealth address via API
            setStep('generating');
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth generation failed');
            setTxData({ stealthAddr: stealthData.stealthAddress });

            // Step 2: Transfer with decoys via API
            setStep('transferring');
            const transferRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'transfer',
                    params: { amount: parseFloat(amount), recipient: DEMO_WALLET }
                })
            });
            const transferData = await transferRes.json();
            if (!transferData.success) throw new Error(transferData.error || 'Transfer failed');

            setTxData(prev => ({
                ...prev,
                signature: transferData.signature,
                decoys: transferData.decoyOutputs
            }));

            // Step 3: Recipient scans
            setStep('scanning');
            await new Promise(r => setTimeout(r, 800));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Transfer error:', err);
            setErrorState(err instanceof Error ? err.message : 'Transfer failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'generating', label: 'Stealth Address', icon: ViewOffIcon, desc: 'Generate one-time recipient' },
        { id: 'transferring', label: 'Ring Transfer', icon: SentIcon, desc: 'Send with decoy outputs' },
        { id: 'scanning', label: 'Recipient Scan', icon: ViewIcon, desc: 'Detect incoming payment' },
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
                        <p className="text-amber-200/70 text-xs">All operations run via API. No wallet required.</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                icon={SentIcon}
                badge="AI-to-AI Transfer"
                title="Private Stealth Transfer"
                description="Transfer via stealth addresses with ring decoys. Ashborn acts as your Privacy Relay — protocols never see your identity."
                color="blue"
                privacyRelay
            />

            <InfoCard
                icon={UserGroupIcon}
                title="Ring Signatures & Stealth Addresses"
                color="blue"
                steps={[
                    { label: "Generate Stealth", color: "purple" },
                    { label: "Create Decoys", color: "blue" },
                    { label: "Sign & Send", color: "green" }
                ]}
            >
                <div>
                    The sender creates a one-time address and mixes the real output with decoys.
                    Observers cannot determine which output is the real payment.
                </div>
            </InfoCard>

            {/* Progress */}
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
                                    ${status === 'complete' ? 'bg-blue-500/20 border border-blue-500/50' : ''}
                                    ${status === 'active' ? 'bg-blue-500/20 border border-blue-500/50 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckmarkCircle01Icon className="w-5 h-5 text-blue-400" />
                                    ) : status === 'active' ? (
                                        <Loading03Icon className="w-5 h-5 text-blue-400 animate-spin" />
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

            {/* Result */}
            {isSuccess ? (
                <div className="space-y-6">
                    <PrivacyVisualizer
                        publicView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">On-Chain View</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Stealth:</span>
                                        <span className="text-purple-300 font-mono">{txData.stealthAddr?.slice(0, 16)}...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Ring Size:</span>
                                        <span className="text-blue-300">4 (3 decoys)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tx:</span>
                                        {txData.signature && <TxLink signature={txData.signature} className="text-xs" />}
                                    </div>
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Recipient View</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-green-300">Amount:</span>
                                        <span className="text-white">{amount} SOL</span>
                                    </div>
                                    <div className="text-gray-500 mt-2">Decoys:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {txData.decoys?.map((d, i) => (
                                            <span key={i} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded">{d.slice(0, 12)}...</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <div className="flex justify-center">
                        <DemoButton onClick={resetDemo} icon={SentIcon}>
                            Send Another
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
                            disabled={step !== 'idle'}
                        />
                    </div>

                    <DemoButton
                        onClick={runTransferDemo}
                        loading={isLoading}
                        disabled={isLoading}
                        icon={SentIcon}
                        variant="gradient"
                    >
                        {isLoading ? 'Processing...' : 'Execute Transfer'}
                    </DemoButton>

                    <p className="text-center text-xs text-gray-500">
                        Server-side API • No wallet required
                    </p>
                </div>
            )}

            {/* Code Example */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <CodeBlock
                    language="typescript"
                    code={`// Server-side transfer via API
const stealthRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'stealth', params: { recipient } })
});

const transferRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'transfer', params: { amount: 0.01 } })
});`}
                    filename="ai-transfer.ts"
                />
            </motion.div>
        </div>
    );
}
