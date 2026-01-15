'use client';

import { motion } from 'framer-motion';
import { File02Icon, ViewOffIcon, Lock01Icon, Unlock01Icon, Database01Icon } from 'hugeicons-react';
import { useState } from 'react';

const DataLogEntry = ({
    id,
    timestamp,
    title,
    content,
    status = "decrypted"
}: {
    id: string;
    timestamp: string;
    title: string;
    content: string;
    status?: "decrypted" | "corrupted" | "encrypted";
}) => {
    return (
        <div className="border border-purple-900/30 bg-black/60 p-4 mb-2 font-mono text-sm relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            {status === "corrupted" && (
                <div className="absolute inset-0 bg-red-900/10 z-0 pointer-events-none mix-blend-overlay" />
            )}

            <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-2 border-b border-gray-800 pb-1">
                <span className="text-purple-400">LOG_ID: {id}</span>
                <span>TS: {timestamp}</span>
                <span className={`uppercase font-bold ${status === 'decrypted' ? 'text-green-500' :
                    status === 'corrupted' ? 'text-red-500 blink' : 'text-gray-500'
                    }`}>
                    [{status}]
                </span>
            </div>

            <div className="relative z-10">
                <h4 className="text-gray-200 font-bold mb-1 flex items-center gap-2">
                    {status === 'decrypted' ? <Unlock01Icon className="w-3 h-3 text-green-500" /> : <Lock01Icon className="w-3 h-3 text-red-500" />}
                    {title}
                </h4>
                <p className={`text-xs leading-relaxed ${status === 'corrupted' ? 'text-red-400/80 blur-[0.5px]' : 'text-gray-400'}`}>
                    {status === 'corrupted' ? 'ERROR: DATA_SEGMENT_MISSING // RECONSTRUCTION_FAILED' : content}
                </p>
            </div>
        </div>
    );
};

export default function MarketingWhy() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative w-full max-w-6xl mx-auto py-12 md:py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Visual: The Terminal */}
            <div className="relative order-2 md:order-1">
                <div className="absolute -inset-4 bg-purple-600/20 blur-2xl rounded-full opacity-20 animate-pulse" />

                <div className="relative bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-sm overflow-hidden shadow-2xl">
                    {/* Terminal Header */}
                    <div className="bg-purple-900/20 border-b border-purple-500/30 px-3 py-1 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] text-purple-300 font-mono">root@monarch-server:~/logs</span>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-black/90">
                        <div className="text-[10px] text-gray-500 font-mono mb-4">
                            &gt; decrypt_all --force <br />
                            &gt; <span className="text-green-500">Access Granted. Decrypting...</span>
                        </div>

                        <DataLogEntry
                            id="0x7A1"
                            timestamp="14:02:59"
                            title="THE_PUBLIC_LEDGER_PROBLEM"
                            content="Every transaction on Solana is visible. Wallet balances are open books. Your financial history is being scrapped by 14 separate tracking bots right now."
                        />
                        <DataLogEntry
                            id="0x7A2"
                            timestamp="14:03:01"
                            title="MEV_EXPLOITATION_VECTORS"
                            content="Traders are front-running your moves because your intent is broadcasted before execution. Slippage is not an accident; it is surveillance tax."
                        />
                        <DataLogEntry
                            id="0x7A3"
                            timestamp="14:03:05"
                            title="INSTITUTIONAL_DATA"
                            status="corrupted"
                            content=""
                        />
                        <DataLogEntry
                            id="0x7A4"
                            timestamp="14:04:12"
                            title="THE_SOLUTION_ARCHETYPE"
                            content="A shadow layer. ZK-SNARKs allow proof of validity without revealing the data. We do not hide the transaction; we blind the graph."
                        />

                        <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-purple-400 font-mono animate-pulse">
                            _cursor_active...
                        </div>
                    </div>
                </div>
            </div>

            {/* Narrative: The Reveal */}
            <div className="order-1 md:order-2 space-y-8">
                <div className="inline-block">
                    <div className="flex items-center gap-2 mb-2">
                        <Database01Icon className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">Decrypted Intelligence</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        THE TRUTH IS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">IN THE LOGS.</span>
                    </h2>
                </div>

                <div className="space-y-6 text-gray-400 font-sans leading-relaxed">
                    <p>
                        <strong className="text-white">Privacy is not a crime; it is a defense mechanism.</strong> Without it, every trade you make is a signal to your adversaries.
                    </p>
                    <p>
                        The Ashborn Protocol introduces a <span className="text-purple-300">Shadow Layer</span> to Solana. It is not a mixer. It is a mathematical shield using Zero-Knowledge proofs to verify integrity without leaking intent.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-purple-500/20 p-4 rounded bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-crosshair">
                        <ViewOffIcon className="w-6 h-6 text-purple-400 mb-2" />
                        <h3 className="text-sm font-bold text-white mb-1">Untraceable</h3>
                        <p className="text-xs text-gray-500">Graph analysis fails against ZK-proofs.</p>
                    </div>
                    <div className="border border-purple-500/20 p-4 rounded bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-crosshair">
                        <File02Icon className="w-6 h-6 text-purple-400 mb-2" />
                        <h3 className="text-sm font-bold text-white mb-1">Auditable</h3>
                        <p className="text-xs text-gray-500">Optional view keys for compliance.</p>
                    </div>
                </div>
            </div>

        </section>
    );
}
