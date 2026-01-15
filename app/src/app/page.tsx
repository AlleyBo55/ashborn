import CinematicHero from '@/components/landing/CinematicHero';
import ParallaxHero from '@/components/landing/ParallaxHero';
import SystemWarning from '@/components/landing/SystemWarning';
import SkillCombo from '@/components/landing/SkillCombo';
import Comparison from '@/components/landing/Comparison';
import MarketingArsenal from '@/components/landing/MarketingArsenal';
import MarketingWhy from '@/components/landing/MarketingWhy';
import HowAshbornWorks from '@/components/landing/HowAshbornWorks';
import ShadowCursor from '@/components/ui/ShadowCursor';
import SystemToast from '@/components/ui/SystemToast';
import PortalTransition from '@/components/ui/PortalTransition';
import SlashSection from '@/components/ui/SlashSection';
import MonarchAmbience from '@/components/ui/MonarchAmbience';
import PoweredBySolana from '@/components/ui/PoweredBySolana';
import GuildAlliance from '@/components/landing/GuildAlliance';
import ProtectionFeed from '@/components/landing/ProtectionFeed';

import SystemCapabilities from '@/components/landing/SystemCapabilities';
import ShadowECDHShowcase from '@/components/landing/ShadowECDHShowcase';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-monarch-black text-white selection:bg-arise-blue selection:text-white overflow-x-hidden cursor-none">
            <PortalTransition />
            <ShadowCursor />
            <SystemToast />
            <MonarchAmbience />

            <div className="z-10 w-full relative space-y-0 pb-20">
                {/* Hero remains top, no slant */}
                <ParallaxHero />

                <GuildAlliance />

                {/* ECDH SHOWCASE - NEW */}
                <ShadowECDHShowcase />

                {/* System Alert - Slant Right ("Opening the wound") */}
                <SlashSection slant="right" className="relative z-20">
                    <SystemWarning />
                </SlashSection>

                {/* THE WHY - Slant Left ("The History") */}
                <SlashSection slant="left" className="relative z-20">
                    <MarketingWhy />
                </SlashSection>

                {/* SYSTEM CAPABILITIES - Viral Demo Showcase */}
                <SlashSection slant="none" className="relative z-25 bg-black/50">
                    <SystemCapabilities />
                </SlashSection>

                {/* HOW ASHBORN WORKS - Highlighted Section */}
                <SlashSection slant="none" className="relative z-25">
                    <HowAshbornWorks />
                </SlashSection>

                {/* THE ARSENAL - No Slant (Top Grid) */}
                <SlashSection slant="none" className="relative z-20">
                    <MarketingArsenal />
                </SlashSection>

                {/* Skill Combo - Slant Left ("The Technique") */}
                <SlashSection slant="left" className="relative z-30">
                    <SkillCombo />
                </SlashSection>

                {/* Comparison - No slant (Stable ground) */}
                <SlashSection slant="none" className="relative z-40">
                    <Comparison />
                </SlashSection>

                {/* Footer Premium */}
                <div className="relative z-50">
                    <PoweredBySolana />
                </div>
            </div>
        </main>
    );
}
