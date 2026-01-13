'use client';

import { motion } from 'framer-motion';

export default function PoweredBySolana() {
    return (
        <footer className="relative w-full py-20 overflow-hidden border-t border-purple-900/30 bg-black/90 backdrop-blur-md">
            {/* Ambient Glow from bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="relative z-10 flex flex-col items-center justify-center gap-6">

                {/* 1. The Energy Core (Solana Logo Interpretation) */}
                <div className="relative group cursor-pointer">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <div className="relative bg-black border border-purple-500/50 px-8 py-3 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300">
                        {/* Solana Animated Icon */}
                        <div className="flex flex-col gap-[2px]">
                            <motion.div
                                animate={{ x: [0, 2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-6 h-[2px] bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                            />
                            <motion.div
                                animate={{ x: [0, -2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                                className="w-6 h-[2px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                            />
                            <motion.div
                                animate={{ x: [0, 2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                                className="w-6 h-[2px] bg-gradient-to-r from-blue-500 to-green-400 rounded-full"
                            />
                        </div>

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-bold tracking-widest text-sm group-hover:text-white transition-colors">
                            POWERED BY SOLANA
                        </span>
                    </div>
                </div>

                {/* 2. System Status Footer */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] text-gray-600 font-mono tracking-widest uppercase mt-4 px-4 text-center">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Network: Mainnet-Beta
                    </span>
                    <span>TPS: 4,291</span>
                    <span>Block: #291,012,491</span>
                </div>

                <p className="text-[10px] text-gray-700 font-mono mt-8">
                    ASHBORN PROTOCOL © 2026. &quot;I ALONE LEVEL UP.&quot;
                </p>
            </div>

            {/* Grid Overlay on Footer */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        </footer>
    );
}
