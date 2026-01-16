'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewOffIcon, Key01Icon, Shield02Icon, RefreshIcon, AlertCircleIcon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function RadrDemoPage() {
    const [step, setStep] = useState<'idle' | 'generating' | 'complete'>('idle');
    const { status, setStatus, reset, isSuccess, isLoading } = useDemoStatus();
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [ephemeralKey, setEphemeralKey] = useState<string | null>(null);
    const [viewTag, setViewTag] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        reset();
        setStealthAddress(null);
        setEphemeralKey(null);
        setViewTag(null);
    };

    const runRadrDemo = async () => {
        try {
            setStatus('loading');
            setStep('generating');

            // Generate stealth address via API
            const res = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: 'demo-user' } })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Generation failed');

            await new Promise(r => setTimeout(r, 600));

            setStealthAddress(data.stealthAddress);
            setEphemeralKey(data.viewKey);
            setViewTag(data.stealthAddress.slice(0, 4));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Radr error:', err);
            setStep('idle');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Demo Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
                <div className="flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="text-amber-300 font-medium mb-1">Server-Side Demo</p>
                        <p className="text-amber-200/70 text-xs">Stealth addresses generated via /api/ashborn. No wallet required.</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                badge="ShadowWire"
                title="Radr Labs Integration"
                description="Generate stealth addresses. Ashborn Privacy Relay keeps your identity hidden from underlying protocols."
                icon={ViewOffIcon}
                privacyRelay
            />

            <div className="grid md:grid-cols-2 gap-8">
                {/* Generator Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Key01Icon className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold">Stealth Generator</h3>
                    </div>

                    <div className="space-y-6">
                        <div className={`p-4 rounded-xl border transition-all ${stealthAddress ? 'bg-purple-500/10 border-purple-500/20' : 'bg-white/5 border-white/5'}`}>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                <ViewOffIcon className="w-3 h-3" /> Ephemeral Key (R)
                            </div>
                            <div className="font-mono text-xs text-purple-200 break-all">
                                {ephemeralKey || 'waiting to generate...'}
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-600">↓ Derived via ECDH Shared Secret ↓</div>

                        <div className={`p-4 rounded-xl border transition-all ${stealthAddress ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                <ViewOffIcon className="w-3 h-3" /> Stealth Address (P)
                            </div>
                            <div className="font-mono text-xs text-green-200 break-all">
                                {stealthAddress || 'waiting to generate...'}
                            </div>
                        </div>

                        {stealthAddress && (
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="text-xs text-gray-400">View Tag</div>
                                <code className="text-sm text-blue-300 font-mono">{viewTag}</code>
                            </div>
                        )}

                        <DemoButton
                            onClick={step === 'complete' ? resetDemo : runRadrDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={step === 'complete' ? RefreshIcon : ViewOffIcon}
                            variant="gradient"
                        >
                            {step === 'complete' ? 'Generate Another' : 'Generate Stealth Address'}
                        </DemoButton>
                    </div>
                </motion.div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <InfoCard
                        title="How ShadowWire Works"
                        icon={ViewOffIcon}
                        steps={[
                            { label: 'Sender generates random keypair (r, R)', color: 'blue' },
                            { label: 'Shared secret via ECDH (S = r*A)', color: 'purple' },
                            { label: 'Stealth Address P = H(S)*G + B', color: 'green' }
                        ]}
                    />

                    <CodeBlock
                        language="typescript"
                        code={`// Generate via API (no SDK required)
const res = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({
    action: 'stealth',
    params: { recipient: 'wallet_address' }
  })
});

const { stealthAddress, viewKey, spendKey } = await res.json();`}
                    />
                </div>
            </div>
        </div>
    );
}
