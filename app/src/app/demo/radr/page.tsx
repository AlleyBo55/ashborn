'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Ghost, Eye, EyeOff, Key, Shield, RefreshCw, Loader2 } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { PublicKey } from '@solana/web3.js';

type Step = 'idle' | 'generating' | 'scanning' | 'complete';

export default function RadrDemoPage() {
    const { connected, publicKey } = useWallet();
    const { shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [ephemeralKey, setEphemeralKey] = useState<string | null>(null);
    const [viewTag, setViewTag] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setStealthAddress(null);
        setEphemeralKey(null);
        setViewTag(null);
    };

    const runRadrDemo = async () => {
        if (!connected || !publicKey || !shadowWire || !isReady) return;

        try {
            // Step 1: Generate Stealth Address
            setStep('generating');

            // Generate a stealth address pair
            // This normally happens on the sender side using the recipient's scan/spend keys
            // For demo, we treat the connected wallet as the recipient
            const stealth = await shadowWire.generateStealthAddress();

            await new Promise(r => setTimeout(r, 800)); // Visual delay

            setStealthAddress(stealth.stealthPubkey.toBase58());
            setEphemeralKey(stealth.ephemeralPubkey.toBase58());

            // In a real implementation, view tag is derived from shared secret (High byte)
            // Here we visualize it for the demo
            setViewTag(stealth.stealthPubkey.toBase58().slice(0, 2));

            // Step 2: "Scanning" simulation
            setStep('scanning');
            await new Promise(r => setTimeout(r, 1500));
            // Simulate scanning process where recipient identifies the output using view key

            setStep('complete');
        } catch (err) {
            console.error('Radr Demo Error:', err);
            setStep('idle');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/5 px-4 py-2 rounded-full text-sm mb-6 shadow-lg shadow-black/50">
                    <Ghost className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 font-medium">Powering Ashborn Privacy</span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">ShadowWire</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 tracking-tight">
                    Radr Labs Integration
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Experience the core cryptography behind ShadowWire. Generate stealth addresses and ephemeral keys that make transactions unlinkable.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Visualizer Panel */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Key className="w-5 h-5 text-purple-400" />
                                Stealth Generator
                            </h3>
                            {step !== 'idle' && step !== 'complete' && (
                                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            )}
                        </div>

                        {!connected ? (
                            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                                <p className="text-gray-400 mb-4">Connect wallet to generate keys</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className={`p-4 rounded-xl border transition-all duration-500 ${step === 'generating' || stealthAddress ? 'bg-purple-500/10 border-purple-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                        <Ghost className="w-3 h-3" /> Ephemeral Key (R)
                                    </div>
                                    <div className="font-mono text-xs md:text-sm text-purple-200 break-all">
                                        {ephemeralKey || 'waiting to generate...'}
                                    </div>
                                </div>

                                <div className="flex justify-center text-gray-600">
                                    <span className="text-xs px-2 bg-[#0A0A0A] z-10 relative">Derived via ECDH Shared Secret</span>
                                    <div className="absolute w-full h-px bg-white/5 top-1/2 -z-0"></div>
                                </div>

                                <div className={`p-4 rounded-xl border transition-all duration-500 ${step === 'generating' || stealthAddress ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                        <EyeOff className="w-3 h-3" /> Stealth Address (P)
                                    </div>
                                    <div className="font-mono text-xs md:text-sm text-green-200 break-all">
                                        {stealthAddress || 'waiting to generate...'}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <button
                                onClick={step === 'complete' ? resetDemo : runRadrDemo}
                                disabled={!connected || (step !== 'idle' && step !== 'complete')}
                                className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition flex items-center justify-center gap-2"
                            >
                                {step === 'idle' ? (
                                    <>Generate Stealth Address <Ghost className="w-4 h-4" /></>
                                ) : step === 'complete' ? (
                                    <>Generate Another <RefreshCw className="w-4 h-4" /></>
                                ) : (
                                    'Computing Elliptic Curve...'
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">How ShadowWire Works</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <div className="text-sm text-gray-400">
                                    <strong className="text-purple-300 block mb-0.5">Ephemeral Key Generation</strong>
                                    Sender generates a random keypair (r, R) for each transaction. This ensures unlinkability.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <div className="text-sm text-gray-400">
                                    <strong className="text-purple-300 block mb-0.5">Shared Secret Derivation</strong>
                                    Sender and Recipient can independently derive the same shared secret using ECDH: <code>S = r * A = a * R</code>.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <div className="text-sm text-gray-400">
                                    <strong className="text-purple-300 block mb-0.5">Stealth Address Construction</strong>
                                    The destination address P is constructed as <code>P = H(S) * G + B</code>. Only the owner of B can spend it.
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <CodeBlock
                            language="typescript"
                            code={`// Real ShadowWire SDK Usage
const stealth = await shadowWire.generateStealthAddress();

console.log({
  ephemeral: stealth.ephemeralPubkey, // Public
  stealth: stealth.stealthPubkey      // Public
});

// To prove ownership (Scanning):
const isMine = await shadowWire.checkOwnership(
  stealth.stealthPubkey, 
  stealth.ephemeralPubkey
);`}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
