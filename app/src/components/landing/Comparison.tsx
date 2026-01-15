'use client';

import { motion } from 'framer-motion';
import { Target01Icon, LockIcon, SecurityValidationIcon, CancelCircleIcon, CheckmarkCircle01Icon } from 'hugeicons-react';

const StatBar = ({ label, valueA, valueB, colorA = "bg-red-500", colorB = "bg-green-500" }: { label: string, valueA: number, valueB: number, colorA?: string, colorB?: string }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between text-[10px] uppercase font-mono text-gray-500 mb-1">
                <span>{label}</span>
                <span className="text-gray-700">DELTA: {valueB - valueA}%</span>
            </div>
            <div className="flex gap-2 h-2">
                <div className="flex-1 bg-gray-900 relative rounded-sm overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${valueA}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${colorA} opacity-60`}
                    />
                </div>
                <div className="flex-1 bg-gray-900 relative rounded-sm overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${valueB}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${colorB}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Comparison() {
    return (
        <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12">

            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-red-500 tracking-widest border border-red-900/50 px-3 py-1 rounded bg-red-950/20 mb-4">
                    <Target01Icon className="w-3 h-3 animate-pulse" />
                    TARGET ANALYSIS
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
                    ASHBORN <span className="text-gray-600">VS</span> <span className="text-red-500 line-through decoration-2 decoration-red-600">THE OTHERS</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 border border-gray-800 bg-black/60 backdrop-blur-sm relative">

                {/* 1. The Enemy (Traditional Mixers) */}
                <div className="p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-900/5 z-0" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-red-950/50 border border-red-900 rounded">
                                <SecurityValidationIcon className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-red-500 uppercase">Legacy Mixers</h3>
                                <div className="text-[10px] text-red-800 font-mono">THREAT_LEVEL: HIGH</div>
                            </div>
                        </div>

                        <ul className="space-y-4 font-mono text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <CancelCircleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span><strong className="text-red-400">Non-Compliant:</strong> Instant blacklisting by exchanges.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CancelCircleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span><strong className="text-red-400">Public Pool:</strong> Tainted funds mix with yours.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CancelCircleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span><strong className="text-red-400">High Latency:</strong> Hours to settle.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 2. Ashborn (The Monarch) */}
                <div className="p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-green-900/10 to-transparent border-t md:border-t-0 md:border-l border-gray-800">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-green-950/50 border border-green-900 rounded">
                                <LockIcon className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-500 uppercase">Ashborn Protocol</h3>
                                <div className="text-[10px] text-green-800 font-mono">CLEARANCE: SOVEREIGN</div>
                            </div>
                        </div>

                        <ul className="space-y-4 font-mono text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <CheckmarkCircle01Icon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span><strong className="text-green-400">Audit-Ready:</strong> Prove innocence with view keys.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckmarkCircle01Icon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span><strong className="text-green-400">Sovereign Pool:</strong> ZK-math separates good/bad actors.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckmarkCircle01Icon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span><strong className="text-green-400">Instant Finality:</strong> Solana speed (400ms).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Center "VS" Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-gray-700 w-12 h-12 rounded-full flex items-center justify-center z-20 shadow-xl hidden md:flex">
                    <span className="font-black italic text-gray-500 text-xs">VS</span>
                </div>
            </div>

            {/* Bottom Stats Comparison */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatBar label="PRIVACY SCORE" valueA={20} valueB={100} />
                <StatBar label="COMPLIANCE" valueA={0} valueB={100} />
                <StatBar label="SPEED" valueA={10} valueB={95} />
            </div>

        </section>
    );
}
