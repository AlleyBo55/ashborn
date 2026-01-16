'use client';

import { motion } from 'framer-motion';
import ViewIcon from 'hugeicons-react/dist/esm/icons/view_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';

export default function SystemWarning() {
    return (
        <section className="relative w-full max-w-4xl mx-auto py-32 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="relative bg-red-950/20 border-2 border-red-600/50 p-1 overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

                <div className="relative bg-black/80 backdrop-blur-md border border-red-500/30 p-8 md:p-12 text-center overflow-hidden group">

                    <div className="absolute top-0 left-0 w-full bg-red-600/20 border-b border-red-500/50 py-1 flex items-center justify-center gap-2 overflow-hidden">
                        <div className="flex gap-4 animate-marquee whitespace-nowrap text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase">
                            <span>⚠ CRITICAL THREAT DETECTED</span>
                            <span>{'///'}</span>
                            <span>SURVEILLANCE_LEVEL: MAXIMUM</span>
                            <span>{'///'}</span>
                            <span>IMMEDIATE_ACTION_REQUIRED</span>
                            <span>{'///'}</span>
                            <span>⚠ CRITICAL THREAT DETECTED</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-6 relative z-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
                            <Shield02Icon className="w-16 h-16 text-red-500 relative z-10" />
                            <ViewIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black animate-ping opacity-50" />
                        </div>

                        <div className="space-y-4 max-w-2xl px-2">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] break-words">
                                YOUR FINANCIAL DATA IS <span className="text-red-500 bg-red-950/30 px-1 sm:px-2 glitch-text">EXPOSED</span>
                            </h2>
                            <p className="text-gray-400 font-mono text-xs md:text-sm tracking-wide leading-relaxed">
                                <span className="text-red-400 font-bold">WARNING:</span> Every transaction you make on Solana represents a permanent, public record.
                                Competitors, bad actors, and surveillance systems are actively indexing your wallet activity.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-px bg-red-900/30 border border-red-900/50 w-full max-w-lg mt-4">
                            <div className="bg-black/80 p-3 md:p-4 flex flex-col items-center hover:bg-red-900/10 transition-colors">
                                <span className="text-red-500 font-bold text-xl md:text-2xl font-mono">100%</span>
                                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">Visibility</span>
                            </div>
                            <div className="bg-black/80 p-3 md:p-4 flex flex-col items-center hover:bg-red-900/10 transition-colors">
                                <span className="text-red-500 font-bold text-xl md:text-2xl font-mono">0</span>
                                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">Privacy</span>
                            </div>
                            <div className="bg-black/80 p-3 md:p-4 flex flex-col items-center hover:bg-red-900/10 transition-colors">
                                <span className="text-red-500 font-bold text-lg md:text-2xl font-mono">FOREVER</span>
                                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">Retention</span>
                            </div>
                        </div>

                    </div>

                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
                </div>
            </motion.div>
        </section>
    );
}
