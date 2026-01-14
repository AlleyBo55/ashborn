'use client';

import { Shield, Zap, EyeOff, Ghost, Network, Users, ChevronRight, Binary, Cpu, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import ScrambleText from '../ui/ScrambleText';

// Skill Data
const ARSENAL_MODULES = [
    {
        id: 'void-shield',
        icon: Shield,
        name: "Void Shield",
        desc: "ZK-SNARKs privacy layer. Encrypts assets into the shadow realm.",
        stats: { type: "DEFENSE", power: 100 },
        rarity: "MYTHIC"
    },
    {
        id: 'stealth-cloak',
        icon: Ghost,
        name: "Stealth Cloak",
        desc: "ECDH Key Exchange. Generates invisible one-time addresses.",
        stats: { type: "STEALTH", power: 95 },
        rarity: "LEGENDARY"
    },
    {
        id: 'shadow-army',
        icon: Users,
        name: "Shadow Army",
        desc: "Decoy output generation. Confuses graph analysis tools.",
        stats: { type: "CHAOS", power: 90 },
        rarity: "EPIC"
    },
    {
        id: 'view-key',
        icon: EyeOff,
        name: "View Key",
        desc: "Selective disclosure proof. reveal data only to trusted auditors.",
        stats: { type: "UTILITY", power: 85 },
        rarity: "RARE"
    },
    {
        id: 'flash-strike',
        icon: Zap,
        name: "Flash Strike",
        desc: "Solana Mainnet optimization. <400ms finality execution.",
        stats: { type: "SPEED", power: 98 },
        rarity: "EPIC"
    },
    {
        id: 'ghost-relay',
        icon: Network,
        name: "Ghost Relay",
        desc: "Gasless meta-transactions. Disconnect wallet from on-chain history.",
        stats: { type: "RELAY", power: 100 },
        rarity: "LEGENDARY"
    }
];

function ModuleCard({ module, index }: { module: any, index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Trigger animation on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative h-64 bg-black/40 border border-white/10 hover:border-purple-500/50 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] opacity-0 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards' : ''}`}
            style={{ animationDelay: `${index * 100}ms`, opacity: isVisible ? 1 : 0 }}
        >
            {/* Background Tech Lines */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />

            {/* Active Glow Corner */}
            <div className={`absolute top-0 right-0 p-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>

            <div className="p-6 h-full flex flex-col justify-between relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors duration-300`}>
                        <module.icon className={`w-6 h-6 ${isHovered ? 'text-purple-300' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-600 border border-gray-800 px-2 py-1 rounded">
                        MOD_{index + 1.toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        {module.name}
                        <ChevronRight className={`w-4 h-4 text-purple-500 transition-transform duration-300 ${isHovered ? 'translate-x-1 opacity-100' : '-translate-x-2 opacity-0'}`} />
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-mono">
                        {module.desc}
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 tracking-wider">
                        <span>{module.stats.type}</span>
                        <span className={isHovered ? 'text-purple-400' : 'text-gray-600'}>
                            {module.stats.power}% PWR
                        </span>
                    </div>
                    <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${isHovered ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-gray-400'} transition-all duration-1000 ease-out`}
                            style={{
                                width: isVisible ? `${module.stats.power}%` : '0%'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MarketingArsenal() {
    return (
        <section className="relative w-full max-w-7xl mx-auto py-32 px-6 md:px-12">

            {/* Section Header */}
            <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-8">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4">
                        SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">MODULES</span>
                    </h2>
                    <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
                        <span className="flex items-center gap-2">
                            <Binary className="w-4 h-4 text-purple-500" />
                            ENCRYPTION: AES-256
                        </span>
                        <span className="hidden md:inline text-gray-700">|</span>
                        <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" />
                            PROTOCOL: ZK-GROTH16
                        </span>
                    </div>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                    <p className="text-gray-500 font-mono text-xs mb-2">AVAILABLE MODULES</p>
                    <div className="text-4xl font-black text-white">06 <span className="text-purple-500">/</span> 06</div>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ARSENAL_MODULES.map((module, index) => (
                    <ModuleCard key={module.id} module={module} index={index} />
                ))}
            </div>

            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-900/5 blur-[150px] -z-10 pointer-events-none" />

        </section>
    );
}
