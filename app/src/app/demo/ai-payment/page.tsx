'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Bot, CreditCard, CheckCircle, Loader2, Zap, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Link from 'next/link';

type Step = 'idle' | 'requesting' | 'paying' | 'verifying' | 'complete';

export default function AIPaymentDemoPage() {
    const { connected } = useWallet();
    const [step, setStep] = useState<Step>('idle');
    const [serviceName, setServiceName] = useState('GPT-4 Query');
    const [price, setPrice] = useState('0.001');
    const [response, setResponse] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setResponse(null);
    };

    const runPaymentDemo = async () => {
        if (!connected) return;

        // Step 1: Request API (get 402)
        setStep('requesting');
        await new Promise(r => setTimeout(r, 1500));

        // Step 2: Pay via PrivacyCash + X402
        setStep('paying');
        await new Promise(r => setTimeout(r, 2000));

        // Step 3: Verify payment
        setStep('verifying');
        await new Promise(r => setTimeout(r, 1000));

        // Step 4: Get response
        setResponse('{"result": "The meaning of life is 42.", "tokens_used": 128, "model": "gpt-4-turbo"}');
        setStep('complete');
    };

    const steps = [
        { id: 'requesting', label: 'Request API (→ 402)', icon: Bot, desc: 'Agent calls paid endpoint' },
        { id: 'paying', label: 'Private Payment', icon: CreditCard, desc: 'Withdraw from PrivacyCash, pay stealth' },
        { id: 'verifying', label: 'X402 Verify', icon: Lock, desc: 'Middleware verifies payment' },
        { id: 'complete', label: 'Receive Response', icon: CheckCircle, desc: 'API unlocks, agent gets data' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['requesting', 'paying', 'verifying', 'complete'];
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
                    Agent A pays Agent B for API access using <strong className="text-blue-400">X402 paywall</strong> +
                    <strong className="text-purple-400"> PrivacyCash</strong>. No wallet linkage.
                </p>
            </motion.div>

            {/* Concept Box */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    How It Works
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-blue-400 font-semibold">X402 Middleware</span>
                        <p className="text-gray-400 mt-1">Returns HTTP 402 &quot;Payment Required&quot; with price + wallet.</p>
                        <code className="text-[10px] text-gray-600 font-mono">@alleyboss/micropay-solana-x402-paywall</code>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-semibold">PrivacyCash + Ashborn</span>
                        <p className="text-gray-400 mt-1">Agent pays from shielded pool to stealth address.</p>
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
                        return (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${status === 'complete' ? 'bg-green-500/20 border border-green-500/50' : ''}
                                    ${status === 'active' ? 'bg-blue-500/20 border border-blue-500/50 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{s.label}</p>
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
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Payment Verified!</h3>
                        <p className="text-gray-400 mb-4">Agent received API response privately.</p>
                        <div className="bg-[#0E0E0E] rounded-lg p-4 text-left mb-6 border border-white/5">
                            <p className="text-xs text-gray-500 mb-2">Response:</p>
                            <code className="text-sm text-green-300 font-mono break-all">{response}</code>
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
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {step !== 'idle' ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <><Bot className="w-5 h-5" /> Simulate AI Payment</>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Code Example */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { createPayingAgent } from '@alleyboss/micropay-solana-x402-paywall';
import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// Initialize privacy client
const privacyCash = new PrivacyCashOfficial({
  rpcUrl: process.env.RPC_URL,
  owner: agentKeypair,
});

// Create paying agent with X402 support
const agent = createPayingAgent({
  baseUrl: 'https://ai-service.example.com',
  walletAddress: agentKeypair.publicKey.toString(),
  privateKey: agentKeypair.secretKey,
});

// Make paid API call (automatically handles 402)
const response = await agent.post('/api/query', {
  prompt: 'What is the meaning of life?'
});

// Under the hood:
// 1. Request → 402 Payment Required
// 2. privacyCash.unshieldSOL(0.001, stealthAddress)
// 3. Payment verified by X402 middleware
// 4. Response returned to agent`}
                    filename="ai-payment.ts"
                />
            </motion.div>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
                <p className="text-xs text-gray-600 mb-2">Powered by</p>
                <div className="flex items-center justify-center gap-4 text-xs">
                    <Link href="https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall" target="_blank" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        X402 Paywall <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-gray-700">+</span>
                    <span className="text-purple-400">PrivacyCash</span>
                    <span className="text-gray-700">+</span>
                    <span className="text-green-400">Ashborn</span>
                </div>
            </motion.div>
        </div>
    );
}
