'use client';

import { motion } from 'framer-motion';
import ViewOffIcon from 'hugeicons-react/dist/esm/icons/view_off_icon';
import LockIcon from 'hugeicons-react/dist/esm/icons/lock_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import { useState, useEffect } from 'react';

export default function ShadowECDHShowcase() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        { label: "Keys", formula: "A, B", desc: "Recipient publishes keys." },
        { label: "Secret", formula: "S = r * A", desc: "Shared secret (DH)." },
        { label: "Blind", formula: "P = H(S)*G + B", desc: "Sender blinds address." },
        { label: "Reveal", formula: "p = H(S) + b", desc: 'Recipient recovers key.' }
    ];

    return (
        <section className="relative py-12 sm:py-24 bg-black border-y border-purple-900/20">

            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase"
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            <span>STEALTH</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight"
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
                            className="text-gray-400 space-y-3 text-xs sm:text-sm max-w-prose"
                        >
                            <p className="line-clamp-2 break-words">
                                Privacy hides <em className="text-white font-semibold">participants</em>, not transactions.
                                Ashborn uses <strong>ECDH</strong> for stealth.
                            </p>
                            <blockquote className="border-l-4 border-purple-500 pl-2 py-2 italic text-purple-200/80 bg-purple-900/10 pr-2 rounded-r text-[10px] line-clamp-2 break-words">
                                &quot;Keys in dark. Identity hidden.&quot;
                            </blockquote>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-2"
                        >
                            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/5 border border-white/10">
                                <LockIcon className="w-4 h-4 text-green-400" />
                                <div className="text-xs">
                                    <div className="text-white font-semibold">Unlinkable</div>
                                    <div className="text-gray-500 text-[10px]">P ≠ A</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/5 border border-white/10">
                                <ViewOffIcon className="w-4 h-4 text-purple-400" />
                                <div className="text-xs">
                                    <div className="text-white font-semibold">Non-Interactive</div>
                                    <div className="text-gray-500 text-[10px]">Solo</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30" />

                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                    <Shield02Icon className="w-4 h-4" />
                                    <span>ECDH_V1</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                            </div>

                            <div className="mb-6 h-32 flex items-center justify-center relative bg-black/50 rounded-xl border border-white/5 overflow-hidden">

                                <div className="text-center z-10 px-2 w-full">
                                    <span className="text-[10px] font-mono text-purple-400 mb-2 block uppercase">
                                        Step {step + 1}: {steps[step].label}
                                    </span>
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-base sm:text-xl lg:text-2xl font-mono font-bold text-white break-all px-2"
                                    >
                                        {steps[step].formula}
                                    </motion.div>
                                    <motion.p
                                        key={`desc-${step}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] text-gray-500 mt-2 font-mono px-2"
                                    >
                                        {steps[step].desc}
                                    </motion.p>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1 bg-purple-500/50 transition-all duration-300" style={{ width: `${(step + 1) * 25}%` }} />
                            </div>

                            <div className="font-mono text-xs text-gray-300 bg-black/30 p-3 rounded-lg border border-white/5 overflow-x-auto">
                                <div className="space-y-1 min-w-max">
                                    <div><span className="text-gray-500">{'// 1. Gen keys'}</span></div>
                                    <div><span className="text-purple-400">const</span> meta = <span className="text-blue-400">shadowWire</span>.genMeta();</div>
                                    <div className="h-2" />
                                    <div><span className="text-gray-500">{'// 2. Stealth (ECDH)'}</span></div>
                                    <div><span className="text-purple-400">const</span> {'{'} stealthPubkey {'}'} = <span className="text-blue-400">shadowWire</span>.genStealth(</div>
                                    <div className="pl-4">meta.viewKey, meta.spendKey</div>
                                    <div>);</div>
                                    <div className="h-2" />
                                    <div><span className="text-gray-500">{'// 3. Claim'}</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
