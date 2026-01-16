'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
import { useDemoStatus } from '@/hooks/useDemoStatus';

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

            setStep('shielding');
            const shieldRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', params: { amount: parseFloat(amount) } })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) throw new Error(shieldData.error || 'Shield failed');
            setTxHashes(prev => ({ ...prev, shield: shieldData.signature }));

            setStep('transferring');
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: DEMO_WALLET } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth failed');
            setTxHashes(prev => ({ ...prev, transfer: stealthData.stealthAddress }));

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
        { id: 'shielding', label: 'Shield to PrivacyCash Pool', status: '1/3' },
        { id: 'transferring', label: 'Generate Stealth Address', status: '2/3' },
        { id: 'unshielding', label: 'Unshield to Recipient', status: '3/3' },
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
        <TerminalDemoWrapper
            title="PRIVACYCASH_×_ASHBORN_INTEROP"
            tag="PRIVACY_RELAY"
            description="Full privacy flow via Ashborn Relay. Shield, stealth transfer, unshield — protocols never see your identity."
        >
            <TerminalSection title="PRIVACY_FLOW">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Shield (API) → Stealth (API) → Unshield (API)</p>
                    <p className="text-xs text-gray-500">$ All steps run server-side via /api/ashborn</p>
                    <p className="text-xs text-gray-500">$ No SDK loaded client-side = instant page load</p>
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
                                    ${status === 'active' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border-white/10 text-gray-600' : ''}
                                `}>
                                    {status === 'complete' ? '✓' : status === 'active' ? '...' : s.status}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-mono ${status === 'pending' ? 'text-gray-600' : 'text-white'}`}>
                                        {s.label}
                                    </p>
                                    {txHashes[s.id as keyof typeof txHashes] && (
                                        <p className="text-xs text-gray-500 font-mono mt-1">
                                            {txHashes[s.id as keyof typeof txHashes]?.slice(0, 16)}...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </TerminalSection>

            {isSuccess ? (
                <>
                    <TerminalSection title="FLOW_COMPLETE" variant="success">
                        <TerminalOutput
                            lines={[
                                `Shield_Tx: ${txHashes.shield?.slice(0, 24)}... ✓`,
                                `Stealth_Addr: ${txHashes.transfer?.slice(0, 24)}... ✓`,
                                `Unshield_Tx: ${txHashes.unshield?.slice(0, 24)}... ✓`,
                                `Amount: ${amount} SOL`,
                                `Status: COMPLETE`
                            ]}
                            type="success"
                        />
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ RUN_AGAIN</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="CONFIGURATION">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ AMOUNT (SOL)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                disabled={isLoading}
                            />
                        </div>

                        <TerminalButton onClick={runInteropDemo} loading={isLoading} disabled={isLoading}>
                            {isLoading ? '$ EXECUTING...' : '$ RUN_PRIVACY_FLOW'}
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
                    code={`await fetch('/api/ashborn', {
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
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
