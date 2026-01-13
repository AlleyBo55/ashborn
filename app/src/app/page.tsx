import Hero from '@/components/landing/Hero';
import Comparison from '@/components/landing/Comparison';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-monarch-black text-white selection:bg-arise-blue selection:text-white">
            {/* Global Background (Fixed) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-shadow-lair bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-monarch-black via-transparent to-monarch-black/80" />
            </div>

            <div className="z-10 w-full relative">
                <Hero />

                {/* Transition Fog */}
                <div className="w-full h-32 bg-gradient-to-b from-transparent to-monarch-black relative z-20 -mt-32 pointer-events-none" />

                <div className="bg-monarch-black w-full relative z-20 pb-20">
                    <Comparison />
                </div>

                {/* Footer Minimal */}
                <footer className="w-full py-10 text-center text-gray-600 text-sm font-mono relative z-20 bg-monarch-black border-t border-gray-900">
                    <p>ASHBORN PROTOCOL © 2026</p>
                    <p className="mt-2 text-xs">"I alone level up."</p>
                </footer>
            </div>
        </main>
    );
}
