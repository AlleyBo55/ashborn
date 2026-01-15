'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import {
    GhostIcon,
    Key01Icon,
    Shield02Icon,
    RefreshIcon,
    Loading03Icon,
    ViewOffIcon
} from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import DemoPageHeader from '@/components/demo/DemoPageHeader';
import BaseCard from '@/components/ui/base/BaseCard';
import InfoCard from '@/components/demo/InfoCard';
import BaseButton from '@/components/ui/base/BaseButton';

type Step = 'idle' | 'generating' | 'scanning' | 'complete';

export default function RadrDemoPage() {
    const { connected, publicKey } = useWallet();
    const { shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [ephemeralKey, setEphemeralKey] = useState<string | null>(null);
    const [viewTag, setViewTag] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setStealthAddress(null);
        setEphemeralKey(null);
        setViewTag(null);
    };

    const runRadrDemo = async () => {
        if (!connected || !publicKey || !shadowWire || !isReady) return;

        try {
            // Step 1: Generate Stealth Address
            setStep('generating');

            // Generate a stealth address pair
            // This normally happens on the sender side using the recipient's scan/spend keys
            // For demo, we treat the connected wallet as the recipient
            const stealth = await shadowWire.generateStealthAddress();

            await new Promise(r => setTimeout(r, 800)); // Visual delay

            setStealthAddress(stealth.stealthPubkey.toBase58());
            setEphemeralKey(stealth.ephemeralPubkey.toBase58());

            // In a real implementation, view tag is derived from shared secret (High byte)
            // Here we visualize it for the demo
            setViewTag(stealth.stealthPubkey.toBase58().slice(0, 2));

            // Step 2: "Scanning" simulation
            setStep('scanning');
            await new Promise(r => setTimeout(r, 1500));
            // Simulate scanning process where recipient identifies the output using view key

            setStep('complete');
        } catch (err) {
            console.error('Radr Demo Error:', err);
            setStep('idle');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <DemoPageHeader
                badge="ShadowWire"
                title="Radr Labs Integration"
                description="Experience the core cryptography behind ShadowWire. Generate stealth addresses and ephemeral keys that make transactions unlinkable."
                icon={GhostIcon}
                status={step === 'generating' || step === 'scanning' ? 'processing' : 'active'}
            />

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visualizer Panel */}
                <BaseCard
                    title="Stealth Generator"
                    icon={Key01Icon}
                    className="relative overflow-hidden group"
                >
                    {!connected ? (
                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                            <p className="text-gray-400 mb-4">Connect wallet to generate keys</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl border transition-all duration-500 ${step === 'generating' || stealthAddress ? 'bg-purple-500/10 border-purple-500/20' : 'bg-white/5 border-white/5'}`}>
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                    <GhostIcon className="w-3 h-3" /> Ephemeral Key (R)
                                </div>
                                <div className="font-mono text-xs md:text-sm text-purple-200 break-all">
                                    {ephemeralKey || 'waiting to generate...'}
                                </div>
                            </div>

                            <div className="flex justify-center text-gray-600">
                                <span className="text-xs px-2 bg-[#0A0A0A] z-10 relative">Derived via ECDH Shared Secret</span>
                                <div className="absolute w-full h-px bg-white/5 top-1/2 -z-0"></div>
                            </div>

                            <div className={`p-4 rounded-xl border transition-all duration-500 ${step === 'generating' || stealthAddress ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                    <ViewOffIcon className="w-3 h-3" /> Stealth Address (P)
                                </div>
                                <div className="font-mono text-xs md:text-sm text-green-200 break-all">
                                    {stealthAddress || 'waiting to generate...'}
                                </div>
                            </div>

                            <BaseButton
                                onClick={step === 'complete' ? resetDemo : runRadrDemo}
                                disabled={!connected || (step !== 'idle' && step !== 'complete')}
                                loading={step === 'generating' || step === 'scanning'}
                                loadingText="Computing Elliptic Curve..."
                                icon={step === 'complete' ? RefreshIcon : GhostIcon}
                                className="w-full mt-6"
                            >
                                {step === 'complete' ? 'Generate Another' : 'Generate Stealth Address'}
                            </BaseButton>
                        </div>
                    )}
                </BaseCard>

                {/* Info Panel */}
                <div className="space-y-6">
                    <InfoCard
                        title="How ShadowWire Works"
                        icon={GhostIcon}
                        steps={[
                            'Sender generates random keypair (r, R)',
                            'Shared secret derived via ECDH (S = r*A)',
                            'Stealth Address P constructed (P = H(S)*G + B)'
                        ]}
                    />

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <CodeBlock
                            language="typescript"
                            code={`// Real ShadowWire SDK Usage
const stealth = await shadowWire.generateStealthAddress();

console.log({
  ephemeral: stealth.ephemeralPubkey, // Public
  stealth: stealth.stealthPubkey      // Public
});

// To prove ownership (Scanning):
const isMine = await shadowWire.checkOwnership(
  stealth.stealthPubkey, 
  stealth.ephemeralPubkey
);`}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
