'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import {
    ViewOffIcon,
    Key01Icon,
    Shield02Icon,
    RefreshIcon,
    Loading03Icon
} from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { Transaction, SystemProgram } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { TxLink } from '@/components/demo';
import { DemoPageHeader } from '@/components/demo/DemoPageHeader';
import { BaseCard } from '@/components/ui/base/BaseCard';
import { InfoCard } from '@/components/demo/InfoCard';
import { BaseButton } from '@/components/ui/base/BaseButton';

type Step = 'idle' | 'generating' | 'scanning' | 'complete';

export default function RadrDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [ephemeralKey, setEphemeralKey] = useState<string | null>(null);
    const [viewTag, setViewTag] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setStealthAddress(null);
        setEphemeralKey(null);
        setViewTag(null);
        setTxSignature(null);
    };

    const runRadrDemo = async () => {
        if (!connected || !publicKey) return;

        if (!shadowWire || !isReady) {
            alert("SDK is still initializing. Please wait a moment.");
            return;
        }

        try {
            // Step 1: Generate Stealth Address
            setStep('generating');

            let stealth: any = null;
            let attempts = 0;
            const maxAttempts = 5;

            while (!stealth && attempts < maxAttempts) {
                try {
                    attempts++;
                    stealth = await shadowWire.generateStealthAddress();
                } catch (e: any) {
                    console.warn(`Attempt ${attempts} failed:`, e.message);
                    if (attempts === maxAttempts) throw e;
                    await new Promise(r => setTimeout(r, 200));
                }
            }

            if (!stealth) throw new Error("Failed to generate stealth address after retries");

            await new Promise(r => setTimeout(r, 600));

            setStealthAddress(stealth.stealthPubkey.toBase58());
            setEphemeralKey(stealth.ephemeralPubkey.toBase58());
            setViewTag(stealth.stealthPubkey.toBase58().slice(0, 2));
            setStep('complete');

        } catch (err) {
            console.error('Radr Demo Error:', err);
            setStep('idle');
        }
    };

    const verifyOnChain = async () => {
        if (!connected || !publicKey || !stealthAddress) return;

        try {
            setStep('scanning');

            const { PublicKey } = await import('@solana/web3.js');
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(stealthAddress),
                    lamports: 1000,
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            if (sendTransaction) {
                const signature = await sendTransaction(transaction, connection);
                console.log('Transaction sent:', signature);
                await connection.confirmTransaction(signature, 'confirmed');
                setTxSignature(signature);
            }

            setStep('complete');
        } catch (err: any) {
            console.error('Verification error:', err);
            alert(`Transaction failed: ${err.message || 'Unknown error'}`);
            setStep('complete');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <DemoPageHeader
                badge="ShadowWire"
                title="Radr Labs Integration"
                description="Radr provides the stealth address cryptography (ECDH). Ashborn integrates it into the SDK for easy use."
                icon={ViewOffIcon}
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
                                    <ViewOffIcon className="w-3 h-3" /> Ephemeral Key (R)
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

                            {txSignature && (
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-xs text-gray-400 mb-2">✅ Verified on Solana Devnet</div>
                                    <TxLink signature={txSignature} className="text-sm font-semibold" />
                                </div>
                            )}

                            {stealthAddress && !txSignature && step === 'complete' && (
                                <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                                    <div className="text-xs text-gray-400 mb-2">💡 Optional: Send SOL to verify on-chain</div>
                                    <div className="text-xs text-gray-500">The stealth address is already generated and ready to use. You can optionally send a small amount to verify it exists on Solana.</div>
                                </div>
                            )}

                            <BaseButton
                                onClick={step === 'complete' ? resetDemo : runRadrDemo}
                                disabled={!connected || (step !== 'idle' && step !== 'complete')}
                                loading={step === 'generating' || step === 'scanning'}
                                loadingText={step === 'scanning' ? "Verifying on Blockchain..." : "Computing Elliptic Curve..."}
                                icon={step === 'complete' ? RefreshIcon : ViewOffIcon}
                                className="w-full"
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
                        icon={ViewOffIcon}
                        steps={[
                            { label: 'Sender generates random keypair (r, R)', color: 'blue' },
                            { label: 'Shared secret derived via ECDH (S = r*A)', color: 'purple' },
                            { label: 'Stealth Address P constructed (P = H(S)*G + B)', color: 'green' }
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

// To scan for payments (recipient side):
const matches = shadowWire.scanForPayments(
  viewPrivKey,
  spendPubKey,
  [stealth.ephemeralPubkey.toBytes()]
);`}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
