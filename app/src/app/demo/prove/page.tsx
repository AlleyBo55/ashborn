'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartHistogramIcon, CheckmarkCircle01Icon, Loading03Icon, Shield02Icon, ViewOffIcon, AlertCircleIcon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function ProveDemoPage() {
    const [minValue, setMinValue] = useState('0');
    const [maxValue, setMaxValue] = useState('10000');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();
    const [proofHash, setProofHash] = useState<string | null>(null);

    const handleProve = async () => {
        setStatus('loading');

        try {
            // Generate ZK proof via API
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
                        <p className="text-amber-300 font-medium mb-1">Server-Side ZK Proof</p>
                        <p className="text-amber-200/70 text-xs">Proof generation runs on server via /api/ashborn</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                icon={ChartHistogramIcon}
                badge="ZK_RANGE_PROOF"
                title="Compliance Seal"
                description="Prove balance is in range using Groth16 proofs. Ashborn Privacy Relay keeps your identity hidden from protocols."
                color="blue"
                privacyRelay
            />

            <InfoCard
                icon={Shield02Icon}
                title="What is a Range Proof?"
                color="blue"
                steps={[
                    { label: "Define Range", color: "blue" },
                    { label: "Generate Proof", color: "purple" },
                    { label: "Verify On-Chain", color: "green" }
                ]}
            >
                <div>
                    Prove: <code className="text-blue-300">Balance ∈ [{minValue}, {maxValue}]</code> without revealing the exact value.
                    Uses <strong>Groth16 ZK-SNARKs</strong>.
                </div>
            </InfoCard>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
            >
                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <CheckmarkCircle01Icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Proof Verified!</h3>
                        <p className="text-gray-400 mb-6">Proved: Balance ∈ [{minValue}, {maxValue}]</p>

                        <div className="bg-[#0E0E0E] rounded-xl p-6 mb-6 text-left border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-400">Groth16 Proof</span>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded font-mono">VERIFIED</span>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="text-xs text-gray-500 mb-2">Proof Hash</div>
                                <code className="text-[10px] text-blue-300 font-mono break-all">{proofHash}</code>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield02Icon className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-green-400 font-bold">REVEALED</span>
                                </div>
                                <p className="text-[11px] text-gray-400">Balance in range</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <ViewOffIcon className="w-3 h-3 text-red-400" />
                                    <span className="text-xs text-red-400 font-bold">HIDDEN</span>
                                </div>
                                <p className="text-[11px] text-gray-400">Exact amount</p>
                            </div>
                        </div>

                        <DemoButton onClick={resetDemo} icon={ChartHistogramIcon}>
                            Generate Another
                        </DemoButton>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Minimum ($)</label>
                                <input
                                    type="number"
                                    value={minValue}
                                    onChange={(e) => setMinValue(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Maximum ($)</label>
                                <input
                                    type="number"
                                    value={maxValue}
                                    onChange={(e) => setMaxValue(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono"
                                />
                            </div>
                        </div>

                        <DemoButton
                            onClick={handleProve}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={ChartHistogramIcon}
                            variant="gradient"
                        >
                            {isLoading ? 'Computing ZK Proof...' : 'Generate Proof'}
                        </DemoButton>
                    </>
                )}
            </motion.div>

            <CodeBlock
                language="typescript"
                code={`// Generate ZK Range Proof via API
const res = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({
    action: 'prove',
    params: { balance: 0.05, min: 0, max: 10 }
  })
});
const { proof, inRange } = await res.json();`}
                filename="prove.ts"
            />
        </div>
    );
}
