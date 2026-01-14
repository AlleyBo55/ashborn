'use client';

import { motion } from 'framer-motion';
import { Activity, Globe, Cpu } from 'lucide-react';

export default function PoweredBySolana() {
    return (
        <footer className="relative w-full py-24 flex justify-center items-end overflow-hidden">

            {/* Gradient Ambience */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            {/* The Dock */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 flex items-center gap-2 md:gap-4 px-4 py-3 bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
                {/* 1. Protocol Identity */}
                <div className="group relative flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
                    <span className="text-xs font-bold text-white tracking-widest px-2">ASHBORN</span>
                    <div className="absolute -bottom-1 w-1 h-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-white/10" />

                {/* 2. Solana Core (Real Logo) */}
                <div className="group relative p-2 rounded-full hover:-translate-y-2 transition-transform duration-300">
                    <svg className="w-8 h-8 md:w-8 md:h-8" width="397" height="311" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solana_paint0_linear)" />
                        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana_paint1_linear)" />
                        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana_paint2_linear)" />
                        <defs>
                            <linearGradient id="solana_paint0_linear" x1="0" y1="0" x2="397" y2="311" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9945FF" />
                                <stop offset="1" stopColor="#14F195" />
                            </linearGradient>
                            <linearGradient id="solana_paint1_linear" x1="0" y1="0" x2="397" y2="311" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9945FF" />
                                <stop offset="1" stopColor="#14F195" />
                            </linearGradient>
                            <linearGradient id="solana_paint2_linear" x1="0" y1="0" x2="397" y2="311" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9945FF" />
                                <stop offset="1" stopColor="#14F195" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* 3. Network Status */}
                <div className="group relative hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                    <Activity className="w-3 h-3 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-400 font-bold">DEVNET</span>
                        <span className="text-[8px] text-green-400">ONLINE</span>
                    </div>
                </div>

                <div className="group relative hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                    <Globe className="w-3 h-3 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-400 font-bold">MAINNET</span>
                        <span className="text-[8px] text-gray-500">SOON</span>
                    </div>
                </div>

                {/* 4. TPS Widget */}
                <div className="group relative hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                    <Cpu className="w-3 h-3 text-blue-500" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-400 font-bold">TPS</span>
                        <span className="text-[8px] text-blue-400">4,291</span>
                    </div>
                </div>

                {/* Separator */}
                <div className="hidden md:block w-px h-6 bg-white/10" />

                {/* Copyright */}
                <div className="group relative p-2 rounded-full hover:-translate-y-2 transition-transform duration-300 cursor-default">
                    <span className="text-[10px] text-gray-500 font-medium">© 2026</span>
                </div>

            </motion.div>
        </footer>
    );
}
