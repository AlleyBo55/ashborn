'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';

type CardVariant = 'default' | 'gradient-blue' | 'gradient-purple' | 'gradient-green' | 'gradient-amber' | 'glass';

interface BaseCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    variant?: CardVariant;
    icon?: ElementType;
    title?: string;
    delay?: number;
}

const variants = {
    default: 'bg-white/[0.03] border-white/10',
    'gradient-blue': 'bg-gradient-to-br from-blue-900/20 to-black border-blue-500/20',
    'gradient-purple': 'bg-gradient-to-br from-purple-900/20 to-black border-purple-500/20',
    'gradient-green': 'bg-gradient-to-br from-green-900/20 to-black border-green-500/20',
    'gradient-amber': 'bg-gradient-to-br from-amber-900/20 to-black border-amber-500/20',
    glass: 'bg-white/5 backdrop-blur-md border-white/10',
};

const iconColors = {
    default: 'text-gray-400',
    'gradient-blue': 'text-blue-400',
    'gradient-purple': 'text-purple-400',
    'gradient-green': 'text-green-400',
    'gradient-amber': 'text-amber-400',
    glass: 'text-white',
};

export function BaseCard({
    children,
    className,
    variant = 'default',
    icon: Icon,
    title,
    delay = 0,
    ...props
}: BaseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn(
                'rounded-xl border p-6',
                variants[variant],
                className
            )}
            {...props}
        >
            {title && (
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    {Icon && <Icon className={cn("w-4 h-4", iconColors[variant])} />}
                    {title}
                </h3>
            )}
            {children}
        </motion.div>
    );
}
