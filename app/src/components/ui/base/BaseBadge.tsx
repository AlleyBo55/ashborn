'use client';

import { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type BadgeVariant = 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray';

interface BaseBadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    icon?: ElementType;
    className?: string;
    animate?: boolean;
}

const colorStyles = {
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
        icon: 'text-blue-400',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20',
        icon: 'text-purple-400',
    },
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        icon: 'text-green-400',
    },
    amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        icon: 'text-amber-400',
    },
    red: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        icon: 'text-red-400',
    },
    gray: {
        bg: 'bg-white/5',
        text: 'text-gray-400',
        border: 'border-white/10',
        icon: 'text-gray-500',
    },
};

export function BaseBadge({
    children,
    variant = 'gray',
    icon: Icon,
    className,
    animate = false
}: BaseBadgeProps) {
    const styles = colorStyles[variant];

    const Content = (
        <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm',
            styles.bg,
            styles.text,
            styles.border,
            className
        )}>
            {Icon && <Icon className={cn("w-3.5 h-3.5 mr-1.5", styles.icon)} />}
            {children}
        </span>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block"
            >
                {Content}
            </motion.div>
        );
    }

    return Content;
}
