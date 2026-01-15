'use client';

import { Loader2, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DemoButtonProps {
    onClick: () => void;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    icon?: LucideIcon;
    children: ReactNode;
    variant?: 'primary' | 'gradient' | 'secondary';
    className?: string;
}

export function DemoButton({
    onClick,
    loading = false,
    loadingText = 'Processing...',
    disabled = false,
    icon: Icon,
    children,
    variant = 'primary',
    className = '',
}: DemoButtonProps) {
    const variants = {
        primary: 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        gradient: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-white',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                </>
            )}
        </button>
    );
}
