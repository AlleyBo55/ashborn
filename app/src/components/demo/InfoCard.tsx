'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

const colorClasses = {
    blue: 'from-blue-900/20 to-black border-blue-500/20',
    purple: 'from-purple-900/20 to-black border-purple-500/20',
    green: 'from-green-900/20 to-black border-green-500/20',
    amber: 'from-amber-900/20 to-black border-amber-500/20',
};

interface Step {
    label: string;
    color: 'blue' | 'purple' | 'green' | 'amber';
}

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    steps?: Step[];
    color?: keyof typeof colorClasses;
    delay?: number;
}

export function InfoCard({ icon: Icon, title, children, steps, color = 'blue', delay = 0.05 }: InfoCardProps) {
    const stepColors = {
        blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 mb-8`}
        >
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${color}-400`} />
                {title}
            </h3>
            <div className="text-gray-400 text-sm mb-4 leading-relaxed">{children}</div>
            {steps && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {steps.map((step, i) => (
                        <span key={i}>
                            <span className={`${stepColors[step.color]} px-3 py-1.5 rounded-lg border`}>{step.label}</span>
                            {i < steps.length - 1 && <span className="text-gray-600 mx-2">→</span>}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
