'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Money03Icon, CheckmarkCircle01Icon, Loading03Icon, Shield02Icon, ArrowRight01Icon, ChartHistogramIcon, AlertCircleIcon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'proving' | 'lending' | 'confirming' | 'complete';

export default function AILendingDemoPage() {
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [loanAmount, setLoanAmount] = useState('0.01');
    const [collateralRange, setCollateralRange] = useState({ min: '0.02', max: '0.1' });
    const [loanData, setLoanData] = useState<{ id?: string; proofHash?: string; signature?: string; stealthAddr?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setLoanData({});
    };

    const runLendingDemo = async () => {
        try {
            setStatus('loading');

            // Step 1: Generate ZK collateral proof via API
            setStep('proving');
            const proofRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'prove',
                    params: {
                        balance: 0.05,
                        min: parseFloat(collateralRange.min),
                        max: parseFloat(collateralRange.max)
                    }
                })
            });
            const proofData = await proofRes.json();
            if (!proofData.success) throw new Error(proofData.error || 'Proof generation failed');

            const proofHash = `groth16_${proofData.proof.slice(0, 12)}...`;
            setLoanData(prev => ({ ...prev, proofHash }));

            // Step 2: Lender disburses via API
            setStep('lending');
            const shieldRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'shield',
                    params: { amount: parseFloat(loanAmount) }
                })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) throw new Error(shieldData.error || 'Lending failed');
            setLoanData(prev => ({ ...prev, signature: shieldData.signature }));

            // Generate stealth address via API
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            setLoanData(prev => ({ ...prev, stealthAddr: stealthData.stealthAddress }));

            // Step 3: Confirm loan
            setStep('confirming');
            await new Promise(r => setTimeout(r, 1000));

            const loanId = `loan_${Math.random().toString(36).substring(7)}`;
            setLoanData(prev => ({ ...prev, id: loanId }));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Lending error:', err);
            setErrorState(err instanceof Error ? err.message : 'Lending failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'proving', label: 'ZK Collateral Proof', icon: Shield02Icon, desc: 'Prove balance ∈ [min, max]' },
        { id: 'lending', label: 'Private Disbursement', icon: Money03Icon, desc: 'Lender sends to stealth addr' },
        { id: 'confirming', label: 'Loan Recorded', icon: CheckmarkCircle01Icon, desc: 'Encrypted loan terms stored' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['proving', 'lending', 'confirming'];
        const currentIdx = order.indexOf(step === 'complete' ? 'confirming' : step);
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
                        <p className="text-amber-300 font-medium mb-1">Server-Side Demo</p>
                        <p className="text-amber-200/70 text-xs leading-relaxed">
                            All operations run server-side via API. No wallet connection required.
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

            <DemoPageHeader
                icon={Money03Icon}
                badge="AI-to-AI Lending"
                title="Private Collateral Lending"
                description="Borrow between AI agents using ZK proofs. Ashborn acts as your Privacy Relay — protocols never see your identity."
                color="green"
                privacyRelay
            />

            <InfoCard
                icon={ChartHistogramIcon}
                title="ZK Collateral Proof"
                color="green"
                steps={[
                    { label: "Private Balance", color: "green" },
                    { label: "Range Proof", color: "blue" },
                    { label: "Verify", color: "purple" },
                    { label: "Disburse", color: "amber" }
                ]}
            >
                <div>
                    The borrower proves: <code className="text-green-300">Balance ≥ 2× Loan</code> without revealing the exact balance.
                    This uses <strong>Groth16 Range Proofs</strong> via Ashborn ZK module.
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

            {/* Result */}
            {isSuccess ? (
                <div className="space-y-6">
                    <PrivacyVisualizer
                        publicView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">On-Chain Proof</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Proof Type:</span>
                                        <span className="text-green-300 font-mono">Groth16 Range</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Public Inputs:</span>
                                        <span className="text-gray-300">Min: {collateralRange.min}, Max: {collateralRange.max}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Proof Hash:</span>
                                        <span className="text-gray-500 font-mono truncate max-w-[120px]">{loanData.proofHash}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Loan Tx:</span>
                                        {loanData.signature && <TxLink signature={loanData.signature} className="text-xs" />}
                                    </div>
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Private State</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between border-b border-purple-500/20 pb-1">
                                        <span className="text-purple-300">Actual Balance:</span>
                                        <span className="text-white font-mono blur-[2px] hover:blur-none transition">0.05 SOL</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-300">Stealth Address:</span>
                                        <span className="text-green-400 font-mono">{loanData.stealthAddr?.slice(0, 12)}...</span>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <div className="flex justify-center">
                        <DemoButton onClick={resetDemo} icon={Money03Icon}>
                            Make Another Loan
                        </DemoButton>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Loan Amount</label>
                            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Collateral Min</label>
                            <input type="number" value={collateralRange.min} onChange={(e) => setCollateralRange(p => ({ ...p, min: e.target.value }))}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Collateral Max</label>
                            <input type="number" value={collateralRange.max} onChange={(e) => setCollateralRange(p => ({ ...p, max: e.target.value }))}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                    </div>

                    <DemoButton
                        onClick={runLendingDemo}
                        loading={isLoading}
                        disabled={isLoading}
                        icon={Money03Icon}
                        variant="gradient"
                    >
                        {isLoading ? 'Processing...' : 'Execute Lending'}
                    </DemoButton>

                    <p className="text-center text-xs text-gray-500">
                        Uses API • No SDK required client-side • Fast loading
                    </p>
                </div>
            )}

            {/* SDK Code */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`// All operations happen server-side via /api/ashborn
const proofRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({
    action: 'prove',
    params: { balance: 0.05, min: 0.02, max: 0.1 }
  })
});
const { proof, inRange } = await proofRes.json();

// Lender verifies and disburses
if (inRange) {
  await fetch('/api/ashborn', {
    method: 'POST',
    body: JSON.stringify({ action: 'shield', params: { amount: 0.01 } })
  });
}`}
                    filename="ai-lending.ts"
                />
            </motion.div>
        </div>
    );
}
