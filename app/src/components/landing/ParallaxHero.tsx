/* eslint-disable @next/next/no-img-element */
'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import SecurityValidationIcon from 'hugeicons-react/dist/esm/icons/security_validation_icon';
import LockIcon from 'hugeicons-react/dist/esm/icons/lock_icon';
import FlashIcon from 'hugeicons-react/dist/esm/icons/flash_icon';
import Activity01Icon from 'hugeicons-react/dist/esm/icons/activity_01_icon';
import CpuIcon from 'hugeicons-react/dist/esm/icons/cpu_icon';
import ViewIcon from 'hugeicons-react/dist/esm/icons/view_icon';
import Wifi01Icon from 'hugeicons-react/dist/esm/icons/wifi_01_icon';
import ConsoleIcon from 'hugeicons-react/dist/esm/icons/console_icon';
import CubeIcon from 'hugeicons-react/dist/esm/icons/cube_icon';
import PlayIcon from 'hugeicons-react/dist/esm/icons/play_icon';
import { useSystemToast } from '../ui/SystemToast';
import ScrambleText from '../ui/ScrambleText';
import { useEffect, useState } from 'react';

// --- VISUAL COMPONENTS ---

const SystemScan = () => {
    return (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-screen opacity-30">
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute left-0 w-full h-[1px] bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
        </div>
    );
};

const GlitchScreen = () => {
    return (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden mix-blend-soft-light opacity-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 animate-pulse" />
            <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay" />
        </div>
    );
};

const ParticleField = () => {
    const particles = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-gray-600 rounded-full blur-[0.5px] opacity-80"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -200],
                        opacity: [0, 0.8, 0],
                        scale: [0.8, 1.2, 0.5]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                />
            ))}
        </div>
    );
};

const features = [
    { title: "PRIVACY", sub: "ZK_SNARK_PROTOCOL", icon: SecurityValidationIcon },
    { title: "SPEED", sub: "SOLANA_MAINNET", icon: FlashIcon },
    { title: "POWER", sub: "ZK_COMPRESSION", icon: CubeIcon }
];

