'use client';

import { motion } from 'framer-motion';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';
import SystemWindow from '../../components/ui/SystemWindow';
import { useEffect, useState } from 'react';
import { useSystemToast } from '../ui/SystemToast';

// Particle component for CSS-based smoke/embers
const Particle = ({ delay, type }: { delay: number, type: 'smoke' | 'ember' }) => {
    const randomX = Math.random() * 100;
    const duration = 5 + Math.random() * 5;

    return (
        <motion.div
            initial={{
                x: `${randomX}vw`,
                y: type === 'smoke' ? "120vh" : "100vh",
                opacity: 0,
                scale: 0.5
            }}
            animate={{
                y: type === 'smoke' ? "-20vh" : "-10vh",
                opacity: [0, 0.4, 0],
                scale: type === 'smoke' ? 2 : 1
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear"
            }}
            className={`absolute rounded-full blur-[20px] pointer-events-none z-10
                ${type === 'smoke' ? 'bg-purple-900/30 w-32 h-32' : 'bg-arise-blue/60 w-1 h-1 blur-[1px]'}
            `}
        />
    );
};

export default function CinematicHero() {
    const [particles, setParticles] = useState<number[]>([]);
    const { show } = useSystemToast();
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        setParticles([...Array(20)].map((_, i) => i));
    }, []);

    const handleQuestAccept = () => {
        // 1. Kinetic Impact: Shake the screen
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Shake duration

        // 2. System Notification: "Gamified" feedback
        show("QUEST ACCEPTED", "Main Objective: Contract Address Copied", "success");

        // 3. (Mock) Copy Action
        // navigator.clipboard.writeText("ASHBORN_CA_PLACEHOLDER");
    };

    return (
        <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 transition-transform duration-100 ${isShaking ? 'translate-x-1 translate-y-1' : ''}`}>

            {/* SHAKE WRAPPER - Apply animation via style or class if available, simple toggle above for now */}
            {isShaking && (
                <style jsx>{`
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-1deg); }
                20% { transform: translate(-3px, 0px) rotate(1deg); }
                30% { transform: translate(3px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(1deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(3px, 1px) rotate(-1deg); }
                80% { transform: translate(-1px, -1px) rotate(1deg); }
                90% { transform: translate(1px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
            .shake-active {
                animation: shake 0.5s;
                animation-iteration-count: infinite;
            }
          `}</style>
            )}

            {/* BACKGROUND LAYER (Z-0) */}
            <div className={`absolute inset-0 z-0 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                <div className="absolute inset-0 bg-webtoon-army bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-monarch-black via-monarch-black/80 to-transparent" />
            </div>

            {/* ATMOSPHERE LAYER (Z-10) - CSS Particles */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                {particles.map((_, i) => (
                    <Particle key={i} delay={i * 0.5} type="smoke" />
                ))}
                {particles.map((_, i) => (
                    <Particle key={i + 100} delay={i * 0.2} type="ember" />
                ))}
            </div>

            {/* CHARACTER LAYER REMOVED - Causing dizziness due to fallback asset duplicating background */}

            {/* CONTENT LAYER (Z-30) */}
            <div className="z-30 w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">

                {/* Left: Action Text */}
                <div className="flex flex-col items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -100, skewX: 20 }}
                        animate={{ opacity: 1, x: 0, skewX: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="text-arise-blue w-4 h-4 animate-spin-slow" />
                            <h2 className="font-tech text-arise-blue tracking-[0.2em] uppercase text-sm font-bold">
                                System Initialization
                            </h2>
                        </div>

                        <h1 className="text-8xl md:text-9xl font-manga text-white drop-shadow-[0_0_15px_rgba(76,29,149,0.8)] italic tracking-tighter leading-[0.8] mix-blend-screen">
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
                        className="text-gray-300 mt-8 text-xl font-medium max-w-lg border-l-2 border-arise-blue/50 pl-6 leading-relaxed bg-black/40 p-4 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    >
                        The Shadows await your command. The <span className="text-arise-blue font-bold text-shadow-glow">Compliant Private Payment Protocol</span> is online.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="mt-10"
                    >
                        <button
                            onClick={handleQuestAccept}
                            className="relative group px-12 py-6 bg-arise-blue text-white font-manga text-3xl uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform duration-200 shadow-[0_0_40px_rgba(59,130,246,0.5)] clip-path-polygon cursor-none" // hidden cursor for custom one
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Accept Quest <Shield02Icon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-100" />
                            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                        </button>
                    </motion.div>
                </div>

                {/* Right: System Window */}
                <SystemWindow title="PROTOCOL STATUS" delay={0.8} type="quest" className="w-full md:rotate-2 hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <div className="space-y-6 font-mono text-sm relative z-10">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="text-gray-400">STATUS</span>
                            <span className="text-green-400 font-bold animate-pulse text-shadow-glow">● ONLINE</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">PRIVACY SHIELD</span>
                                <span className="text-arise-blue font-bold">MAXIMUM</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                                <div className="bg-arise-blue w-full h-full animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">COMPLIANCE</span>
                                <span className="text-arise-blue font-bold">VERIFIED</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                                <div className="bg-arise-blue w-[85%] h-full" />
                            </div>
                        </div>

                        <div className="p-4 bg-arise-blue/5 border border-arise-blue/20 rounded mt-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-arise-blue/5 animate-pulse" />
                            <h4 className="font-bold text-arise-blue mb-1 relative z-10">OBJECTIVE:</h4>
                            <p className="text-gray-300 relative z-10">Transfer assets without detection. Prove compliance to the Rulers.</p>
                        </div>
                    </div>
                </SystemWindow>

            </div>
        </div>
    );
}
