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
    const [amount, setAmount] = useState('0.1');
    const [shieldMode, setShieldMode] = useState<'ashborn' | 'double'>('double');
    const [resultData, setResultData] = useState<any>(null);
    const [showProof, setShowProof] = useState(false);

    const resetDemo = () => {
        setStep('idle');
        setTxSignature(null);
        setResultData(null);
        reset();
    };

    const runShieldDemo = async () => {
        try {
            setStatus('loading');
            setStep('shielding');

            // Call Ashborn Relay for LAYERED privacy (Double Shield)
            // Layer 1: Ashborn Merkle Tree commitment
            // Layer 2: PrivacyCash pool deposit
            const res = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'shield',
                    params: {
                        amount: parseFloat(amount),
                        mode: shieldMode
                    }
                })
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Shielding failed');
            }

            setTxSignature(data.signature);
            setResultData(data);
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
            title="DOUBLE_SHIELD"
            tag="LAYERED_PRIVACY"
            description="Two layers of protection: Ashborn Merkle Tree + PrivacyCash Pool. Maximum anonymity with commitment proof."
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

            <TerminalSection title={shieldMode === 'double' ? "DOUBLE_SHIELD_ARCHITECTURE" : "SHADOW_SHIELD"}>
                <div className="text-sm text-gray-300 space-y-2">
                    {shieldMode === 'double' ? (
                        <>
                            <p>$ Layer 1: Ashborn → Commitment + Merkle Tree (ZK proof of deposit)</p>
                            <p>$ Layer 2: PrivacyCash → Token Pool (Mixing anonymity)</p>
                            <p className="text-xs text-gray-500">$ Even if one layer is compromised, the other still provides protection</p>
                        </>
                    ) : (
                        <>
                            <p>$ Layer 1: Ashborn → Commitment + Merkle Tree (ZK proof of deposit)</p>
                            <p className="text-xs text-gray-500">$ Standard compliance proof. Lighter, faster, but relies on Relay specifically.</p>
                        </>
                    )}
                </div>
            </TerminalSection>
            {isSuccess ? (
                <>
                    <TerminalSection title="TRANSACTION_RESULT" variant="success">
                        <TerminalOutput
                            lines={[
                                `Action: ${shieldMode === 'double' ? 'DOUBLE_SHIELD' : 'ASHBORN_SHIELD'}`,
                                `Amount: ${amount} SOL`,
                                `Layer 1: Ashborn Commitment ✓`,
                                shieldMode === 'double' ? `Layer 2: PrivacyCash Pool ✓` : null,
                                txSignature?.startsWith('simulated_')
                                    ? `Tx: [SIMULATION_MODE] ${txSignature.slice(0, 16)}...`
                                    : (txSignature ? `Tx: ${txSignature.slice(0, 16)}...` : 'Tx: pending'),
                                shieldMode === 'double' ? `Protection: 🛡️🛡️ Two Layers Active` : `Protection: 🛡️ Single Layer Active`,
                                resultData?.ashbornNote ? `Note: ${resultData.ashbornNote.slice(0, 16)}...` : null,
                                `Status: ✓ COMPLETE`
                            ].filter(Boolean) as string[]}
                            type="success"
                        />
                        {txSignature?.startsWith('simulated_') ? (
                            <div className="mt-4 p-3 border border-yellow-500/30 bg-yellow-500/10 rounded text-xs">
                                <p className="text-yellow-400 font-bold mb-1">⚠ SIMULATION MODE ACTIVE</p>
                                <p className="text-gray-400 mb-2">
                                    Devnet currently returning <span className="text-white font-mono">0x65 InstructionFallbackNotFound</span>.
                                    The demo is simulating the successful path to showcase the UX flow.
                                </p>

                                <button
                                    onClick={() => setShowProof(!showProof)}
                                    className="mt-2 text-yellow-500 hover:text-yellow-400 underline font-mono text-[10px] uppercase block mb-2"
                                >
                                    [{showProof ? 'HIDE_PROOF_DATA' : 'VIEW_SIMULATED_PROOF_DATA'}]
                                </button>

                                {showProof && (
                                    <div className="bg-black/50 p-2 rounded border border-yellow-500/20 font-mono text-[9px] text-gray-400 overflow-x-auto">
                                        <pre>{JSON.stringify({
                                            signature: txSignature,
                                            commitment: resultData?.commitment || 'hidden',
                                            note: resultData?.ashbornNote || 'hidden',
                                            proofType: 'GROTH16_SIMULATION',
                                            verification: 'SUCCESS'
                                        }, null, 2)}</pre>
                                    </div>
                                )}

                                <p className="text-gray-500 italic mt-2">
                                    On Mainnet, this would deliver a real ZK proof verification.
                                </p>
                            </div>
                        ) : txSignature && (
                            <div className="mt-4 text-center">
                                <a
                                    href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline font-mono"
                                >
                                    [VIEW_ON_SOLSCAN]
                                </a>
                            </div>
                        )}
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ SHIELD_MORE_SOL</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="SHIELD_CONFIGURATION">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ AMOUNT_TO_SHIELD (Allowed: 0.1, 1, 10...)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                disabled={step !== 'idle'}
                                min="0.1"
                                step="0.1"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ PRIVACY_MODE</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShieldMode('ashborn')}
                                    className={`flex-1 py-2 px-4 text-xs font-mono border transition-all ${shieldMode === 'ashborn'
                                        ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                                        : 'bg-black border-gray-800 text-gray-500 hover:border-pink-500/50'
                                        }`}
                                >
                                    ASHBORN_ONLY
                                </button>
                                <button
                                    onClick={() => setShieldMode('double')}
                                    className={`flex-1 py-2 px-4 text-xs font-mono border transition-all ${shieldMode === 'double'
                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : 'bg-black border-gray-800 text-gray-500 hover:border-green-500/50'
                                        }`}
                                >
                                    DOUBLE_SHIELD
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 font-mono">
                                {shieldMode === 'double'
                                    ? '> Max security. Merkle tree + Mixed Pool.'
                                    : '> Standard security. Merkle tree commitment only.'}
                            </p>
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
                    code={shieldMode === 'double' ? `import { PrivacyRelay } from '@alleyboss/ashborn-sdk';

// Initialize the Privacy Relay (server-side)
const relay = new PrivacyRelay({
  relayKeypair: process.env.RELAY_KEYPAIR,
  rpcUrl: process.env.RPC_URL,
  privacyCashProgramId: 'ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS'
});

// DOUBLE SHIELD: Ashborn Merkle + PrivacyCash Pool
const result = await relay.shield({ amount: 0.1 });` : `import { Ashborn } from '@alleyboss/ashborn-sdk';

// Initialize Standard SDK
const ashborn = new Ashborn(connection, wallet);

// ASHBORN ONLY: Merkle Tree Commitment
const result = await ashborn.shield({
    amount: BigInt(amount_lamports),
    mint: NATIVE_MINT
});`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
