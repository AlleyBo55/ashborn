'use client';

import { motion } from 'framer-motion';
import { Shield02Icon, LockIcon, FlashIcon, ViewOffIcon, ArrowRight01Icon } from 'hugeicons-react';

export default function PrivacyRelayShowcase() {
    return (
        <section className="relative w-full py-20 overflow-hidden bg-black/40 border-y border-white/5">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-red-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Hard Sell Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-px w-8 bg-red-500/50"></span>
                            <span className="text-red-500 font-mono text-xs tracking-[0.2em] uppercase font-bold">Protocol-Level Anonymity</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-[0.9]">
                            THE WORLD KNOWS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                NOTHING.
                            </span>
                        </h2>

                        <blockquote className="border-l-2 border-red-500 pl-4 py-2 my-6 italic text-gray-400 text-sm font-mono leading-relaxed">
                            &quot;I shall protect my family, even if it means turning the entire world against me.<br />
                            There is no need for words among shadows.&quot;<br />
                            <span className="text-red-500 font-bold not-italic mt-1 block">— The Shadow Monarch</span>
                        </blockquote>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                            Stop exposing your identity to every protocol you touch.
                            <br /><br />
                            With <strong className="text-white">Ashborn Shadow Relay</strong>, the underlying protocols never know you exist.
                            To PrivacyCash, Radr Labs, and the world—you are a ghost.
                            <br /><br />
                            <span className="text-red-400 font-medium">Only the Shadow Monarch knows the truth.</span>
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                "Protocols see 'Ashborn Relay' instead of You",
                                "K-Anonymity Amplified (User Pool + Relay Pool)",
                                "ZK Proofs without Identity Leakage",
                                "Zero Metadata (IP/User-Agent Stripped)"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-lg"
                                >
                                    <ViewOffIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-300 font-mono">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Architecture Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative z-10 bg-[#050505] border border-white/10 rounded-2xl p-8 shadow-2xl">

                            {/* Diagram */}
                            <div className="space-y-4 font-mono text-xs">
                                {/* YOU */}
                                <div className="flex items-center gap-4 group">
                                    <div className="w-24 text-right text-gray-500 group-hover:text-white transition-colors">YOU</div>
                                    <div className="flex-1 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center px-4 text-blue-400">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Private Intent</span>
                                    </div>
                                    <div className="w-24 text-gray-600 text-[10px] text-right">Invisible</div>
                                </div>

                                {/* Arrow */}
                                <div className="flex justify-center my-2">
                                    <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-red-500/50"></div>
                                </div>

                                {/* RELAY */}
                                <div className="flex items-center gap-4 relative">
                                    <div className="absolute -inset-2 bg-red-500/5 blur-xl rounded-full"></div>
                                    <div className="w-24 text-right text-red-500 font-bold">RELAY</div>
                                    <div className="flex-1 h-20 bg-red-900/10 border border-red-500/30 rounded-xl flex items-center justify-center flex-col gap-2 p-4 text-center">
                                        <Shield02Icon className="w-6 h-6 text-red-500" />
                                        <span className="text-red-200">Ashborn Omnibus</span>
                                    </div>
                                    <div className="w-24"></div>
                                </div>

                                {/* Arrow Split */}
                                <div className="flex justify-center gap-20 my-2">
                                    <div className="w-px h-8 bg-red-500/50 -rotate-12 transform origin-top"></div>
                                    <div className="w-px h-8 bg-red-500/50 rotate-12 transform origin-top"></div>
                                </div>

                                {/* PROTOCOLS */}
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-lg text-center">
                                        <div className="text-gray-500 mb-1">PrivacyCash</div>
                                        <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded inline-block">
                                            Sees: "Ashborn"
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-lg text-center">
                                        <div className="text-gray-500 mb-1">Radr Labs</div>
                                        <div className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                                            Sees: "Ashborn"
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Decorative elements behind */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-[50px] animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] animate-pulse delay-700" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
