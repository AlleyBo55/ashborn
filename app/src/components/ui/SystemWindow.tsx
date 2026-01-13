'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SystemWindowProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    delay?: number;
    type?: 'info' | 'alert' | 'quest';
}

export default function SystemWindow({ children, title, className, delay = 0, type = 'info' }: SystemWindowProps) {
    const borderColor = type === 'alert' ? 'border-red-500' : 'border-system-frame';
    const glowColor = type === 'alert' ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(37,99,235,0.5)]';
    const textColor = type === 'alert' ? 'text-red-500' : 'text-system-frame';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4, type: "spring", bounce: 0.4 }}
            className={twMerge(
                "relative backdrop-blur-md bg-system-bg border-2 overflow-hidden",
                borderColor,
                glowColor,
                className
            )}
        >
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white z-10" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-white z-10" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white z-10" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white z-10" />

            {/* Header */}
            <div className={clsx("px-4 py-2 border-b-2 bg-black/40 flex items-center justify-between", borderColor)}>
                <h3 className={clsx("font-tech tracking-widest uppercase font-bold text-sm", textColor)}>
                    {type === 'quest' ? 'QUEST INFO' : 'SYSTEM NOTIFICATION'}
                </h3>
                <span className="font-manga text-white text-lg tracking-wide">{title}</span>
            </div>

            {/* Content */}
            <div className="p-6 relative">
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0 opacity-20" />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
