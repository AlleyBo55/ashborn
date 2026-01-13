'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, AlertCircle, Loader, BadgeCheck, Scale } from 'lucide-react';

type ProofType = 'range' | 'ownership' | 'compliance';

interface ProofResult {
    type: ProofType;
    rangeMin?: number;
    rangeMax?: number;
    verified: boolean;
    proofHash: string;
    expiresAt: Date;
}

export function ComplianceProof() {
    const { publicKey } = useWallet();
    const [proofType, setProofType] = useState<ProofType>('range');
    const [rangeMin, setRangeMin] = useState('0');
    const [rangeMax, setRangeMax] = useState('10000');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<ProofResult | null>(null);

    const proofTypes = [
        {
            id: 'range' as ProofType,
            label: 'Range Proof',
            icon: Scale,
            description: 'Prove balance is within $X - $Y'
        },
        {
            id: 'ownership' as ProofType,
            label: 'Ownership Proof',
            icon: BadgeCheck,
            description: 'Prove you own the vault'
        },
        {
            id: 'compliance' as ProofType,
            label: 'AML Compliance',
            icon: CheckCircle,
            description: 'Prove regulatory compliance'
        },
    ];

    const generateProof = async () => {
        setGenerating(true);
        setResult(null);

        try {
            // Demo: simulate proof generation
            await new Promise((resolve) => setTimeout(resolve, 2500));

            setResult({
                type: proofType,
                rangeMin: proofType === 'range' ? parseInt(rangeMin) : undefined,
                rangeMax: proofType === 'range' ? parseInt(rangeMax) : undefined,
                verified: true,
                proofHash: generateMockHash(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Selective Disclosure</h2>
                        <p className="text-shadow-400 text-sm">Prove properties without revealing values</p>
                    </div>
                </div>

                <p className="text-shadow-300 text-sm">
                    Generate ZK proofs that demonstrate facts about your shielded assets
                    without revealing the actual amounts. Perfect for regulatory compliance,
                    loan applications, or identity verification.
                </p>
            </div>

            {/* Proof type selection */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Select Proof Type</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {proofTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setProofType(type.id)}
                            className={`p-4 rounded-xl text-left transition-all ${proofType === type.id
                                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500'
                                    : 'bg-void-light border border-shadow-900/30 hover:border-shadow-700'
                                }`}
                        >
                            <type.icon className={`w-6 h-6 mb-2 ${proofType === type.id ? 'text-amber-400' : 'text-shadow-400'
                                }`} />
                            <div className={`font-medium ${proofType === type.id ? 'text-white' : 'text-shadow-300'
                                }`}>
                                {type.label}
                            </div>
                            <div className="text-shadow-500 text-xs mt-1">{type.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Range inputs (for range proof) */}
            <AnimatePresence>
                {proofType === 'range' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Range Parameters</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-shadow-300 text-sm mb-2">Minimum (USD)</label>
                                <input
                                    type="number"
                                    value={rangeMin}
                                    onChange={(e) => setRangeMin(e.target.value)}
                                    className="shadow-input"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-shadow-300 text-sm mb-2">Maximum (USD)</label>
                                <input
                                    type="number"
                                    value={rangeMax}
                                    onChange={(e) => setRangeMax(e.target.value)}
                                    className="shadow-input"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="mt-4 bg-void-light rounded-xl p-4">
                            <p className="text-shadow-300 text-sm">
                                This proves: <span className="text-amber-400 font-medium">
                                    ${rangeMin} ≤ your shielded balance ≤ ${rangeMax}
                                </span>
                            </p>
                            <p className="text-shadow-500 text-xs mt-2">
                                The verifier learns only that your balance is in this range,
                                not the exact amount.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate button */}
            <div className="glass-card p-6">
                <button
                    onClick={generateProof}
                    disabled={generating}
                    className="shadow-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600"
                >
                    {generating ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Generating Proof...
                        </>
                    ) : (
                        <>
                            <BadgeCheck className="w-5 h-5" />
                            Generate Proof
                        </>
                    )}
                </button>

                <p className="text-shadow-500 text-xs text-center mt-3">
                    Powered by Range Compliance SDK
                </p>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Proof Generated!</h3>
                                <p className="text-green-400 text-sm">Verified and ready to share</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-void-light rounded-xl p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-shadow-400 text-sm">Proof Type</span>
                                    <span className="text-white font-medium capitalize">{result.type}</span>
                                </div>
                                {result.rangeMin !== undefined && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-shadow-400 text-sm">Range</span>
                                        <span className="text-white font-medium">
                                            ${result.rangeMin} - ${result.rangeMax}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between mb-2">
                                    <span className="text-shadow-400 text-sm">Status</span>
                                    <span className="text-green-400 font-medium flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-shadow-400 text-sm">Expires</span>
                                    <span className="text-shadow-300 text-sm">
                                        {result.expiresAt.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-void-light rounded-xl p-4">
                                <div className="text-shadow-400 text-sm mb-2">Proof Hash</div>
                                <code className="text-amber-400 text-xs break-all">
                                    {result.proofHash}
                                </code>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-void-light hover:bg-shadow-900/50 text-shadow-300 py-3 rounded-xl font-medium transition-colors">
                                    Copy Proof
                                </button>
                                <button className="flex-1 shadow-btn bg-gradient-to-r from-amber-500 to-orange-600">
                                    Share
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function generateMockHash(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
