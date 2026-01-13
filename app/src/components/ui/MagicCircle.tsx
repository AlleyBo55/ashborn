'use client';

import { motion } from 'framer-motion';

export default function MagicCircle() {
    return (
        <div className="relative w-[150vh] h-[150vh] flex items-center justify-center opacity-30 pointer-events-none mix-blend-screen">

            {/* OUTER RING (Slow Rotate) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-purple-500/30 rounded-full flex items-center justify-center"
            >
                <div className="absolute inset-2 border-[1px] border-dashed border-purple-500/20 rounded-full" />
                {/* Simulated Runes (CSS Blocks) */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 w-2 h-8 bg-purple-500/40"
                        style={{
                            left: '50%',
                            transformOrigin: '0 75vh',
                            transform: `rotate(${i * 30}deg) translateX(-50%)`
                        }}
                    />
                ))}
            </motion.div>

            {/* MIDDLE RING (Counter Rotate) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[70%] h-[70%] border-[2px] border-arise-blue/20 rounded-full flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-arise-blue/5 to-transparent rounded-full" />
                {/* Geometric Shapes */}
                <div className="absolute w-full h-full border border-arise-blue/10 rotate-45" />
                <div className="absolute w-full h-full border border-arise-blue/10 -rotate-45" />
            </motion.div>

            {/* INNER RING (Fast Rotate) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[40%] h-[40%] border-[4px] border-arise-blue/10 rounded-full border-t-arise-blue/50 border-r-transparent border-b-arise-blue/50 border-l-transparent"
            >
                <div className="absolute inset-4 rounded-full border border-purple-500/30 animate-pulse" />
            </motion.div>

            {/* CORE GLOW */}
            <div className="absolute w-[10%] h-[10%] bg-arise-blue/20 blur-[50px] animate-pulse" />

        </div>
    );
}
