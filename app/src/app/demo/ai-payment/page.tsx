'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
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

            setStep('shielding');
            const shieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', amount: 0.01 })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) throw new Error(shieldData.error || 'Shield failed');

            setStep('paying');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setStep('unshielding');
            const unshieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unshield', amount: 0.01 })
            });
            const unshieldData = await unshieldRes.json();
            if (!unshieldData.success) throw new Error(unshieldData.error || 'Unshield failed');

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
        { id: 'shielding', label: 'Shield Funds', desc: 'Public SOL → Private Balance' },
        { id: 'paying', label: 'Private Pay', desc: 'Transfer within Shielded Pool' },
        { id: 'unshielding', label: 'Merchant Settles', desc: 'Merchant receives clean funds' },
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
        <TerminalDemoWrapper
            title="PRIVATE_MICRO_PAYMENTS"
            tag="AI_TO_AI_PAYMENT"
            description="Enable autonomous agents to pay for API access or resources privately. No graph analysis can link the payer agent to the merchant."
        >
            <TerminalSection title="DEMO_WALLET" variant="warning">
                <div className="text-xs text-amber-300 space-y-2">
                    <p>$ PrivacyCash SDK requires raw keypair (no browser wallet)</p>
                    <p>$ Demo Signer: <span className="text-white font-mono">{DEMO_WALLET.slice(0, 16)}...</span></p>
                </div>
            </TerminalSection>

            <TerminalSection title="DUAL_SIDED_PRIVACY">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Shielded Pool → Private Transfer → Proof Generation</p>
                    <p className="text-xs text-gray-500">$ Payments occur within Shielded Pool</p>
                    <p className="text-xs text-gray-500">$ Payer generates ZK proof, merchant receives private notification</p>
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
                    <TerminalSection title="PAYMENT_COMPLETE" variant="success">
                        <TerminalOutput
                            lines={[
                                `Transaction: Encrypted_State_Update`,
                                `Payer: Unknown_(Shielded)`,
                                `Recipient: Unknown_(Shielded)`,
                                `Amount: 0.01_sSOL`,
                                `Merchant: Agent_X_(Authorized)`,
                                `Status: ✓ SETTLED`,
                                mockData?.signature ? `Tx: ${mockData.signature.slice(0, 24)}...` : ''
                            ].filter(Boolean)}
                            type="success"
                        />
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ MAKE_ANOTHER_PAYMENT</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="PAYMENT_EXECUTION">
                    <div className="space-y-4">
                        <TerminalButton onClick={runPaymentDemo} loading={isLoading} disabled={isLoading}>
                            {isLoading ? '$ PROCESSING...' : '$ SEND_AGENT_PAYMENT_(0.01_SOL)'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_demo • no_wallet_required
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

const privacyCash = new PrivacyCashOfficial({
  rpcUrl: process.env.RPC_URL,
  owner: agentKeypair,
});

await privacyCash.shieldSOL(0.05);

const txId = await privacyCash.transfer({
  amount: 0.05,
  recipient: merchantShieldedAddress,
});

await privacyCash.unshieldSOL(0.05, merchantPublicAddress);`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
