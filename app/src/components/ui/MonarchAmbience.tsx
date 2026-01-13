'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MonarchAmbience() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const maskImage = useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(147, 51, 234, 0.15), transparent 80%)`;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* 1. Global Gradient Base (Darker, Deeper) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0510] to-black" />

            {/* 2. Interactive Mouse Aura */}
            <motion.div
                className="absolute inset-0 z-10 opacity-100 mix-blend-screen pointer-events-none"
                style={{ background: maskImage }}
            />

            {/* 3. Deep Ambient Blobs (Intensified) */}
            <motion.div
                animate={{
                    x: [-100, 100, -100],
                    y: [-50, 50, -50],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] mix-blend-color-dodge"
            />
            <motion.div
                animate={{
                    x: [100, -100, 100],
                    y: [50, -50, 50],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-900/20 rounded-full blur-[180px] mix-blend-color-dodge"
            />

            {/* 4. Rising Embers (Ashborn Army) */}
            {mounted && (
                <div className="absolute inset-0 z-20 overflow-hidden opacity-60 mix-blend-screen">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                                opacity: 0
                            }}
                            animate={{
                                y: -100,
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 20,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* 5. Shadow Smoke Turbulence */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <svg className="hidden">
                    <filter id="ambience-turbulence-strong">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />
                    </filter>
                </svg>
                <div
                    className="absolute inset-0 opacity-50 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent"
                    style={{ filter: 'url(#ambience-turbulence-strong)' }}
                />
            </div>

            {/* 6. Cinematic Grain */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
        </div>
    );
}
