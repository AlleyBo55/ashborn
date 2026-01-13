'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Shield, Zap, EyeOff, Ghost, Lock, Network } from 'lucide-react';
import { useState } from 'react';
import ScrambleText from '../ui/ScrambleText';

const InventorySlot = ({
    icon: Icon,
    name,
    type,
    rarity = "common",
    stats
}: {
    icon: any;
    name: string;
    type: string;
    rarity?: "common" | "rare" | "epic" | "legendary";
    stats: string[];
}) => {
    const rarityColors = {
        common: "border-gray-700 bg-gray-900/50 text-gray-400",
        rare: "border-blue-500/50 bg-blue-900/20 text-blue-400",
        epic: "border-purple-500/50 bg-purple-900/20 text-purple-400",
        legendary: "border-amber-500/50 bg-amber-900/20 text-amber-400"
    };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            onMouseMove={handleMouseMove}
            className={`relative aspect-square border-2 ${rarityColors[rarity]} p-4 flex flex-col justify-between group cursor-pointer overflow-hidden backdrop-blur-sm`}
        >
            {/* Rarity Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header */}
            <div className="flex justify-between items-start text-[9px] uppercase font-mono tracking-wider opacity-60">
                <span>{type}</span>
                <span>LVL.MAX</span>
            </div>

            {/* Icon Center */}
            <div className="flex justify-center items-center py-4">
                <Icon className={`w-12 h-12 stroke-[1.5] drop-shadow-lg ${rarity === 'legendary' ? 'animate-pulse text-amber-300' :
                    rarity === 'epic' ? 'text-purple-300' :
                        rarity === 'rare' ? 'text-blue-300' : 'text-gray-300'
                    }`} />
            </div>

            {/* Footer / Tooltip Overlay */}
            <div className="absolute inset-0 bg-black/90 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-center gap-2">
                <h4 className={`text-sm font-bold ${rarity === 'legendary' ? 'text-amber-400' :
                    rarity === 'epic' ? 'text-purple-400' : 'text-blue-400'
                    }`}>{name}</h4>
                <div className="space-y-1">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {stat}
                        </div>
                    ))}
                </div>
            </div>

            {/* Name Label (Visible when not hovering) */}
            <div className="text-center group-hover:opacity-0 transition-opacity">
                <span className="text-xs font-bold uppercase tracking-widest">{name}</span>
            </div>

            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          400px circle at ${mouseX}px ${mouseY}px,
                          rgba(168, 85, 247, 0.15),
                          transparent 80%
                        )
                    `,
                }}
            />
        </motion.div>
    );
};

export default function MarketingArsenal() {
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

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {/* 1. Shield */}
                <InventorySlot
                    icon={Shield}
                    name="Void Shield"
                    type="Defense"
                    rarity="legendary"
                    stats={[
                        "+100% Transaction Privacy",
                        "zk-SNARK Plating",
                        "Auto-Audit Logs"
                    ]}
                />

                {/* 2. Cloak */}
                <InventorySlot
                    icon={Ghost}
                    name="Stealth Cloak"
                    type="Utility"
                    rarity="epic"
                    stats={[
                        "Untraceable Addresses (ECDH)",
                        "Invisible Metadata",
                        "Relayer Support"
                    ]}
                />

                {/* 3. Dagger */}
                <InventorySlot
                    icon={Zap}
                    name="Flash Strike"
                    type="Offense"
                    rarity="rare"
                    stats={[
                        "<400ms Confirmation",
                        "Solana Mainnet Speed",
                        "Low Gas Cost"
                    ]}
                />

                {/* 4. Eyes (Compliance) */}
                <InventorySlot
                    icon={EyeOff}
                    name="View Key"
                    type="Key Item"
                    rarity="epic"
                    stats={[
                        "Selective Disclosure",
                        "Compliance Proofs",
                        "Auditor Access"
                    ]}
                />

                {/* 5. Network */}
                <InventorySlot
                    icon={Network}
                    name="Swarm Node"
                    type="Infrastructure"
                    rarity="rare"
                    stats={[
                        "Decentralized Relayers",
                        "Tor Integration",
                        "High Availability"
                    ]}
                />

                {/* 6. Lock */}
                <InventorySlot
                    icon={Lock}
                    name="Timelock Vault"
                    type="Storage"
                    rarity="common"
                    stats={[
                        "24h Privacy Delay",
                        "Anti-Analysis Buffer",
                        "Secure Custody"
                    ]}
                />

                {/* Empty Slots for aesthetic */}
                <div className="aspect-square border border-gray-900/50 bg-black/20 flex items-center justify-center opacity-30">
                    <span className="text-[10px] font-mono text-gray-700">EMPTY_SLOT</span>
                </div>
                <div className="aspect-square border border-gray-900/50 bg-black/20 flex items-center justify-center opacity-30">
                    <span className="text-[10px] font-mono text-gray-700">LOCKED</span>
                </div>

            </div>

            {/* Footer Stats Removed as per user request */}

        </section>
    );
}
