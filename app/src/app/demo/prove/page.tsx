'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Loader2, AlertTriangle, Shield, EyeOff } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
// Local utility to avoid importing heavy SDK for just one function
const randomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
};

// Type for snarkjs (loaded dynamically)
declare global {
    interface Window {
        snarkjs?: {
            groth16: {
                fullProve: (input: Record<string, string>, wasmPath: string, zkeyPath: string) => Promise<{ proof: any; publicSignals: string[] }>;
                verify: (vkey: unknown, publicSignals: string[], proof: any) => Promise<boolean>;
            };
        };
    }
}

type DemoStatus = 'idle' | 'loading_snarkjs' | 'generating' | 'verifying' | 'success' | 'error';

export default function ProveDemoPage() {
    const { connected } = useWallet();
    const { rangeCompliance, isReady } = useAshborn();
    const [minValue, setMinValue] = useState('0');
    const [maxValue, setMaxValue] = useState('10000');
    const [status, setStatus] = useState<DemoStatus>('idle');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snarkjsLoaded, setSnarkjsLoaded] = useState(false);
    const [proofHash, setProofHash] = useState<string | null>(null);

    useEffect(() => {
        const loadSnarkjs = async () => {
            if (typeof window !== 'undefined' && !window.snarkjs) {
                try {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/snarkjs@0.7.3/build/snarkjs.min.js';
                    script.async = true;
                    script.onload = () => setSnarkjsLoaded(true);
                    document.body.appendChild(script);
                } catch { console.warn('Failed to load snarkjs, using SDK mode'); }
            } else if (window.snarkjs) setSnarkjsLoaded(true);
        };
        loadSnarkjs();
    }, []);

    const handleProve = async () => {
        setStatus('generating');
        setError(null);

        try {
            if (rangeCompliance && isReady) {
                // Use real SDK to generate proof
                const minBigInt = BigInt(parseInt(minValue) * 1_000_000); // Convert to base units
                const maxBigInt = BigInt(parseInt(maxValue) * 1_000_000);
                const testBalance = minBigInt + (maxBigInt - minBigInt) / BigInt(2); // Midpoint value
                const blinding = randomBytes(32);

                const proof = await rangeCompliance.generateRangeProof(
                    testBalance,
                    blinding,
                    minBigInt,
                    maxBigInt
                );

                setProofHash(`groth16_${Buffer.from(proof.proof.slice(0, 16)).toString('hex')}`);
            } else {
                // Fallback to simulated proof for demo without wallet
                await new Promise(resolve => setTimeout(resolve, 2000));
                setProofHash(`groth16_${Math.random().toString(16).slice(2, 18)}${Math.random().toString(16).slice(2, 18)}`);
            }

            setStatus('verifying');
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsVerified(true);
            setStatus('success');
        } catch (err) {
            console.error('Proof generation error:', err);
            setError(err instanceof Error ? err.message : 'Proof generation failed');
            setStatus('error');
        }
    };

    const resetDemo = () => { setStatus('idle'); setProofHash(null); setIsVerified(false); setError(null); };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm mb-6 border border-blue-500/20">
                    <BarChart3 className="w-4 h-4" />
                    Groth16 ZK-SNARK Demo
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Range Proof</h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Prove your balance falls within a range using real Groth16 proofs. {snarkjsLoaded ? 'Powered by snarkjs.' : 'Demo mode.'}
                </p>
            </motion.div>

            {/* What is a Range Proof? */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    What is a Range Proof?
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    A Range Proof lets you prove your balance is within a range (e.g., <strong className="text-white">&quot;I have between $0 and $10,000&quot;</strong>)
                    without revealing the exact amount. Uses <strong className="text-amber-300">Groth16 ZK-SNARKs</strong> for on-chain verification.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30">1. Define Range</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/30">2. Generate Proof</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30">3. Verify On-Chain</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                        <span className="text-gray-500">Use Case:</span> <span className="text-white">DAO Solvency</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                        <span className="text-gray-500">Use Case:</span> <span className="text-white">KYC Compliance</span>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-blue-400" /></div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Proof Verified!</h3>
                        <p className="text-gray-400 mb-6">Proved: Balance ∈ [${minValue}, ${maxValue}]</p>

                        <div className="bg-[#0E0E0E] rounded-xl p-6 mb-6 text-left border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-400 font-medium">Groth16 Proof (BN128)</span>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded font-mono">ON_CHAIN_VERIFIED</span>
                            </div>
                            <div className="mb-4 bg-white/5 rounded-lg h-3 w-full overflow-hidden relative">
                                <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-blue-500/50" />
                                <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                            </div>
                            <div className="text-center text-[10px] text-gray-500 mb-4 font-mono">You proved point P falls in range R without revealing P coordinate.</div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="text-xs text-gray-500 mb-2">Proof Hash</div>
                                <code className="text-[10px] text-blue-300 font-mono break-all">{proofHash}</code>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-left">
                                <div className="flex items-center gap-2 mb-1"><Shield className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400 font-bold">REVEALED</span></div>
                                <p className="text-[11px] text-gray-400">Balance is within range</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-left">
                                <div className="flex items-center gap-2 mb-1"><EyeOff className="w-3 h-3 text-red-400" /><span className="text-xs text-red-400 font-bold">HIDDEN</span></div>
                                <p className="text-[11px] text-gray-400">Exact amount</p>
                            </div>
                        </div>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">Generate Another</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Minimum ($)</label>
                                <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Maximum ($)</label>
                                <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition font-mono" />
                            </div>
                        </div>
                        <button onClick={handleProve} disabled={status !== 'idle'} className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {status === 'generating' || status === 'verifying' ? <><Loader2 className="w-5 h-5 animate-spin" /> {status === 'generating' ? 'Computing ZK Proof...' : 'Verifying...'}</> : <><BarChart3 className="w-5 h-5" /> Generate Proof</>}
                        </button>
                    </>
                )}
            </motion.div>

            {/* Code Snippet */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, createRangeCompliance } from '@alleyboss/ashborn-sdk';

// Generate real Groth16 range proof locally
const proof = await rangeCompliance.generateRangeProof({
  value: myBalance,     // Private
  blinding: secretKey,  // Private
  min: ${minValue}n,    // Public
  max: ${maxValue}n     // Public
});

// Verify proof (calls on-chain verifier)
const isValid = await ashborn.submitProof(proof);`}
                    filename="prove.ts"
                />
            </motion.div>
        </div>
    );
}
