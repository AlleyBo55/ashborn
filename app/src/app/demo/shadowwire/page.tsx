'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function ShadowWireDemoPage() {
    const [step, setStep] = useState<'idle' | 'generating' | 'complete'>('idle');
    const { status, setStatus, reset, isLoading } = useDemoStatus();
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

    const runShadowWireDemo = async () => {
        try {
            setStatus('loading');
            setStep('generating');

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
            console.error('Ashborn error:', err);
            setStep('idle');
        }
    };

    return (
        <TerminalDemoWrapper
            title="SHADOWWIRE_NATIVE"
            tag="STELATH_INFRASTRUCTURE"
            description="Generate stealth addresses using Vitalik's ECDH formula. Native Ashborn ShadowWire implementation."
        >
            {/* Tech Stack Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 border border-purple-500/30">⚡ Native</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 border border-cyan-500/30">⚡ ShadowWire</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 border border-green-500/30">⚡ Ashborn</span>
            </div>
            <TerminalSection title="STEALTH_ADDRESS_PROTOCOL">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ Sender generates random keypair (r, R)</p>
                    <p>$ Shared secret via ECDH (S = r*A)</p>
                    <p>$ Stealth Address P = H(S)*G + B</p>
                </div>
            </TerminalSection>

            {step === 'complete' ? (
                <>
                    <TerminalSection title="GENERATED_KEYS" variant="success">
                        <div className="space-y-4">
                            <div className="bg-purple-500/10 border border-purple-500/20 p-4">
                                <div className="text-xs text-purple-400 mb-2 font-mono">$ EPHEMERAL_KEY (R)</div>
                                <div className="text-xs text-purple-200 font-mono break-all">{ephemeralKey}</div>
                            </div>

                            <div className="text-center text-xs text-gray-600">↓ ECDH_SHARED_SECRET ↓</div>

                            <div className="bg-green-500/10 border border-green-500/20 p-4">
                                <div className="text-xs text-green-400 mb-2 font-mono">$ STEALTH_ADDRESS (P)</div>
                                <div className="text-xs text-green-200 font-mono break-all">{stealthAddress}</div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 p-3">
                                <div className="text-xs text-blue-400 mb-1 font-mono">$ VIEW_TAG</div>
                                <code className="text-sm text-blue-300 font-mono">{viewTag}</code>
                            </div>
                        </div>
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ GENERATE_ANOTHER</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="GENERATOR">
                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 p-4">
                            <div className="text-xs text-gray-500 mb-2 font-mono">$ EPHEMERAL_KEY (R)</div>
                            <div className="text-xs text-gray-600 font-mono">waiting_to_generate...</div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-4">
                            <div className="text-xs text-gray-500 mb-2 font-mono">$ STEALTH_ADDRESS (P)</div>
                            <div className="text-xs text-gray-600 font-mono">waiting_to_generate...</div>
                        </div>

                        <TerminalButton onClick={runShadowWireDemo} loading={isLoading}>
                            {isLoading ? '$ GENERATING...' : '$ GENERATE_STEALTH_ADDRESS'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_api • no_wallet_required
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`import { PrivacyRelay } from '@alleyboss/ashborn-sdk';

const relay = new PrivacyRelay({
  relayKeypair: process.env.RELAY_KEYPAIR,
  rpcUrl: process.env.RPC_URL
});

// Generate Stealth Address (Server-Side)
// Underlying: P = H(r*A)*G + B
const result = await relay.generateStealth({
  recipientHint: 'user_wallet_123',
  nonce: 0
});

return {
  stealthAddress: result.stealthAddress,
  viewKey: result.viewKey,
  spendKey: result.spendKey
};`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
