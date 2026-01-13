'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';

interface SystemWindowProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    delay?: number;
    type?: 'info' | 'alert' | 'quest';
}

export default function SystemWindow({ children, title, className, delay = 0, type = 'info' }: SystemWindowProps) {
    const [glitch, setGlitch] = useState(false);

    // Random glitch effect trigger
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.95) {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 200);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const borderColor = type === 'alert' ? 'border-red-500' : 'border-system-frame';
    const glowColor = type === 'alert' ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(37,99,235,0.5)]';
    const textColor = type === 'alert' ? 'text-red-500' : 'text-system-frame';

    const glitchAnim = glitch ? {
        x: [0, -2, 2, -1, 0],
        y: [0, 1, -1, 0],
        filter: 'hue-rotate(90deg)',
    } : {};

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4, type: "spring", bounce: 0.4 }}
            className={twMerge(
                "relative backdrop-blur-md bg-system-bg/90 border-2 overflow-hidden group perspective-1000",
                borderColor,
                glowColor,
                className
            )}
            animate={glitchAnim}
        >
            {/* Holographic Scanline Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanlines" />

            {/* Animated Gradient Border */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine z-20 pointer-events-none`} />

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white z-20 shadow-[0_0_10px_white]" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-white z-20 shadow-[0_0_10px_white]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white z-20 shadow-[0_0_10px_white]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white z-20 shadow-[0_0_10px_white]" />

            {/* Header */}
            <div className={clsx("px-4 py-2 border-b-2 bg-black/60 flex items-center justify-between relative z-10", borderColor)}>
                {/* Glitchy Header Text */}
                <h3 className={clsx("font-tech tracking-widest uppercase font-bold text-sm flex gap-2 items-center", textColor)}>
                    <span className="w-2 h-2 bg-current animate-pulse" />
                    {type === 'quest' ? 'QUEST INFO' : 'SYSTEM NOTIFICATION'}
                </h3>
                <span className="font-manga text-white text-lg tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{title}</span>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
                {children}
            </div>

        </motion.div>
    );
}
