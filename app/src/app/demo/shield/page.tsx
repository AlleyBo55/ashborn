'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
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
        <TerminalDemoWrapper
            title="SHIELD_SOL"
            tag="PRIVACYCASH"
            description="Convert public SOL into private notes. Integrates with PrivacyCash and Light Protocol. Ashborn wraps it for unified SDK access."
        >
            {/* Tech Stack Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 border border-blue-500/30">⚡ PrivacyCash</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 border border-green-500/30">⚡ Light Protocol</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 border border-purple-500/30">⚡ Ashborn</span>
            </div>

            <TerminalSection title="DEMO_WALLET" variant="warning">
                <div className="text-xs text-amber-300 space-y-2">
                    <p>$ PrivacyCash SDK requires raw keypair (no browser wallet)</p>
                    <p>$ Using server-side demo wallet: <span className="text-white font-mono">{DEMO_WALLET.slice(0, 16)}...</span></p>
                </div>
            </TerminalSection>

            <TerminalSection title="HOW_SHIELDING_WORKS">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Public SOL → Deposit to Pool → Receive Private Note</p>
                    <p className="text-xs text-gray-500">$ Observers see deposit but cannot link to future withdrawal</p>
                </div>
            </TerminalSection>
            {isSuccess ? (
                <>
                    <TerminalSection title="TRANSACTION_RESULT" variant="success">
                        <TerminalOutput
                            lines={[
                                `Action: Shield to PrivacyCash Pool`,
                                `Amount: ${amount} SOL`,
                                `Signer: ${DEMO_WALLET.slice(0, 16)}...`,
                                `Program: PrivacyCash (ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS)`,
                                txSignature ? `Tx: ${txSignature.slice(0, 16)}...` : 'Tx: pending',
                                `Note: note_7x9... (Saved to Vault)`,
                                `Status: ✓ COMPLETE`
                            ]}
                            type="success"
                        />
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ SHIELD_MORE_SOL</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="SHIELD_CONFIGURATION">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ AMOUNT_TO_SHIELD (SOL)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                disabled={step !== 'idle'}
                                min="0.001"
                                step="0.01"
                            />
                        </div>

                        <TerminalButton
                            onClick={runShieldDemo}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? '$ SHIELDING...' : '$ EXECUTE_SHIELD'}
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
  rpcUrl: "https://api.devnet.solana.com",
  owner: keypair,
  programId: "ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS"
});

const result = await privacyCash.shieldSOL(0.1);`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
