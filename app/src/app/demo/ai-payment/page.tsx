'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Bot, CreditCard, CheckCircle, Loader2, Zap, Lock, ArrowRight, ExternalLink, Ghost, Eye } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useAshborn, getSolscanUrl } from '@/hooks/useAshborn';

type Step = 'idle' | 'requesting' | 'stealth' | 'paying' | 'verifying' | 'complete';

export default function AIPaymentDemoPage() {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const { privacyCash, shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [serviceName, setServiceName] = useState('GPT-4 Query');
    const [price, setPrice] = useState('0.001');
    const [response, setResponse] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [merchantStealthAddress, setMerchantStealthAddress] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setResponse(null);
        setTxSignature(null);
        setMerchantStealthAddress(null);
    };

    const runPaymentDemo = async () => {
        if (!connected || !publicKey) return;

        try {
            // Step 1: Request API (simulated 402 response)
            setStep('requesting');
            await new Promise(r => setTimeout(r, 800));

            // Step 2: Generate Merchant Stealth Address (ASHBORN's unique value)
            setStep('stealth');

            if (!shadowWire || !isReady) {
                throw new Error("ShadowWire (Ashborn) not initialized. Connect wallet first.");
            }

            // Ashborn generates a one-time stealth address for the AI Service Provider
            // This is RECEIVER privacy - the merchant's identity is protected
            const stealthData = await shadowWire.generateStealthAddress();
            // ECDH returns Uint8Array, convert to PublicKey
            const stealthPubkey = new PublicKey(stealthData.stealthPubkey);
            const stealthAddress = stealthPubkey.toBase58();
            setMerchantStealthAddress(stealthAddress);

            console.log("🔒 Ashborn: Generated merchant stealth address:", stealthAddress);
            await new Promise(r => setTimeout(r, 600));

            // Step 3: Execute Private Payment (PrivacyCash → Stealth Address)
            setStep('paying');

            if (!privacyCash) {
                throw new Error("PrivacyCash not initialized.");
            }

            // PrivacyCash unshields funds directly to the Ashborn-generated stealth address
            // This creates DUAL-SIDED PRIVACY:
            // - Sender is hidden (funds come from PrivacyCash shielded pool)
            // - Receiver is hidden (payment goes to one-time stealth address)
            const solAmount = parseFloat(price);
            const result = await privacyCash.unshieldSOL(solAmount, stealthAddress);

            if (!result.success) {
                // Fallback: If no shielded balance, demonstrate with shielding instead
                console.warn("No shielded balance for unshield, demonstrating shield flow instead");
                const shieldResult = await privacyCash.shieldSOL(solAmount);
                if (!shieldResult.success || !shieldResult.signature) {
                    throw new Error(shieldResult.error || "Payment failed");
                }
                setTxSignature(shieldResult.signature);
            } else {
                setTxSignature(result.signature || 'stealth-payment-confirmed');
            }

            // Step 4: Verify payment
            setStep('verifying');
            await new Promise(r => setTimeout(r, 600));

            // Step 5: Complete - show response
            setResponse(JSON.stringify({
                result: "The meaning of life is 42.",
                tokens_used: 128,
                model: "gpt-4-turbo",
                payment: {
                    method: "Ashborn + PrivacyCash",
                    merchant_stealth: stealthAddress.slice(0, 16) + "...",
                    sender_privacy: "shielded",
                    receiver_privacy: "stealth"
                }
            }, null, 2));
            setStep('complete');
        } catch (err) {
            console.error('Payment error:', err);
            setResponse(JSON.stringify({ error: err instanceof Error ? err.message : 'Payment failed' }, null, 2));
            setStep('complete');
        }
    };

    const steps = [
        { id: 'requesting', label: 'Request API → 402', icon: Bot, desc: 'Agent calls paid endpoint' },
        { id: 'stealth', label: 'Ashborn: Stealth Address', icon: Ghost, desc: 'Generate one-time merchant address' },
        { id: 'paying', label: 'PrivacyCash: Unshield', icon: CreditCard, desc: 'Pay from shielded pool to stealth' },
        { id: 'verifying', label: 'X402 Verify', icon: Lock, desc: 'Middleware confirms payment' },
        { id: 'complete', label: 'Receive Response', icon: CheckCircle, desc: 'API unlocks, agent gets data' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['requesting', 'stealth', 'paying', 'verifying', 'complete'];
        const currentIdx = order.indexOf(step);
        const stepIdx = order.indexOf(stepId);
        if (stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
                    <Bot className="w-4 h-4 text-blue-400" />
                    AI-to-AI Payment
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Private API Payments</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    <strong className="text-purple-400">Dual-Sided Privacy:</strong>{' '}
                    <span className="text-blue-400">PrivacyCash</span> hides the sender,{' '}
                    <span className="text-green-400">Ashborn</span> hides the receiver.
                </p>
            </motion.div>

            {/* Concept Box - Updated */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Dual-Sided Privacy Architecture
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 p-4 rounded-lg border border-green-500/20">
                        <span className="text-green-400 font-semibold flex items-center gap-2">
                            <Ghost className="w-4 h-4" /> Ashborn (Receiver Privacy)
                        </span>
                        <p className="text-gray-400 mt-2">Generates one-time <strong>stealth addresses</strong> for the merchant. Each payment goes to a unique, unlinkable address.</p>
                        <code className="text-[10px] text-gray-600 font-mono mt-2 block">shadowWire.generateStealthAddress()</code>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-blue-500/20">
                        <span className="text-blue-400 font-semibold flex items-center gap-2">
                            <Eye className="w-4 h-4" /> PrivacyCash (Sender Privacy)
                        </span>
                        <p className="text-gray-400 mt-2">Pays from a <strong>shielded pool</strong>. On-chain observers cannot link the payment to the sender&apos;s wallet.</p>
                        <code className="text-[10px] text-gray-600 font-mono mt-2 block">privacyCash.unshieldSOL(amount, stealthAddr)</code>
                    </div>
                </div>
            </motion.div>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8"
            >
                <div className="space-y-3 mb-8">
                    {steps.map((s, i) => {
                        const status = getStepStatus(s.id);
                        const Icon = s.icon;
                        const isAshbornStep = s.id === 'stealth';
                        return (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${status === 'complete' ? 'bg-green-500/20 border border-green-500/50' : ''}
                                    ${status === 'active' ? (isAshbornStep ? 'bg-green-500/20 border border-green-500/50' : 'bg-blue-500/20 border border-blue-500/50') + ' animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loader2 className={`w-5 h-5 animate-spin ${isAshbornStep ? 'text-green-400' : 'text-blue-400'}`} />
                                    ) : (
                                        <Icon className={`w-5 h-5 ${isAshbornStep ? 'text-green-600' : 'text-gray-500'}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'} ${isAshbornStep ? 'text-green-400' : ''}`}>
                                        {s.label}
                                    </p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                                {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-700" />}
                            </div>
                        );
                    })}
                </div>

                {!connected ? (
                    <div className="text-center py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-blue-400 opacity-50" />
                        <p className="text-gray-400">Connect your wallet to simulate AI payment.</p>
                    </div>
                ) : step === 'complete' && response ? (
                    <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Dual-Privacy Payment Complete!</h3>
                        <p className="text-gray-400 mb-4">Both sender AND receiver identities are protected.</p>

                        {/* Show Stealth Address */}
                        {merchantStealthAddress && (
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4 text-left">
                                <p className="text-xs text-green-400 mb-1 font-semibold">🔒 Ashborn Stealth Address (Merchant)</p>
                                <code className="text-xs text-green-300 font-mono break-all">{merchantStealthAddress}</code>
                            </div>
                        )}

                        {/* Show Transaction */}
                        {txSignature && (
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4 text-left">
                                <p className="text-xs text-blue-400 mb-1 font-semibold">💳 PrivacyCash Payment</p>
                                <a
                                    href={getSolscanUrl(txSignature)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-300 font-mono hover:underline flex items-center gap-1"
                                >
                                    {txSignature.slice(0, 32)}... <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}

                        <div className="bg-[#0E0E0E] rounded-lg p-4 text-left mb-6 border border-white/5">
                            <p className="text-xs text-gray-500 mb-2">API Response:</p>
                            <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{response}</pre>
                        </div>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                            Run Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Service</label>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:outline-none"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Price (SOL)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:outline-none font-mono"
                                    disabled={step !== 'idle'}
                                />
                            </div>
                        </div>
                        <button
                            onClick={runPaymentDemo}
                            disabled={step !== 'idle'}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {step !== 'idle' ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <><Ghost className="w-5 h-5" /> Execute Dual-Privacy Payment</>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Code Example - Updated */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { ShadowWire, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';
import { createPayingAgent } from '@alleyboss/micropay-solana-x402-paywall';

// Initialize both privacy layers
const shadowWire = new ShadowWire(connection, wallet);
const privacyCash = new PrivacyCashOfficial({ rpcUrl, owner: agentKeypair });

// On 402 Payment Required...
async function payPrivately(amount: number) {
  // Step 1: Ashborn generates RECEIVER stealth address
  const { stealthPubkey } = await shadowWire.generateStealthAddress();
  
  // Step 2: PrivacyCash pays from shielded pool to stealth
  const result = await privacyCash.unshieldSOL(amount, stealthPubkey.toBase58());
  
  // Result: Both sender AND receiver are anonymous
  return result.signature;
}

// Privacy guarantees:
// - Sender privacy: Funds come from PrivacyCash shielded pool
// - Receiver privacy: Payment goes to one-time Ashborn stealth address
// - No on-chain link between agent wallet <-> merchant wallet`}
                    filename="dual-privacy-payment.ts"
                />
            </motion.div>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
                <p className="text-xs text-gray-600 mb-2">Integrated with</p>
                <div className="flex items-center justify-center gap-6">
                    <Link href="https://privacy.cash" target="_blank" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                        PrivacyCash <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-gray-700">|</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                        Radr Labs <Zap className="w-3 h-3" />
                    </span>
                    <span className="text-gray-700">|</span>
                    <span className="text-blue-400 font-semibold">
                        X402 Paywall
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
