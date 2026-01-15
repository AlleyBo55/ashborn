'use client';

import { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import { Loading03Icon } from 'hugeicons-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming standard util

// Define variants strictly
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface BaseButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
    icon?: ElementType; // HugeIcon component type
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 border-transparent',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border-white/10',
    outline: 'bg-transparent text-white border-white/20 hover:bg-white/5',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border-transparent',
    gradient: 'bg-purple-600 text-white hover:bg-purple-500 border-transparent shadow-[0_0_20px_rgba(147,51,234,0.3)]',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    icon: 'p-2.5',
};

export function BaseButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    ...props
}: BaseButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-all border outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <Loading03Icon className="w-5 h-5 animate-spin mr-2" />
                    {loadingText || children}
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && (
                        <Icon className={cn("w-5 h-5", children ? "mr-2" : "")} />
                    )}
                    {children}
                    {Icon && iconPosition === 'right' && (
                        <Icon className={cn("w-5 h-5", children ? "ml-2" : "")} />
                    )}
                </>
            )}
        </motion.button>
    );
}
