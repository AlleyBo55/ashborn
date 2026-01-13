'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';
import { useState } from 'react';

const SkillCard = ({ icon: Icon, title, desc, delay, step }: { icon: any, title: string, desc: string, delay: number, step: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, type: "spring" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group perspective-1000"
        >
            {/* Card Container */}
            <motion.div
                className="relative bg-black/40 border-2 border-gray-800 p-8 flex flex-col items-center text-center gap-6 overflow-hidden backdrop-blur-md transition-all duration-300 group-hover:border-arise-blue/50 group-hover:bg-arise-blue/5 h-[350px] justify-between z-10 clip-path-polygon"
                animate={{
                    transform: isHovered ? "bg-arise-blue/10 scale(1.05)" : "scale(1)"
                }}
            >
                {/* Step Number Background */}
                <div className="absolute -top-4 -right-4 text-9xl font-black text-white/5 font-tech select-none group-hover:text-arise-blue/10 transition-colors">
                    {step}
                </div>

                {/* Icon with Energy Effect */}
                <div className="relative">
                    <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-arise-blue transition-colors z-10 relative">
                        <Icon className="w-10 h-10 text-gray-400 group-hover:text-arise-blue transition-colors" />
                    </div>
                    {/* Glow Ring */}
                    <motion.div
                        className="absolute inset-0 bg-arise-blue/20 blur-xl rounded-full"
                        animate={{ scale: isHovered ? 1.5 : 0.8, opacity: isHovered ? 1 : 0 }}
                    />
                </div>

                <div className="relative z-10">
                    <h3 className="font-manga text-3xl text-white uppercase italic tracking-wider mb-2 group-hover:text-arise-blue transition-colors text-shadow-glow">
                        <span className="text-arise-blue text-sm block font-mono tracking-widest mb-1 opacity-70">SKILL ACCESS</span>
                        {title}
                    </h3>
                    <p className="font-mono text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto group-hover:text-gray-300">
                        {desc}
                    </p>
                </div>

                {/* Unlock Button Mockup */}
                <div className="w-full h-1 bg-gray-800 mt-4 overflow-hidden rounded-full">
                    <motion.div
                        className="h-full bg-arise-blue shadow-[0_0_10px_#3b82f6]"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ delay: delay + 0.5, duration: 1.5 }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

const ConnectionLine = ({ delay }: { delay: number }) => (
    <div className="hidden md:flex absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 items-center justify-center pointer-events-none z-0">
        <svg className="w-full h-full" overflow="visible">
            <motion.path
                d="M 0 40 H 1000"
                stroke="#1f2937"
                strokeWidth="2"
                strokeDasharray="10 10"
                fill="none"
            />
            <motion.path
                d="M 0 40 H 1000"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: delay, ease: "easeInOut" }}
            />
        </svg>
    </div>
);

export default function SkillCombo() {
    return (
        <section className="py-32 w-full max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-24 relative z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                >
                    <h2 className="text-5xl md:text-7xl font-manga text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4 italic drop-shadow-lg">
                        COMBAT SEQUENCE
                    </h2>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-arise-blue to-transparent" />
                </motion.div>
                <p className="font-mono text-arise-blue mt-4 tracking-[0.3em] text-sm animate-pulse">INITIATING PRIVACY PROTOCOL...</p>
            </div>

            <div className="relative">
                {/* Animated Connecting Lines (Background) */}
                <div className="hidden md:block absolute top-[50%] left-[16%] right-[16%] h-[2px] bg-gray-800 -translate-y-1/2 z-0 overflow-hidden">
                    <motion.div
                        className="h-full w-full bg-arise-blue shadow-[0_0_15px_#3b82f6]"
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative z-10">
                    <SkillCard
                        icon={Shield}
                        title="VEIL"
                        desc="Construct a cryptographic barrier. Asset visibility reduced to zero."
                        delay={0.2}
                        step="01"
                    />

                    <SkillCard
                        icon={Zap}
                        title="SHADOW STEP"
                        desc="Transport value through the void. Leaving no footprints on the ledger."
                        delay={0.4}
                        step="02"
                    />

                    <SkillCard
                        icon={Lock}
                        title="DOMINION"
                        desc="Assert authority over your data. Reveal only what serves your purpose."
                        delay={0.6}
                        step="03"
                    />
                </div>
            </div>
        </section>
    );
}
