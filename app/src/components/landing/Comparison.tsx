'use client';

import { motion } from 'framer-motion';
import SystemWindow from '@/components/ui/SystemWindow';

const PowerBar = ({ label, value, color = "bg-arise-blue" }: { label: string, value: number, color?: string }) => (
    <div className="mb-4">
        <div className="flex justify-between text-xs font-mono mb-1 text-gray-400">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-4 bg-gray-900/50 rounded-sm overflow-hidden border border-gray-700 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-gray-800/30 h-full" />
                ))}
            </div>

            {/* Bar */}
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`h-full ${color} relative z-10`}
            >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </motion.div>
        </div>
    </div>
);

const StatComparison = ({ title, ashbornValue, tornadoValue }: { title: string, ashbornValue: number, tornadoValue: number }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
            <PowerBar label={`ASHBORN [${title}]`} value={ashbornValue} color="bg-arise-blue" />
        </div>
        <div>
            <PowerBar label={`TORNADO [${title}]`} value={tornadoValue} color="bg-red-600" />
        </div>
    </div>
);

export default function Comparison() {
    return (
        <section className="py-24 w-full max-w-6xl mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
            >
                <h2 className="text-6xl font-manga text-white mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] italic">SYSTEM ANALYSIS</h2>
                <p className="font-mono text-arise-blue tracking-widest text-sm">COMPARING ENTITY POWERS</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Ashborn Stats */}
                <SystemWindow title="ENTITY: ASHBORN" type="quest">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-arise-blue/20 border-2 border-arise-blue rounded flex items-center justify-center">
                                <span className="text-4xl">👑</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-manga text-white italic">SHADOW MONARCH</h3>
                                <p className="text-xs font-mono text-arise-blue">CLASS: SSS-RANK</p>
                            </div>
                        </div>

                        <PowerBar label="PRIVACY LEVEL" value={100} />
                        <PowerBar label="COMPLIANCE (RANGE PROOFS)" value={100} />
                        <PowerBar label="STEALTH (PUSH TRANSFERS)" value={100} />
                        <PowerBar label="NFT CAPABILITY" value={100} />
                    </div>
                </SystemWindow>

                {/* Tornado Stats */}
                <SystemWindow title="ENTITY: TORNADO" type="alert" delay={0.2}>
                    <div className="space-y-6 opacity-80">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500 rounded flex items-center justify-center grayscale">
                                <span className="text-4xl">🌪️</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-manga text-red-500 italic">OLD MIXER</h3>
                                <p className="text-xs font-mono text-red-400">CLASS: B-RANK</p>
                            </div>
                        </div>

                        <PowerBar label="PRIVACY LEVEL" value={85} color="bg-red-600" />
                        <PowerBar label="COMPLIANCE" value={0} color="bg-red-900" />
                        <PowerBar label="STEALTH" value={20} color="bg-red-800" />
                        <PowerBar label="NFT CAPABILITY" value={0} color="bg-red-900" />
                    </div>
                </SystemWindow>
            </div>
        </section>
    );
}
