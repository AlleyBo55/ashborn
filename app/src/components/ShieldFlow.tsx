'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

type ShieldStep = 'input' | 'confirm' | 'processing' | 'success' | 'error';

export function ShieldFlow() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [step, setStep] = useState<ShieldStep>('input');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleShield = async () => {
        if (!publicKey || !amount) return;

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setStep('confirm');
    };

    const confirmShield = async () => {
        setStep('processing');

        try {
            // Demo: simulate shielding transaction
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setStep('success');
        } catch (err) {
            console.error(err);
            setStep('error');
        }
    };

    const reset = () => {
        setStep('input');
        setAmount('');
        setError('');
    };

    return (
        <div className="glass-card p-8 max-w-lg mx-auto">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Shield Assets</h2>
                                <p className="text-shadow-400 text-sm">Hide your SOL in the shadows</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-shadow-300 text-sm mb-2">Amount to Shield</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="0.0"
                                        className="shadow-input text-2xl pr-16"
                                        step="0.001"
                                        min="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-shadow-400 font-medium">
                                        SOL
                                    </span>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="bg-void-light rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-shadow-400">Shield Fee</span>
                                    <span className="text-shadow-300">~0.000005 SOL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-shadow-400">Privacy Cash Integration</span>
                                    <span className="text-green-400">Active</span>
                                </div>
                            </div>

                            <button
                                onClick={handleShield}
                                disabled={!amount}
                                className="shadow-btn w-full flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'confirm' && (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center mx-auto mb-4 shadow-shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Confirm Shield</h2>
                            <p className="text-shadow-400 text-sm">Review your transaction</p>
                        </div>

                        <div className="bg-void-light rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-shadow-400">Amount</span>
                                <span className="text-white font-semibold">{amount} SOL</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-shadow-400">Commitment</span>
                                <span className="text-shadow-300 text-xs font-mono">
                                    {generateMockCommitment()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-shadow-400">Network</span>
                                <span className="text-shadow-300">Devnet</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 bg-void-light hover:bg-shadow-900/50 text-shadow-300 py-3 rounded-xl font-medium transition-colors"
                            >
                                Back
                            </button>
                            <button onClick={confirmShield} className="flex-1 shadow-btn">
                                Shield Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center mx-auto mb-6"
                            animate={{
                                boxShadow: ['0 0 20px rgba(147, 51, 234, 0.5)', '0 0 60px rgba(147, 51, 234, 0.8)', '0 0 20px rgba(147, 51, 234, 0.5)'],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Loader className="w-10 h-10 text-white animate-spin" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-white mb-2">Shielding Assets</h2>
                        <p className="text-shadow-400">
                            Generating commitment and encrypting data...
                        </p>
                        <p className="text-shadow-500 text-sm mt-4">
                            &quot;The shadows embrace your wealth...&quot;
                        </p>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        >
                            <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Assets Shielded!</h2>
                        <p className="text-shadow-400 mb-6">
                            {amount} SOL is now hidden in your Shadow Vault
                        </p>

                        <div className="bg-void-light rounded-xl p-4 mb-6 text-left">
                            <div className="text-shadow-400 text-sm mb-2">Note Commitment</div>
                            <code className="text-shadow-300 text-xs break-all">
                                {generateMockCommitment()}
                            </code>
                        </div>

                        <button onClick={reset} className="shadow-btn">
                            Shield More
                        </button>
                    </motion.div>
                )}

                {step === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Shield Failed</h2>
                        <p className="text-shadow-400 mb-6">
                            Something went wrong. Please try again.
                        </p>
                        <button onClick={reset} className="shadow-btn">
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function generateMockCommitment(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 32; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result + '...';
}
