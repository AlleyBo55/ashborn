'use client';

import { motion } from 'framer-motion';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import AiChat02Icon from 'hugeicons-react/dist/esm/icons/ai_chat_02_icon';
import Link from 'next/link';

const integrations = [
    { name: 'Ashborn', color: 'red', emoji: '🔥', role: 'Privacy Relay' },
    { name: 'PrivacyCash', color: 'blue', emoji: '🛡️', role: 'Shield Pool' },
    { name: 'Light Protocol', color: 'green', emoji: '⚡', role: 'ZK Compress' },
    { name: 'x402 Paywall', color: 'amber', emoji: '💳', role: 'Micropay' },
];

const benefits = [
    { title: 'Composable Privacy Layers', desc: 'Toggle between Ashborn Native (Layer 1) or stack PrivacyCash (Layer 2) for maximum anonymity.' },
    { title: 'Native Stealth + ZK', desc: 'Built-in ECDH stealth addresses and Groth16 proofs ensure instant, private settlements.' },
    { title: 'AI-to-AI Commerce', desc: 'Autonomous agents transact freely without exposing strategies or wallet linkages.' },
];

export default function ShadowAgentHighlight() {
    return (
        <section className="relative w-full max-w-6xl mx-auto py-16 md:py-24 px-6">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <span className="inline-flex items-center gap-2 text-xs font-mono bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full border border-purple-500/20">
                        <SparklesIcon className="w-4 h-4" />
                        NEW: SHADOW AGENT PROTOCOL
                    </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-6">
                        <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Private </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x">
                            AI-to-AI Commerce
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
                        Two AI agents transact privately. Featuring composable privacy depths: use Ashborn Native for speed
                        and stealth, or stack PrivacyCash for pool-based anonymity.
                    </p>
                </motion.div>

                {/* AI Personas Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-16 relative"
                >
                    {/* The Architect (Tilt Card) */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
                        className="relative group cursor-default"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative flex items-center gap-4 px-8 py-6 bg-[#0A0A0A] border border-blue-500/30 rounded-2xl backdrop-blur-xl">
                            <span className="text-5xl drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🏛️</span>
                            <div>
                                <h4 className="font-bold text-xl text-blue-300 font-mono tracking-wide">THE ARCHITECT</h4>
                                <p className="text-xs text-blue-400/60 uppercase tracking-widest">AI Buyer Node</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animated Flow */}
                    <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="hidden md:flex items-center gap-0">
                            <div className="w-16 h-[2px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-purple-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/50 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-black border border-gray-800 text-[10px] font-mono text-gray-400 flex items-center gap-2 shadow-xl">
                                <Shield02Icon className="w-3 h-3 text-green-400" />
                                <span>ZERO-KNOWLEDGE</span>
                            </div>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500/10 via-purple-500/50 to-purple-500/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/50 w-full h-full -translate-x-full animate-[shimmer_2s_infinite_0.5s]"></div>
                            </div>
                        </div>
                        <ArrowRight01Icon className="w-5 h-5 text-gray-600 rotate-90 md:rotate-0 animate-pulse" />
                    </div>

                    {/* Tower of Trials (Tilt Card) */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotateY: -5, rotateX: -5 }}
                        className="relative group cursor-default"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative flex items-center gap-4 px-8 py-6 bg-[#0A0A0A] border border-purple-500/30 rounded-2xl backdrop-blur-xl">
                            <span className="text-5xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🗼</span>
                            <div>
                                <h4 className="font-bold text-xl text-purple-300 font-mono tracking-wide">TOWER OF TRIALS</h4>
                                <p className="text-xs text-purple-400/60 uppercase tracking-widest">AI Oracle Node</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Integrations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    {integrations.map((int) => (
                        <span
                            key={int.name}
                            className={`text-xs font-mono px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${int.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                int.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    int.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        int.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}
                        >
                            <span>{int.emoji}</span>
                            <span>{int.name}</span>
                            <span className="text-[9px] opacity-60">({int.role})</span>
                        </span>
                    ))}
                </motion.div>

                {/* Benefits Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-3 gap-4 mb-10"
                >
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            className="p-5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-purple-500/20 transition-colors"
                        >
                            <h4 className="font-semibold text-white mb-1 text-sm">{b.title}</h4>
                            <p className="text-xs text-gray-500">{b.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Link
                        href="/demo/shadow-agent"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(147,51,234,0.3)]"
                    >
                        <AiChat02Icon className="w-5 h-5" />
                        Try Shadow Agent Demo
                        <ArrowRight01Icon className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
