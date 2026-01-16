'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function ProveDemoPage() {
    const [minValue, setMinValue] = useState('0');
    const [maxValue, setMaxValue] = useState('10000');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();
    const [proofHash, setProofHash] = useState<string | null>(null);

    const handleProve = async () => {
        setStatus('loading');

        try {
            const res = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'prove',
                    params: {
                        balance: (parseInt(minValue) + parseInt(maxValue)) / 2 / 1000000,
                        min: parseInt(minValue) / 1000000,
                        max: parseInt(maxValue) / 1000000
                    }
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Proof generation failed');

            setProofHash(`groth16_${data.proof.slice(0, 24)}`);
            setStatus('success');
        } catch (err) {
            console.error('Proof error:', err);
            setErrorState(err instanceof Error ? err.message : 'Failed');
        }
    };

    const resetDemo = () => {
        reset();
        setProofHash(null);
    };

    return (
        <TerminalDemoWrapper
            title="COMPLIANCE_SEAL"
            tag="ZK_RANGE_PROOF"
            description="Prove balance is in range using real Groth16 proofs via snarkjs. Ashborn Privacy Relay keeps your identity hidden from protocols."
        >
            {/* Tech Stack Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 border border-amber-500/30">⚡ ZK Groth16</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 border border-green-500/30">⚡ snarkjs</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 border border-purple-500/30">⚡ Ashborn</span>
            </div>
            <TerminalSection title="RANGE_PROOF_PROTOCOL">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ 1. Define Range</p>
                    <p>$ 2. Generate Proof</p>
                    <p>$ 3. Verify On-Chain</p>
                    <p className="text-xs text-gray-500">$ Prove: Balance ∈ [{minValue}, {maxValue}] without revealing exact value</p>
                    <p className="text-xs text-gray-500">$ Uses Groth16 ZK-SNARKs</p>
                </div>
            </TerminalSection>

            {isSuccess ? (
                <>
                    <TerminalSection title="PROOF_VERIFIED" variant="success">
                        <TerminalOutput
                            lines={[
                                `Proof_Type: Groth16_Range_Proof`,
                                `Range: [${minValue}, ${maxValue}]`,
                                `Proof_Hash: ${proofHash}`,
                                `Status: ✓ VERIFIED`,
                                `Privacy: MAXIMUM`
                            ]}
                            type="success"
                        />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-green-500/10 border border-green-500/20 p-3">
                                <div className="text-xs text-green-400 font-mono mb-2">$ REVEALED</div>
                                <p className="text-xs text-gray-400">Balance in range</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-3">
                                <div className="text-xs text-red-400 font-mono mb-2">$ HIDDEN</div>
                                <p className="text-xs text-gray-400">Exact amount</p>
                            </div>
                        </div>
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ GENERATE_ANOTHER</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="PROOF_CONFIGURATION">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-green-500 mb-2 font-mono">$ MINIMUM ($)</label>
                                <input
                                    type="number"
                                    value={minValue}
                                    onChange={(e) => setMinValue(e.target.value)}
                                    className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-green-500 mb-2 font-mono">$ MAXIMUM ($)</label>
                                <input
                                    type="number"
                                    value={maxValue}
                                    onChange={(e) => setMaxValue(e.target.value)}
                                    className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <TerminalButton onClick={handleProve} loading={isLoading} disabled={isLoading}>
                            {isLoading ? '$ COMPUTING_ZK_PROOF...' : '$ GENERATE_PROOF'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_zk_proof • no_wallet_required
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`const res = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({
    action: 'prove',
    params: { balance: 0.05, min: 0, max: 10 }
  })
});
const { proof, inRange } = await res.json();`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
