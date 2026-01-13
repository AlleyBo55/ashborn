'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Eye, Lock } from 'lucide-react';
import SystemWindow from '@/components/ui/SystemWindow';

export default function SystemWarning() {
    return (
        <section className="py-20 w-full max-w-4xl mx-auto px-4">
            <SystemWindow title="EMERGENCY ALERT" type="alert">
                <div className="flex flex-col items-center text-center space-y-6">

                    {/* Pulsing Warning Sign */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-red-500"
                    >
                        <AlertTriangle className="w-20 h-20" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-manga text-red-500 uppercase glitch-text">
                        HOSTILE ENTITIES DETECTED
                    </h2>

                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg max-w-2xl w-full">
                        <p className="font-mono text-red-500/80 mb-2">SCANNING PUBLIC LEDGER...</p>

                        <div className="space-y-3 font-mono text-sm text-left">
                            <div className="flex justify-between border-b border-red-900/50 pb-1">
                                <span className="text-gray-400">THREAT: COMPETITORS</span>
                                <span className="text-red-500 animate-pulse">TRACKING WALLET...</span>
                            </div>
                            <div className="flex justify-between border-b border-red-900/50 pb-1">
                                <span className="text-gray-400">THREAT: MEV BOTS</span>
                                <span className="text-red-500 animate-pulse">DRAINING ALPHA...</span>
                            </div>
                            <div className="flex justify-between border-b border-red-900/50 pb-1">
                                <span className="text-gray-400">THREAT: SURVEILLANCE</span>
                                <span className="text-red-500 animate-pulse">LOGGING TXS...</span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-white font-tech">RECOMMENDED ACTION:</p>
                        <div className="flex items-center gap-2 text-arise-blue font-bold text-xl uppercase tracking-widest border border-arise-blue px-4 py-2 rounded bg-arise-blue/10">
                            <Lock className="w-5 h-5" /> Initiate Protocol "Ashborn"
                        </div>
                    </motion.div>

                </div>
            </SystemWindow>
        </section>
    );
}
