'use client';

import Link from 'next/link';
import ArrowLeft01Icon from 'hugeicons-react/dist/esm/icons/arrow_left_01_icon';
import Home01Icon from 'hugeicons-react/dist/esm/icons/home_01_icon';
import ClientWalletButton from '@/components/ui/ClientWalletButton';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-green-400 font-mono">
            {/* Scanline Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-5"
                style={{ 
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
                }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b-2 border-green-500/30 h-14 flex items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-4 text-xs">
                    <Link href="/demo" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
                        <ArrowLeft01Icon className="w-4 h-4" />
                        <span>BACK</span>
                    </Link>
                    <span className="text-green-500/30">|</span>
                    <Link href="/" className="text-gray-400 hover:text-green-400 transition">
                        HOME
                    </Link>
                    <span className="text-green-500/30">|</span>
                    <Link href="/docs" className="text-gray-400 hover:text-green-400 transition">
                        DOCS
                    </Link>
                    <span className="text-green-500/30 hidden md:inline">|</span>
                    <div className="hidden md:flex items-center gap-2 text-[10px] border border-green-500/30 bg-green-500/10 px-2 py-0.5">
                        <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                        DEVNET
                    </div>
                </div>

                <ClientWalletButton className="!bg-green-600 hover:!bg-green-500 !h-8 !text-xs !font-bold !px-4 !font-mono" />
            </header>

            <main className="relative z-10 pt-20 px-4 md:px-6 pb-20 max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
}
