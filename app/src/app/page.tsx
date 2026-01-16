import dynamic from 'next/dynamic';

// Static imports for critical above-the-fold content only
import SlashSection from '@/components/ui/SlashSection';
import PoweredBySolana from '@/components/ui/PoweredBySolana';

// Dynamic imports for heavy components - load only when needed
const ParallaxHero = dynamic(() => import('@/components/landing/ParallaxHero'), { ssr: true });
const SystemWarning = dynamic(() => import('@/components/landing/SystemWarning'), { ssr: true });
const SkillCombo = dynamic(() => import('@/components/landing/SkillCombo'), { ssr: true });
const ShadowAgentHighlight = dynamic(() => import('@/components/landing/ShadowAgentHighlight'), { ssr: true });
const Comparison = dynamic(() => import('@/components/landing/Comparison'), { ssr: true });
const MarketingArsenal = dynamic(() => import('@/components/landing/MarketingArsenal'), { ssr: true });
const MarketingWhy = dynamic(() => import('@/components/landing/MarketingWhy'), { ssr: true });
const HowAshbornWorks = dynamic(() => import('@/components/landing/HowAshbornWorks'), { ssr: true });
const GuildAlliance = dynamic(() => import('@/components/landing/GuildAlliance'), { ssr: true });
const SystemCapabilities = dynamic(() => import('@/components/landing/SystemCapabilities'), { ssr: true });
const ShadowECDHShowcase = dynamic(() => import('@/components/landing/ShadowECDHShowcase'), { ssr: true });
const PrivacyRelayShowcase = dynamic(() => import('@/components/landing/PrivacyRelayShowcase'), { ssr: true });

// Non-critical UI effects - load client-side only
const ShadowCursor = dynamic(() => import('@/components/ui/ShadowCursor'), { ssr: false });
const SystemToast = dynamic(() => import('@/components/ui/SystemToast'), { ssr: false });
const PortalTransition = dynamic(() => import('@/components/ui/PortalTransition'), { ssr: false });
const MonarchAmbience = dynamic(() => import('@/components/ui/MonarchAmbience'), { ssr: false });

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-monarch-black text-white selection:bg-arise-blue selection:text-white overflow-x-hidden cursor-none">
            <PortalTransition />
            <ShadowCursor />
            <SystemToast />
            {/* <MonarchAmbience /> - Disabled for performance testing */}

            <div className="z-10 w-full relative space-y-0 pb-20">
                {/* Hero remains top, no slant */}
                <ParallaxHero />

                <GuildAlliance />

                {/* SHADOW AGENT HIGHLIGHT - Featured Demo */}
                <ShadowAgentHighlight />

                {/* PRIVACY RELAY SHOWCASE - Hard Sell */}
                <PrivacyRelayShowcase />

                {/* ECDH SHOWCASE - Keypair Logic (Restored below Relay) */}
                <ShadowECDHShowcase />

                {/* System Alert - Slant Right ("Opening the wound") - HIDDEN as per request */}
                {/* <SlashSection slant="right" className="relative z-20">
                    <SystemWarning />
                </SlashSection> */}

                {/* THE WHY - Slant Left ("The History") */}
                <SlashSection slant="left" className="relative z-20">
                    <MarketingWhy />
                </SlashSection>

                {/* SYSTEM CAPABILITIES - Viral Demo Showcase */}
                <SlashSection slant="none" className="bg-black/50" wrapperClassName="z-30">
                    <SystemCapabilities />
                </SlashSection>

                {/* HOW ASHBORN WORKS - Highlighted Section */}
                <SlashSection slant="none" className="relative z-30">
                    <HowAshbornWorks />
                </SlashSection>

                {/* THE ARSENAL - No Slant (Top Grid) */}
                <SlashSection slant="none" className="relative z-20">
                    <MarketingArsenal />
                </SlashSection>

                {/* Skill Combo - HIDDEN for hackathon focus on Shadow Agent */}
                {/* <SlashSection slant="left" className="relative z-30">
                    <SkillCombo />
                </SlashSection> */}

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
