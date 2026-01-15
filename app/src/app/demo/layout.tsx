'use client';

import Link from 'next/link';
import { ArrowLeft01Icon, Home01Icon } from 'hugeicons-react';
import ClientWalletButton from '@/components/ui/ClientWalletButton';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-purple-500/30 selection:text-purple-200">
            {/* Background Grid (Vercel Style) */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
            />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-purple-900/10 blur-[100px] pointer-events-none z-0" />

            {/* Header (Apple Style Glass) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition group">
                        <Home01Icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                        <span>Home</span>
                    </Link>
                    <span className="h-4 w-px bg-white/10" />
                    <Link href="/docs" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition group">
                        <span>Docs</span>
                    </Link>
                    <span className="h-4 w-px bg-white/10 hidden md:block" />
                    <span className="font-medium text-sm tracking-tight text-white/90 hidden md:block">Preview Environment</span>
                    <div className="flex items-center gap-2 text-[10px] font-mono border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full text-amber-300">
                        SIMULATION_MODE
                    </div>
                </div>

                <div>
                    <ClientWalletButton className="!bg-purple-600 hover:!bg-purple-500 !rounded-lg !h-8 !text-xs !font-medium !px-4" />
                </div>
            </header>

            <main className="relative z-10 pt-20 px-4 md:px-6 pb-20 max-w-5xl mx-auto">
                {children}
            </main>
        </div>
    );
}
