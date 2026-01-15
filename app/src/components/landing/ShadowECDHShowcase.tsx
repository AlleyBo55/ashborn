'use client';

import { motion } from 'framer-motion';
import { ViewOffIcon, Key01Icon, LockIcon, Shield02Icon, FlashIcon } from 'hugeicons-react';
import { useState, useEffect } from 'react';

export default function ShadowECDHShowcase() {
    const [step, setStep] = useState(0);

    // Auto-play formula visualization
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        { label: "Exchange Keys", formula: "A, B (Public Keys)", desc: "Recipient publishes view (A) & spend (B) keys." },
        { label: "Derive Secret", formula: "S = r * A", desc: "Sender computes shared secret (Diffie-Hellman)." },
        { label: "Hash & Blind", formula: "P = H(S)*G + B", desc: "Sender blinds the address. Only recipient can unblind." },
        { label: "The Reveal", formula: "p = H(S) + b", desc: '"Arise." Recipient recovers private key.' }
    ];

    return (
        <section className="relative py-24 bg-black overflow-hidden border-y border-purple-900/20">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: The Narrative */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-wider"
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            Vitalik&apos;s Stealth Addresses
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-white"
                        >
                            THE SHADOWS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                MOVE UNSEEN.
                            </span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-invert prose-lg text-gray-400 leading-relaxed"
                        >
                            <p>
                                True privacy is not about hiding the transaction, but hiding the <em className="text-white not-italic font-semibold">participants</em>.
                                Ashborn implements <strong>Elliptic Curve Diffie-Hellman (ECDH)</strong> to generate comprehensive stealth addresses.
                            </p>
                            <blockquote className="border-l-4 border-purple-500 pl-4 py-1 italic text-purple-200/80 bg-purple-900/10 pr-2 rounded-r">
                                &quot;Exchange keys in the dark. Your identity remains hidden while the transaction is verified by the light.&quot;
                            </blockquote>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                <LockIcon className="w-5 h-5 text-green-400" />
                                <div className="text-sm">
                                    <div className="text-white font-semibold">Unlinkable</div>
                                    <div className="text-gray-500 text-xs">P ≠ A (Observers blind)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                <ViewOffIcon className="w-5 h-5 text-purple-400" />
                                <div className="text-sm">
                                    <div className="text-white font-semibold">Non-Interactive</div>
                                    <div className="text-gray-500 text-xs">Sender generates alone</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: The Math / Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30" />

                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2 text-sm font-mono text-gray-500">
                                    <Shield02Icon className="w-4 h-4" />
                                    <span>PROTOCOL::ECDH_V1</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                            </div>

                            {/* Dynamic Formula Display */}
                            <div className="mb-8 h-32 flex items-center justify-center relative bg-black/50 rounded-xl border border-white/5">
                                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20" />
                                <div className="text-center z-10 px-4">
                                    <span className="text-xs font-mono text-purple-400 mb-2 block uppercase tracking-widest">
                                        Step {step + 1}: {steps[step].label}
                                    </span>
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight"
                                    >
                                        {steps[step].formula}
                                    </motion.div>
                                    <motion.p
                                        key={`desc-${step}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-gray-500 mt-2 font-mono"
                                    >
                                        {steps[step].desc}
                                    </motion.p>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 h-1 bg-purple-500/50 transition-all duration-300 ease-linear" style={{ width: `${(step + 1) * 25}%` }} />
                            </div>

                            {/* Code Snippet */}
                            <div className="font-mono text-xs md:text-sm text-gray-300 bg-black/30 p-4 rounded-lg border border-white/5 relative group">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 bg-white/10 px-2 py-1 rounded">
                                    TypeScript SDK
                                </div>
                                <div className="space-y-1">
                                    <div><span className="text-gray-500">{'// 1. Recipient generates meta-keys'}</span></div>
                                    <div><span className="text-purple-400">const</span> meta = <span className="text-blue-400">shadowWire</span>.generateStealthMetaAddress();</div>
                                    <div className="h-2" />
                                    <div><span className="text-gray-500">{'// 2. Sender computes stealth dest (ECDH)'}</span></div>
                                    <div><span className="text-purple-400">const</span> {'{'} stealthPubkey {'}'} = <span className="text-blue-400">shadowWire</span>.generateStealthAddress(</div>
                                    <div className="pl-4">meta.viewKey, meta.spendKey</div>
                                    <div>);</div>
                                    <div className="h-2" />
                                    <div><span className="text-gray-500">{'// 3. "Arise" - Funds are claimed'}</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
