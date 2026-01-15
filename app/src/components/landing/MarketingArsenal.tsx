'use client';

import { Shield02Icon, FlashIcon, ViewOffIcon, GhostIcon, Share01Icon, UserGroup01Icon, CommandLine01Icon, CodeIcon, CpuIcon, AlertTriangleIcon } from 'hugeicons-react';
import { useState } from 'react';
import ScrambleText from '../ui/ScrambleText';

// Shadow Army / Skills Data
const SHADOW_SKILLS = [
    {
        id: 'RULE_OF_SILENCE',
        icon: GhostIcon,
        name: "STEALTH CLOAK",
        rank: "GENERAL",
        desc: "Absolute invisibility. Generates phantom addresses for each transaction. No footprint remains.",
        cost: "0 MANA"
    },
    {
        id: 'DOMAIN_EXPANSION',
        icon: Shield02Icon,
        name: "VOID SHIELD",
        rank: "MARSHAL",
        desc: "ZK-SNARK proof generation. Encapsulates assets in an impenetrable barrier of mathematics.",
        cost: "HIGH"
    },
    {
        id: 'SHADOW_EXCHANGE',
        icon: UserGroup01Icon,
        name: "SHADOW ARMY",
        rank: "COMMANDER",
        desc: "Summons decoy outputs. Your transaction hides amongst thousands of shadow soldiers.",
        cost: "MED"
    },
    {
        id: 'KINGS_AUTHORITY',
        icon: ViewOffIcon,
        name: "VIEW KEY",
        rank: "RULER",
        desc: "Selective revelation. Grant vision only to those you deem worthy (Auditors).",
        cost: "VARIES"
    },
    {
        id: 'SHADOW_STEP',
        icon: FlashIcon,
        name: "FLASH STRIKE",
        rank: "ELITE",
        desc: "Instantaneous execution. Move across the Solana network faster than light (<400ms).",
        cost: "LOW"
    },
    {
        id: 'PHANTOM_TOUCH',
        icon: Share01Icon,
        name: "GHOST RELAY",
        rank: "ASSASSIN",
        desc: "Gasless interaction. Your wallet remains untouched; the shadows pay the fee.",
        cost: "NONE"
    }
];

const ShadowCard = ({ skill, index }: { skill: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = skill.icon;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative h-[300px] border transition-all duration-500 overflow-hidden flex flex-col justify-between p-6
                ${isHovered
                    ? 'bg-purple-950/20 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.2)]'
                    : 'bg-black/60 border-white/5 hover:border-white/20'
                }`}
        >
            {/* Dark Overlay that clears on hover */}
            <div className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

            {/* "ARISE" Command Background Text */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black italic text-4xl tracking-widest text-purple-600/20 transition-all duration-300 pointer-events-none ${isHovered ? 'scale-110 opacity-100 blur-[2px]' : 'scale-50 opacity-0 blur-xl'}`}>
                ARISE
            </div>

            {/* Top: Rank & System Info */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-mono tracking-[0.2em] transition-colors duration-300 ${isHovered ? 'text-purple-400' : 'text-gray-600'}`}>
                        {'//'} RANK: {skill.rank}
                    </span>
                    <span className="text-[10px] font-mono text-gray-700">
                        ID: {skill.id}
                    </span>
                </div>
                <div className={`p-2 rounded-full border transition-all duration-500 ${isHovered ? 'bg-purple-600 border-purple-400 text-white animate-pulse' : 'bg-transparent border-gray-800 text-gray-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {/* Middle: Name (Standard -> Arise Mode) */}
            <div className="relative z-10 my-auto text-center">
                <h3 className={`font-black italic text-2xl md:text-3xl transition-all duration-300 transform ${isHovered ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 scale-110' : 'text-gray-500'}`}>
                    {skill.name}
                </h3>
            </div>

            {/* Bottom: Description & Stats */}
            <div className="relative z-10 border-t border-white/5 pt-4 mt-4">
                <p className={`text-xs font-mono leading-relaxed transition-colors duration-300 ${isHovered ? 'text-gray-300' : 'text-gray-600'}`}>
                    {skill.desc}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 delay-${i * 100} ${isHovered ? 'bg-purple-500' : 'bg-gray-800'}`} />
                        ))}
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest ${isHovered ? 'text-purple-400' : 'text-gray-700'}`}>
                        COST: {skill.cost}
                    </span>
                </div>
            </div>

            {/* Purple Flame Effect (Bottom Border) */}
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent transition-all duration-500 ${isHovered ? 'opacity-100 shadow-[0_0_20px_#9333ea]' : 'opacity-0'}`} />
        </div>
    );
};

export default function MarketingArsenal() {
    return (
        <section className="relative w-full py-32 px-6 md:px-12 bg-black overflow-hidden">

            {/* Background Texture - Dungeon Vibe */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />

            <div className="max-w-7xl mx-auto relative z-20">

                {/* Header: System Message */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-900/50 bg-purple-900/10 text-purple-400 font-mono text-xs mb-6">
                        <AlertTriangleIcon className="w-3 h-3" />
                        <span>SYSTEM NOTIFICATION</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter mb-4">
                        <span className="text-gray-800">MY</span> <ScrambleText text="SHADOWS" />
                    </h2>
                    <p className="text-gray-500 font-mono text-sm max-w-xl mx-auto uppercase tracking-widest border-t border-b border-gray-900 py-4">
                        &quot;I am the record of your struggles, the evidence of your resistance, and the reward of your pain.&quot;
                    </p>
                </div>

                {/* The Army Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-800 bg-gray-900/20">
                    {SHADOW_SKILLS.map((skill, index) => (
                        <ShadowCard key={skill.id} skill={skill} index={index} />
                    ))}
                </div>

                {/* System Console Footer */}
                <div className="mt-12 flex justify-between items-center text-[10px] font-mono text-gray-700 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <CommandLine01Icon className="w-4 h-4" />
                        <span>SYSTEM: ACCESS_GRANTED</span>
                    </div>
                    <div>
                        SHADOW_EXTRACTION_RATE: 100%
                    </div>
                    <div className="flex items-center gap-2">
                        <span>CLASS: NECROMANCER</span>
                        <CodeIcon className="w-4 h-4" />
                    </div>
                </div>

            </div>
        </section>
    );
}
