'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { Zap, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Store ---
type ToastType = 'success' | 'alert' | 'info';

interface ToastState {
    message: string;
    subtext?: string;
    type: ToastType;
    visible: boolean;
    show: (msg: string, sub?: string, type?: ToastType) => void;
    hide: () => void;
}

export const useSystemToast = create<ToastState>((set) => ({
    message: '',
    subtext: '',
    type: 'success',
    visible: false,
    show: (msg, sub, type = 'success') => {
        set({ visible: true, message: msg, subtext: sub, type });
        setTimeout(() => set({ visible: false }), 3000);
    },
    hide: () => set({ visible: false })
}));

// --- Component ---
export default function SystemToast() {
    const { message, subtext, type, visible } = useSystemToast();

    const colors = {
        success: 'border-arise-blue bg-arise-blue/10 text-arise-blue',
        alert: 'border-red-500 bg-red-500/10 text-red-500',
        info: 'border-purple-500 bg-purple-500/10 text-purple-500'
    };

    const icons = {
        success: Zap,
        alert: AlertTriangle,
        info: CheckCircle
    };

    const Icon = icons[type];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 50, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                    className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm pointer-events-none"
                >
                    <div className={`
                        relative p-1 bg-monarch-black/90 backdrop-blur-md border-2 ${colors[type].split(' ')[0]}
                        clip-path-polygon shadow-[0_0_30px_rgba(0,0,0,0.5)]
                    `}>
                        {/* Scanline */}
                        <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none" />

                        <div className="flex items-center gap-4 p-4">
                            <div className={`p-2 rounded border ${colors[type]}`}>
                                <Icon className="w-8 h-8 animate-pulse" />
                            </div>
                            <div>
                                <h3 className={`font-manga text-2xl uppercase italic ${colors[type].split(' ')[2]}`}>
                                    {message}
                                </h3>
                                {subtext && (
                                    <p className="font-mono text-xs text-gray-300">
                                        {subtext}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Corner Decorations */}
                        <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