const FeatureHighlight = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = features[index].icon;

    return (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 z-50 flex flex-col gap-2 pointer-events-none w-full items-center md:items-start">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="flex flex-col border-l-4 border-purple-500 pl-6 py-2"
                >
                    <div className="flex items-center gap-3 text-purple-400 mb-2">
                        <CurrentIcon className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-mono tracking-widest text-purple-300/80 bg-purple-900/30 px-2 py-0.5 rounded">SYSTEM_OVERRIDE_0{index + 1}</span>
                    </div>
                    <h2 className="text-4xl md:text-8xl font-sans font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tighter opacity-90 drop-shadow-lg pr-4 pb-2">
                        <ScrambleText text={features[index].title} key={features[index].title} />
                    </h2>
                    <div className="text-sm font-bold text-purple-400 tracking-[0.5em] mt-2 font-mono">
                        [<ScrambleText text={features[index].sub} key={features[index].sub} delay={500} />]
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Replaces ContentHUD - Placed Bottom Left
// Style: iOS Widget "Smart Stack"
const QuestWindow = () => {
    return (
        <div className="absolute bottom-32 left-8 md:left-16 z-50 hidden md:block w-72 pointer-events-none hover:pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
                {/* Header Pills */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/20">
                        <CubeIcon className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] text-blue-300 font-bold tracking-wide">QUEST</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>

                <h3 className="text-white text-lg font-bold mb-2 leading-tight">
                    Absolute Privacy
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Deploy ZK-Proofs to shadow transaction graphs.
                </p>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block mb-1 font-bold">REWARD</span>
                        <span className="text-[10px] text-amber-400 font-bold">FREEDOM</span>
                    </div>
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block mb-1 font-bold">RANK</span>
                        <span className="text-[10px] text-red-400 font-bold">S_RANK</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Replaces ScrollIndicator - Placed Bottom Fixed
const TerminalStatusBar = () => {
    return (
        <div className="absolute bottom-0 w-full z-50 bg-black border-t border-purple-900/50 px-4 py-2 flex items-center justify-between pointer-events-none font-mono text-[10px]">
            <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-2 text-green-500">
                    <ConsoleIcon className="w-3 h-3" />
                    <span className="hidden md:inline">SYSTEM_READY</span>
                    <span className="md:hidden text-[8px] tracking-widest text-green-500/80">SYS_ONLINE</span>
                </div>
                <span className="hidden md:inline">User: ashborn@shadow-protocol</span>
            </div>

            <div className="flex items-center gap-2 animate-pulse text-purple-400">
                <span className="hidden md:inline">AWAITING_INPUT</span>
                <span className="text-gray-600 hidden md:inline">{'>>'}</span>
                <span className="bg-purple-900/50 text-white px-2 py-0.5 rounded text-[8px] md:text-[10px]">SCROLL_DOWN</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-gray-600">
                <span>MEM: 64GB</span>
                <span>LATENCY: 12ms</span>
            </div>
        </div>
    );
}

const NetworkMonitor = () => {
    const [tps, setTps] = useState(4821);
    const [logs, setLogs] = useState<Array<{ msg: string, type: string, id: number }>>([]);

    const generateLog = () => {
        const actions = ['Minting', 'ZK_Proof', 'Obfuscating', 'Verifying', 'Finalizing'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        // Use specific Solana terms
        const slot = Math.floor(Math.random() * 10000) + 245000000;
        return `Slot ${slot} :: ${action} [CONFIRMED]`;
    };

    useEffect(() => {
        // Ticker Logic
        const interval = setInterval(() => {
            setLogs(prev => {
                const newId = Date.now();
                const newItem = {
                    msg: generateLog(),
                    type: Math.random() > 0.8 ? 'WARN' : 'INFO',
                    id: newId
                };
                return [newItem, ...prev.slice(0, 7)];
            });
        }, 300); // Very fast ticker

        // TPS Logic
        const tpsInterval = setInterval(() => {
            setTps(prev => prev + Math.floor(Math.random() * 200) - 100);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(tpsInterval);
        };
    }, []);

    // Style: Dynamic Island / Stack
    return (
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-40 hidden md:flex flex-col justify-center pr-8 pointer-events-none">
            {/* Header */}
            <div className="border-b border-green-500/30 pb-2 mb-4 flex items-center gap-2 justify-end">
                <span className="text-[10px] font-mono text-green-500 tracking-widest">NETWORK_MONITOR</span>
                <Activity01Icon className="w-3 h-3 text-green-500 animate-pulse" />
            </div>

            {/* Logs */}
            <div className="h-[300px] overflow-hidden flex flex-col justify-end relative mask-linear-fade">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-right mb-1.5"
                        >
                            <span className="text-[9px] font-mono text-gray-500 mr-2">
                                {new Date(log.id).toLocaleTimeString()}
                            </span>
                            <span className={`text-[10px] font-mono ${log.type === 'WARN' ? 'text-amber-500' : 'text-green-400/80'}`}>
                                {log.msg}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="mt-6 space-y-2 border-t border-gray-800 pt-4">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] text-gray-500 font-mono">TPS</span>
                    <span className="text-xl font-bold text-white font-mono">{tps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-[9px] text-gray-500 font-mono">PING</span>
                    <span className="text-sm text-green-400 font-mono">14ms</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-[9px] text-gray-500 font-mono">CU_USAGE</span>
                    <span className="text-xs text-purple-400 font-mono">OPTIMIZED</span>
                </div>
            </div>
        </div>
    );
};

const ShadowSmoke = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-multiply opacity-90">
            <svg className="hidden">
                <filter id="shadow-turbulence">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" />
                </filter>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

            <motion.div
                animate={{ x: [-30, 30, -30], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-50%] w-[200%] h-[200%]"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(20, 0, 40, 0.4) 0%, transparent 70%)',
                    filter: 'url(#shadow-turbulence)'
                }}
            />
        </div>
    );
};

const SystemBroadcast = () => {
    return (
        <div className="absolute top-0 left-0 w-full z-[60] bg-gradient-to-r from-purple-900/80 via-purple-600/80 to-purple-900/80 backdrop-blur-md border-b border-purple-500/30 text-white text-[10px] font-mono py-1.5 px-4 flex justify-between items-center tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                <span className="font-bold text-green-300">DEVNET_LIVE</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-purple-200/70">
                <span>VERSION v0.2.2</span>
                <span>::</span>
                <span>ASHBORN</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-purple-300">MAINNET_INFILTRATION:</span>
                <span className="relative w-20 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="absolute h-full bg-purple-400 shadow-[0_0_10px_#c084fc]"
                    />
                </span>
                <span className="text-purple-400 font-bold">65%</span>
            </div>
        </div>
    );
};

export default function ParallaxHero() {
    const { show } = useSystemToast();
    const [mounted, setMounted] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax Transform
    const eyeX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-30, 30]);
    const eyeY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-15, 15]);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const handleQuestAccept = () => {
        show("QUEST ACCEPTED", "Shadow Extraction Initiated", "success");
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            <SystemBroadcast />

            {/* 1. LAYERS: Background & Atmosphere */}
            <div className="absolute inset-0 z-0 bg-black" />
            <ShadowSmoke />
            {mounted && <ParticleField />}
            <SystemScan />
            {mounted && <GlitchScreen />}

            {/* 2. MAIN VISUAL: Hero Image (Parallax Eye) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ x: eyeX, y: eyeY }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="relative w-full h-full"
                >
                    <img
                        src="/assets/hero-eye-override.png"
                        alt="Shadow Monarch"
                        className="w-full h-full object-cover object-right md:object-center opacity-70"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000000_80%)] z-20" />
                </motion.div>
            </div>

            {/* 3. INFO & MARKETING */}
            {mounted && <FeatureHighlight />}
            {mounted && <NetworkMonitor />}
            {mounted && <QuestWindow />}
            {mounted && <TerminalStatusBar />}

            {/* 4. AURA (Intensified) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] bg-purple-600/30 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen"
                />
            </div>

            {/* 5. CENTER ACTION (Button) */}
            <div className="relative z-40 w-full max-w-7xl px-4 flex flex-col items-center justify-center h-full pointer-events-none pt-[30vh]">
                {/* 
                     Pushed button down to lower third (pt-[30vh]) so the EYE is the center, 
                     and the button sits 'below' the gaze.
                */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center pointer-events-auto"
                >
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
                        <a
                            href="/demo"
                            className="group relative px-8 py-4 bg-purple-900/10 border border-purple-500/50 text-white font-tech tracking-[0.2em] text-xs uppercase overflow-hidden hover:bg-purple-500/20 transition-all duration-300 backdrop-blur-md rounded-sm shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] hover:border-purple-400 flex items-center justify-center gap-3"
                        >
                            <PlayIcon className="w-4 h-4 fill-current animate-pulse" />
                            <span>Launch Demo</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        </a>
                        <a
                            href="/docs"
                            className="group relative px-8 py-4 bg-black/40 border border-white/10 text-gray-400 font-tech tracking-[0.2em] text-xs uppercase overflow-hidden hover:bg-white/5 hover:text-white transition-all duration-300 backdrop-blur-md rounded-sm hover:border-white/30 flex items-center justify-center gap-3"
                        >
                            <ConsoleIcon className="w-4 h-4" />
                            <span>Documentation</span>
                        </a>
                    </div>
                    <div className="mt-4 text-[10px] text-purple-300/60 font-mono tracking-widest uppercase opacity-80 animate-pulse">
                        Access Level: Monarch
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 5, 0] }}
                        transition={{ delay: 2, duration: 2, repeat: Infinity }}
                        className="mt-12 flex flex-col items-center gap-2"
                    >
                        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                        <span className="text-[18px] text-gray-500 font-mono tracking-[0.2em] uppercase opacity-70">Scroll to Breach</span>
                    </motion.div>
                </motion.div>
            </div >

        </div >
    );
}
