import Hero from '@/components/landing/Hero';
import SystemWarning from '@/components/landing/SystemWarning';
import SkillCombo from '@/components/landing/SkillCombo';
import Comparison from '@/components/landing/Comparison';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-monarch-black text-white selection:bg-arise-blue selection:text-white overflow-x-hidden">
            {/* Global Background (Fixed) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-webtoon-army bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-monarch-black via-monarch-black/90 to-monarch-black/50" />
            </div>

            <div className="z-10 w-full relative space-y-20 pb-20">
                <Hero />

                <SystemWarning />

                <SkillCombo />

                <Comparison />

                {/* Footer Minimal */}
                <footer className="w-full py-10 text-center text-gray-600 text-sm font-mono relative z-20 bg-monarch-black border-t border-gray-900">
                    <p>ASHBORN PROTOCOL © 2026</p>
                    <p className="mt-2 text-xs">"I alone level up."</p>
                </footer>
            </div>
        </main>
    );
}
