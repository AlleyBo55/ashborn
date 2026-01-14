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

                {/* 2. Solana Core */}
                <div className="group relative p-2 rounded-full hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex flex-col gap-[2px]">
                        <div className="w-4 h-[2px] bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
                        <div className="w-4 h-[2px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
                        <div className="w-4 h-[2px] bg-gradient-to-r from-blue-500 to-green-400 rounded-full" />
                    </div>
                </div>

                {/* 3. Network Status */}
                <div className="group relative hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                    <Activity className="w-3 h-3 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-400 font-bold">MAINNET</span>
                        <span className="text-[8px] text-green-400">ONLINE</span>
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
