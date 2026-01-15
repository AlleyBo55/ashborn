'use client';

import { motion } from 'framer-motion';
import { ArrowRight01Icon, Shield02Icon, GhostIcon } from 'hugeicons-react';
import SystemWindow from '@/components/ui/SystemWindow';

export default function Hero() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10 pt-20">

            {/* Anime Action Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-webtoon-army bg-cover bg-center opacity-60 mix-blend-overlay animate-pulse-slow" />
                <div className="absolute inset-0 bg-gradient-to-t from-monarch-black via-monarch-black/80 to-transparent" />
            </div>

            <div className="z-10 w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Action Text */}
                <div className="flex flex-col items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -100, skewX: 20 }}
                        animate={{ opacity: 1, x: 0, skewX: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    >
                        <h2 className="font-tech text-arise-blue tracking-[0.2em] mb-2 uppercase text-sm font-bold border-l-4 border-arise-blue pl-4">
                            Player Verification Complete
                        </h2>
                        <h1 className="text-8xl md:text-9xl font-manga text-white drop-shadow-[5px_5px_0px_#4c1d95] italic tracking-tighter leading-[0.8]">
                            ARISE.
                        </h1>
                        <h1 className="text-6xl md:text-7xl font-manga text-transparent bg-clip-text bg-gradient-to-r from-arise-blue to-white drop-shadow-lg italic tracking-tighter mt-2">
                            ASSERT<br />DOMINANCE.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 mt-8 text-xl font-medium max-w-lg border-l-2 border-gray-700 pl-6 leading-relaxed bg-black/40 p-4 backdrop-blur-sm"
                    >
                        The Shadows await your command. The <span className="text-arise-blue font-bold">Compliant Private Payment Protocol</span> is online.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="mt-10"
                    >
                        <button className="relative group px-10 py-5 bg-arise-blue text-white font-manga text-3xl uppercase tracking-widest overflow-hidden hover:scale-110 transition-transform duration-200 shadow-[0_0_30px_rgba(59,130,246,0.6)] clip-path-polygon">
                            <span className="relative z-10">Accept Quest</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-100" />
                        </button>
                    </motion.div>
                </div>

                {/* Right: System Window */}
                <SystemWindow title="PROTOCOL STATUS" delay={0.8} type="quest" className="w-full md:rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="space-y-6 font-mono text-sm">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="text-gray-400">STATUS</span>
                            <span className="text-green-400 font-bold animate-pulse">● ONLINE</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">PRIVACY SHIELD</span>
                                <span className="text-arise-blue font-bold">MAXIMUM</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-arise-blue w-full h-full animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">COMPLIANCE</span>
                                <span className="text-arise-blue font-bold">VERIFIED</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-arise-blue w-[85%] h-full" />
                            </div>
                        </div>

                        <div className="p-4 bg-arise-blue/10 border border-arise-blue/30 rounded mt-4">
                            <h4 className="font-bold text-arise-blue mb-1">OBJECTIVE:</h4>
                            <p className="text-gray-300">Transfer assets without detection. Prove compliance to the Rulers.</p>
                        </div>
                    </div>
                </SystemWindow>

            </div>
        </div>
    );
}
