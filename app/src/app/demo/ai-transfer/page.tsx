'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
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

            setStep('generating');
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth generation failed');
            setTxData({ stealthAddr: stealthData.stealthAddress });

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
        { id: 'generating', label: 'Stealth Address', desc: 'Generate one-time recipient' },
        { id: 'transferring', label: 'Ring Transfer', desc: 'Send with decoy outputs' },
        { id: 'scanning', label: 'Recipient Scan', desc: 'Detect incoming payment' },
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
        <TerminalDemoWrapper
            title="PRIVATE_STEALTH_TRANSFER"
            tag="AI_TO_AI_TRANSFER"
            description="Transfer via stealth addresses with ring decoys. Ashborn acts as your Privacy Relay — protocols never see your identity."
        >
            <TerminalSection title="RING_SIGNATURES_PROTOCOL">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Generate Stealth → Create Decoys → Sign & Send</p>
                    <p className="text-xs text-gray-500">$ One-time address mixed with decoys</p>
                    <p className="text-xs text-gray-500">$ Observers cannot determine real payment</p>
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
                                    ${status === 'complete' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : ''}
                                    ${status === 'active' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 animate-pulse' : ''}
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
                    <TerminalSection title="TRANSFER_COMPLETE" variant="success">
                        <TerminalOutput
                            lines={[
                                `Stealth_Address: ${txData.stealthAddr?.slice(0, 24)}...`,
                                `Ring_Size: 4_(3_decoys)`,
                                `Transaction: ${txData.signature?.slice(0, 24)}...`,
                                `Amount: ${amount}_SOL`,
                                `Status: ✓ COMPLETE`
                            ]}
                            type="success"
                        />
                        {txData.decoys && txData.decoys.length > 0 && (
                            <div className="mt-4">
                                <div className="text-xs text-gray-500 mb-2 font-mono">$ DECOY_OUTPUTS</div>
                                <div className="flex flex-wrap gap-1">
                                    {txData.decoys.map((d, i) => (
                                        <span key={i} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 border border-white/10">
                                            {d.slice(0, 12)}...
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ SEND_ANOTHER</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="TRANSFER_CONFIGURATION">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ AMOUNT (SOL)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                disabled={step !== 'idle'}
                            />
                        </div>

                        <TerminalButton onClick={runTransferDemo} loading={isLoading} disabled={isLoading}>
                            {isLoading ? '$ PROCESSING...' : '$ EXECUTE_TRANSFER'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_api • no_wallet_required
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`const stealthRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'stealth', params: { recipient } })
});

const transferRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'transfer', params: { amount: 0.01 } })
});`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
