'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface VisualizerSectionProps {
    title: string;
    icon: string;
    badge: string;
    badgeColor: 'red' | 'purple';
    children: ReactNode;
}

function VisualizerSection({ title, icon, badge, badgeColor, children }: VisualizerSectionProps) {
    const colors = {
        red: { bg: 'bg-[#1a1b26] border-white/10', header: 'bg-[#13141f] border-white/5', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
        purple: { bg: 'bg-[#0E0E0E] border-purple-500/30', header: 'bg-purple-900/10 border-purple-500/20', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    };

    const c = colors[badgeColor];

    return (
        <div className={`${c.bg} border rounded-xl overflow-hidden shadow-2xl transition-all`}>
            <div className={`px-4 py-3 ${c.header} border-b flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${badgeColor === 'red' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'} flex items-center justify-center text-[10px] font-bold`}>
                        {icon}
                    </div>
                    <span className={`text-xs font-medium ${badgeColor === 'red' ? 'text-gray-400' : 'text-purple-200'}`}>{title}</span>
                </div>
                <span className={`text-[10px] ${c.badge} px-2 py-0.5 rounded border`}>{badge}</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-4">
                {children}
            </div>
        </div>
    );
}

interface PrivacyVisualizerProps {
    publicView: ReactNode;
    privateView: ReactNode;
    className?: string;
}

export function PrivacyVisualizer({ publicView, privateView, className = '' }: PrivacyVisualizerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`grid md:grid-cols-2 gap-6 mt-8 ${className}`}
        >
            <VisualizerSection
                title="Solscan (Public Ledger)"
                icon="S"
                badge="PUBLIC"
                badgeColor="red"
            >
                {publicView}
            </VisualizerSection>

            <VisualizerSection
                title="Ashborn Vault (Private)"
                icon="A"
                badge="ENCRYPTED"
                badgeColor="purple"
            >
                {privateView}
            </VisualizerSection>
        </motion.div>
    );
}
