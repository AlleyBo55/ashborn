'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
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

            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            setLoanData(prev => ({ ...prev, stealthAddr: stealthData.stealthAddress }));

            setStep('confirming');
            await new Promise(r => setTimeout(r, 1000));

            // Generate loan ID from stealth address hash (deterministic, no random)
            const loanId = `loan_${stealthData.stealthAddress?.slice(0, 12) || Date.now().toString(36)}`;
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
        { id: 'proving', label: 'ZK Collateral Proof', desc: 'Prove balance ∈ [min, max]' },
        { id: 'lending', label: 'Private Disbursement', desc: 'Lender sends to stealth addr' },
        { id: 'confirming', label: 'Loan Recorded', desc: 'Encrypted loan terms stored' },
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
        <TerminalDemoWrapper
            title="PRIVATE_COLLATERAL_LENDING"
            tag="AI_TO_AI_LENDING"
            description="Borrow between AI agents using real ZK proofs. Integrates with Groth16 (snarkjs) and PrivacyCash."
        >
            {/* Tech Stack Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 border border-amber-500/30">⚡ ZK Groth16</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 border border-blue-500/30">⚡ PrivacyCash</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 border border-purple-500/30">⚡ Ashborn</span>
            </div>
            <TerminalSection title="DEMO_WALLET" variant="warning">
                <div className="text-xs text-amber-300 space-y-2">
                    <p>$ All operations run server-side via API</p>
                    <p>$ Demo Signer: <span className="text-white font-mono">{DEMO_WALLET.slice(0, 16)}...</span></p>
                </div>
            </TerminalSection>

            <TerminalSection title="ZK_COLLATERAL_PROTOCOL">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Private Balance → Range Proof → Verify → Disburse</p>
                    <p className="text-xs text-gray-500">$ Borrower proves: Balance ≥ 2× Loan without revealing exact balance</p>
                    <p className="text-xs text-gray-500">$ Uses Groth16 Range Proofs via Ashborn ZK module</p>
                </div>
            </TerminalSection>

            <TerminalSection title="EXECUTION_PIPELINE">
                <div className="space-y-3">
                    {steps.map((s) => {
                        const status = getStepStatus(s.id);
                        return (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className={`
                                    w-8 h-8 flex items-center justify-center font-mono text-xs border
                                    ${status === 'complete' ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}
                                    ${status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border-white/10 text-gray-600' : ''}
                                `}>
                                    {status === 'complete' ? '✓' : status === 'active' ? '...' : '○'}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-mono ${status === 'pending' ? 'text-gray-600' : 'text-white'}`}>
                                        {s.label}
                                    </p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </TerminalSection>

            {isSuccess ? (
                <>
                    <TerminalSection title="LOAN_COMPLETE" variant="success">
                        <TerminalOutput
                            lines={[
                                `Loan_ID: ${loanData.id}`,
                                `Proof_Hash: ${loanData.proofHash}`,
                                `Loan_Tx: ${loanData.signature?.slice(0, 24)}...`,
                                `Stealth_Addr: ${loanData.stealthAddr?.slice(0, 24)}...`,
                                `Collateral_Range: [${collateralRange.min}, ${collateralRange.max}]`,
                                `Loan_Amount: ${loanAmount} SOL`,
                                `Status: ✓ COMPLETE`
                            ]}
                            type="success"
                        />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-green-500/10 border border-green-500/20 p-3">
                                <div className="text-xs text-green-400 font-mono mb-2">$ PUBLIC</div>
                                <p className="text-xs text-gray-400">Proof verified</p>
                                <p className="text-xs text-gray-400">Range: [{collateralRange.min}, {collateralRange.max}]</p>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-500/20 p-3">
                                <div className="text-xs text-purple-400 font-mono mb-2">$ PRIVATE</div>
                                <p className="text-xs text-gray-400">Actual balance: 0.05 SOL</p>
                                <p className="text-xs text-gray-400">Stealth address</p>
                            </div>
                        </div>
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ MAKE_ANOTHER_LOAN</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="LOAN_CONFIGURATION">
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-green-500 mb-2 font-mono">$ LOAN_AMOUNT</label>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-green-500 mb-2 font-mono">$ COLLATERAL_MIN</label>
                                <input
                                    type="number"
                                    value={collateralRange.min}
                                    onChange={(e) => setCollateralRange(p => ({ ...p, min: e.target.value }))}
                                    className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-green-500 mb-2 font-mono">$ COLLATERAL_MAX</label>
                                <input
                                    type="number"
                                    value={collateralRange.max}
                                    onChange={(e) => setCollateralRange(p => ({ ...p, max: e.target.value }))}
                                    className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                        </div>

                        <TerminalButton onClick={runLendingDemo} loading={isLoading} disabled={isLoading}>
                            {isLoading ? '$ PROCESSING...' : '$ EXECUTE_LENDING'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_api • no_sdk_required_client-side • fast_loading
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`const proofRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({
    action: 'prove',
    params: { balance: 0.05, min: 0.02, max: 0.1 }
  })
});
const { proof, inRange } = await proofRes.json();

if (inRange) {
  await fetch('/api/ashborn', {
    method: 'POST',
    body: JSON.stringify({ action: 'shield', params: { amount: 0.01 } })
  });
}`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
