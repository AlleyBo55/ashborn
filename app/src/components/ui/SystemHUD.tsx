'use client';

import { motion } from 'framer-motion';
import { Activity, Shield, Wifi, Database, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SystemHUD() {
    const [logs, setLogs] = useState<string[]>([
        "SYSTEM_BOOT_SEQUENCE_INIT...",
        "LOADING_SHADOW_ASSETS...",
        "CONNECTING_TO_SOLANA_MAINNET..."
    ]);

    useEffect(() => {
        const messages = [
            "ZK_PROOF_GENERATED",
            "RELAYER_NODE_FOUND",
            "ENCRYPTING_MEMO...",
            "COMPLIANCE_KEY_ROTATED",
            "ANOMALY_DETECTED: 0",
            "LATENCY: 14ms"
        ];

        const interval = setInterval(() => {
            setLogs(prev => {
                const msg = messages[Math.floor(Math.random() * messages.length)];
                const time = new Date().toLocaleTimeString('en-US', { hour12: false });
                return [`[${time}] ${msg}`, ...prev.slice(0, 4)];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-40 pointer-events-none w-full h-full max-w-[1920px] mx-auto hidden lg:block">

            {/* TOP LEFT: PLAYER STATS (HP/MP) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-24 left-8 w-64 space-y-2 font-mono text-xs"
            >
                {/* NAME */}
                <div className="flex justify-between text-arise-blue font-bold tracking-widest border-b border-arise-blue/30 pb-1">
                    <span>PLAYER: ASHBORN</span>
                    <span>LVL. MAX</span>
                </div>

                {/* HP BAR (Privacy) */}
                <div className="flex items-center gap-2">
                    <span className="w-8 text-gray-400">HP</span>
                    <div className="flex-1 h-3 bg-gray-900 border border-gray-700 skew-x-[-20deg] relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-600/80 w-full" />
                        <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-ping2" />
                    </div>
                    <span className="text-red-400">100%</span>
                </div>

                {/* MP BAR (Compliance) */}
                <div className="flex items-center gap-2">
                    <span className="w-8 text-gray-400">MP</span>
                    <div className="flex-1 h-3 bg-gray-900 border border-gray-700 skew-x-[-20deg] relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/80 w-[100%]" />
                        <div className="absolute top-0 right-0 h-full w-1 bg-white/50 animate-ping2" />
                    </div>
                    <span className="text-blue-400">INF</span>
                </div>
            </motion.div>


            {/* TOP RIGHT: QUEST LOG */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-24 right-8 w-64 bg-black/40 backdrop-blur-sm border-l-2 border-arise-blue p-4 font-mono text-xs"
            >
                <div className="flex items-center gap-2 text-arise-blue font-bold mb-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    ACTIVE QUEST
                </div>
                <div className="text-white mb-1">PROTECT THE LEDGER</div>
                <div className="text-gray-400 mb-4">Transfer assets without triggering public surveillance.</div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-green-400">
                        <span className="w-3 h-3 border border-green-500 flex items-center justify-center text-[8px]">✓</span>
                        Initialize Protocol
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-3 h-3 border border-gray-500" />
                        Explore Features
                    </div>
                </div>
            </motion.div>


            {/* BOTTOM LEFT: SYSTEM CONSOLE */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-10 left-8 w-80 font-mono text-[10px] text-arise-blue/80"
            >
                <div className="flex items-center gap-2 border-b border-arise-blue/30 pb-1 mb-2">
                    <Terminal className="w-3 h-3" />
                    SYSTEM LOGS
                </div>
                <div className="space-y-1 mask-linear-fade h-24 overflow-hidden flex flex-col-reverse">
                    {logs.map((log, i) => (
                        <div key={i} className="opacity-70">{log}</div>
                    ))}
                </div>
            </motion.div>

            {/* BOTTOM RIGHT: MINI-MAP (RADAR) */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute bottom-10 right-8 w-32 h-32 rounded-full border border-arise-blue/50 bg-black/60 relative overflow-hidden flex items-center justify-center"
            >
                {/* Radar Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-arise-blue/20 to-transparent animate-spin-slow" />
                <div className="w-1 h-1 bg-arise-blue rounded-full shadow-[0_0_10px_#3b82f6]" />

                {/* Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(59,130,246,0.3)_21%,transparent_22%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(59,130,246,0.3)_61%,transparent_62%)]" />
            </motion.div>

        </div>
    );
}
