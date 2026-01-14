'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Shield, Zap, EyeOff, Ghost, Network, Hexagon, Users, Bot } from 'lucide-react';
import ScrambleText from '../ui/ScrambleText';

const InventorySlot = ({ item, index, isHero = false }: { item: any, index: number, isHero?: boolean }) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-gray-900/40 backdrop-blur-2xl p-6 hover:bg-gray-800/60 transition-all duration-500 hover:shadow-2xl 
                ${isHero ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.tier === 'S' ? 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' : ''}`}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          650px circle at ${mouseX}px ${mouseY}px,
                          rgba(124, 58, 237, 0.1),
                          transparent 80%
                        )
                      `,
                }}
            />

            {/* Apple-style Inner Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${item.tier === 'S' ? 'bg-purple-500/20 text-purple-300' :
                    item.tier === 'A' ? 'bg-blue-500/10 text-blue-300' : 'bg-gray-800 text-gray-400'
                    }`}>
                    <item.icon className={isHero ? "w-8 h-8" : "w-5 h-5"} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.tier === 'S' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-gray-700 text-gray-500'
                    }`}>
                    {item.tier}_RANK
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className={`font-bold text-white mb-2 ${isHero ? 'text-2xl' : 'text-lg'}`}>
                    {item.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                    {item.desc}
                </p>
            </div>

            {/* Hero Decoration */}
            {isHero && (
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" />
            )}
        </motion.div>
    );
};

export default function MarketingArsenal() {
    const items = [
        {
            icon: Shield,
            name: "Void Shield",
            desc: "Provides impenetrable privacy for all transactions, leveraging zk-SNARKs for ultimate anonymity.",
            tier: "S",
        },
        {
            icon: Ghost,
            name: "Stealth Cloak",
            desc: "Renders your on-chain activities untraceable with ECDH and invisible metadata.",
            tier: "A",
        },
        {
            icon: Zap,
            name: "Flash Strike",
            desc: "Execute transactions with lightning speed (<400ms) on Solana Mainnet, ensuring low gas costs.",
            tier: "B",
        },
        {
            icon: EyeOff,
            name: "View Key",
            desc: "Offers selective disclosure for compliance proofs, granting auditors controlled access to necessary data.",
            tier: "A",
        },
        {
            icon: Network,
            name: "Ghost Relay",
            desc: "Your wallet never touches the chain. Relayers submit transactions for you, ensuring total sender unlinkability.",
            tier: "S",
        },
        {
            icon: Hexagon,
            name: "NFT Anonymity",
            desc: "Prove ownership of blue-chip NFTs for DAO access or airdrops without revealing which specific asset you hold.",
            tier: "A",
        },
        {
            icon: Users,
            name: "Shadow Army",
            desc: "Each transaction generates 3+ decoy outputs. Mathematically indistinguishable to graph analysis tools.",
            tier: "S",
        },
        {
            icon: Bot,
            name: "AI Whisperer",
            desc: "Execute complex privacy strategies using natural language. 'Send 10 SOL to mom privately'.",
            tier: "S",
        },
    ];

    return (
        <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500"><ScrambleText text="ARSENAL" /></span>
                    </h2>
                    <p className="text-gray-500 font-mono text-sm max-w-md">
                        Equip yourself with the highest-grade privacy artifacts.
                        Only the truly worthy can wield the full power regarding the Ashborn&apos;s Army.               </p>
                </div>
                <div className="font-mono text-xs text-purple-500 mt-4 md:mt-0">
                    {'// SYSTEM_STATUS: ONLINE'} <br />
                    {'// INVENTORY_LOADED: 100%'}
                </div>
            </div>

            {/* Inventory Grid - Bento Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[240px]">

                {/* 1. Shield (Hero Item) */}
                <InventorySlot
                    item={items[0]}
                    index={0}
                    isHero={true}
                />

                {/* Other Items */}
                {items.slice(1).map((item, i) => (
                    <InventorySlot key={i} item={item} index={i + 1} />
                ))}

            </div>

        </section >
    );
}
