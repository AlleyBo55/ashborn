'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, EyeOff, Ghost, Network, Hexagon, Users, Bot, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';
import ScrambleText from '../ui/ScrambleText';

// Skill Data
const SKILLS = [
    {
        id: 'void-shield',
        icon: Shield,
        name: "Void Shield",
        description: "Impenetrable privacy using zk-SNARKs. Your assets enter the shadow realm, becoming mathematically untraceable.",
        stats: { stealth: "100%", speed: "High", cost: "Low" },
        tier: "S-RANK"
    },
    {
        id: 'stealth-cloak',
        icon: Ghost,
        name: "Stealth Cloak",
        description: "Invisible recipient addresses using ECDH. Receive payments without ever revealing your true identity.",
        stats: { stealth: "MAX", speed: "Instant", cost: "None" },
        tier: "A-RANK"
    },
    {
        id: 'shadow-army',
        icon: Users,
        name: "Shadow Army",
        description: "Decoy outputs confuse graph analysis. Every transaction looks like a crowd, hiding the true path.",
        stats: { stealth: "High", speed: "Medium", cost: "Med" },
        tier: "S-RANK"
    },
    {
        id: 'view-key',
        icon: EyeOff,
        name: "View Key",
        description: "Selective disclosure. Prove compliance to auditors without revealing your secrets to the world.",
        stats: { stealth: "Variable", speed: "Instant", cost: "None" },
        tier: "A-RANK"
    },
    {
        id: 'flash-strike',
        icon: Zap,
        name: "Flash Strike",
        description: "Lightning fast execution on Solana. Privacy doesn't mean waiting. <400ms finality.",
        stats: { stealth: "Med", speed: "MAX", cost: "Low" },
        tier: "B-RANK"
    },
    {
        id: 'ghost-relay',
        icon: Network,
        name: "Ghost Relay",
        description: "Gasless transaction submission. Your wallet never touches the chain directly.",
        stats: { stealth: "MAX", speed: "High", cost: "Variable" },
        tier: "S-RANK"
    }
];

export default function MarketingArsenal() {
    const [selectedSkill, setSelectedSkill] = useState(SKILLS[0]);

    return (
        <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-900/5 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-900/5 blur-[100px] -z-10" />

            <div className="flex flex-col lg:flex-row gap-16">

                {/* Left Column: Skill List */}
                <div className="lg:w-1/2">
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400"><ScrambleText text="ARSENAL" /></span>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm border-l-2 border-purple-500 pl-4">
                            CHOOSE YOUR ABILITY.<br />
                            MASTER THE SHADOWS.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {SKILLS.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => setSelectedSkill(skill)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group relative overflow-hidden
                                    ${selectedSkill.id === skill.id
                                        ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${selectedSkill.id === skill.id ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-500 group-hover:text-gray-300'}`}>
                                    <skill.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <span className={`font-bold uppercase tracking-wider ${selectedSkill.id === skill.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                        {skill.name}
                                    </span>
                                </div>
                                {selectedSkill.id === skill.id && (
                                    <motion.div layoutId="arrow" className="text-purple-400">
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Skill Detail (Holographic Card) */}
                <div className="lg:w-1/2 lg:pt-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedSkill.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative h-full"
                        >
                            <div className="relative border border-purple-500/30 bg-black/40 backdrop-blur-xl p-8 rounded-3xl overflow-hidden h-full flex flex-col justify-between group h-[500px]">

                                {/* Holographic Scanline */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(168,85,247,0.05)_50%,transparent_100%)] h-[200%] w-full animate-scan pointer-events-none" />

                                {/* Background Icon */}
                                <selectedSkill.icon className="absolute -right-12 -bottom-12 w-96 h-96 text-purple-900/10 rotate-12" />

                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-mono font-bold tracking-widest">
                                            {selectedSkill.tier}
                                        </div>
                                        <Lock className="w-5 h-5 text-gray-600" />
                                    </div>

                                    <h3 className="text-5xl font-black text-white italic mb-6">
                                        {selectedSkill.name.toUpperCase()}
                                    </h3>

                                    <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                                        {selectedSkill.description}
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                                    {Object.entries(selectedSkill.stats).map(([key, value]) => (
                                        <div key={key}>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{key}</div>
                                            <div className="text-xl font-mono font-bold text-white relative">
                                                {value}
                                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 w-full animate-pulse" style={{ width: '100%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute -inset-4 bg-purple-500/20 blur-[50px] -z-10 rounded-full opacity-50" />

                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
