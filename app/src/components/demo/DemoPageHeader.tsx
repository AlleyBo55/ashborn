'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const colorClasses = {
    purple: { badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20', icon: 'text-purple-400' },
    blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20', icon: 'text-blue-400' },
    green: { badge: 'bg-green-500/10 text-green-300 border-green-500/20', icon: 'text-green-400' },
    amber: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: 'text-amber-400' },
};

interface DemoPageHeaderProps {
    icon: LucideIcon;
    badge: string;
    title: string;
    description: string;
    color?: keyof typeof colorClasses;
}

export function DemoPageHeader({ icon: Icon, badge, title, description, color = 'purple' }: DemoPageHeaderProps) {
    const colors = colorClasses[color];
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 ${colors.badge} px-4 py-2 rounded-full text-sm mb-6 border`}>
                <Icon className="w-4 h-4" />
                {badge}
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{title}</h1>
            <p className="text-gray-400 max-w-md mx-auto">{description}</p>
        </motion.div>
    );
}
