'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, CheckCircle, AlertCircle, Loader, UserCircle } from 'lucide-react';

type TransferStep = 'input' | 'confirm' | 'processing' | 'success';

export function TransferFlow() {
    const { publicKey } = useWallet();
    const [step, setStep] = useState<TransferStep>('input');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');

    const handleTransfer = async () => {
        if (!amount || !recipient) {
            setError('Please fill in all fields');
            return;
        }
        setStep('confirm');
    };

    const confirmTransfer = async () => {
        setStep('processing');

        try {
            // Demo: simulate shadow transfer
            await new Promise((resolve) => setTimeout(resolve, 3500));
            setStep('success');
        } catch (err) {
            console.error(err);
        }
    };

    const reset = () => {
        setStep('input');
        setAmount('');
        setRecipient('');
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <Send className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Shadow Transfer</h2>
                                <p className="text-shadow-400 text-sm">Unlinkable P2P payment</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-shadow-300 text-sm mb-2">Recipient Stealth Address</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-shadow-500" />
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => {
                                            setRecipient(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Stealth address or .sol domain"
                                        className="shadow-input pl-12"
                                    />
                                </div>
                                <p className="text-shadow-500 text-xs mt-1">
                                    Get stealth address from recipient&apos;s ShadowWire
                                </p>
                            </div>

                            <div>
                                <label className="block text-shadow-300 text-sm mb-2">Amount</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="0.0"
                                        className="shadow-input text-xl pr-16"
                                        step="0.001"
                                        min="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-shadow-400 font-medium">
                                        SOL
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </p>
                            )}

                            <div className="bg-void-light rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-shadow-400">Privacy Level</span>
                                    <span className="text-green-400">Maximum</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-shadow-400">ShadowWire Integration</span>
                                    <span className="text-green-400">Active</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-shadow-400">Sender-Recipient Link</span>
                                    <span className="text-shadow-300">Unlinkable</span>
                                </div>
                            </div>

                            <button
                                onClick={handleTransfer}
                                disabled={!amount || !recipient}
                                className="shadow-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Confirm Transfer</h2>
                            <p className="text-shadow-400 text-sm">This action cannot be undone</p>
                        </div>

                        <div className="bg-void-light rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-shadow-400">Amount</span>
                                <span className="text-white font-semibold">{amount} SOL</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-shadow-400">To</span>
                                <span className="text-shadow-300 text-xs font-mono text-right max-w-[200px] truncate">
                                    {recipient}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-shadow-400">Nullifier</span>
                                <span className="text-shadow-300 text-xs font-mono">
                                    {generateMockHash().slice(0, 16)}...
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 bg-void-light hover:bg-shadow-900/50 text-shadow-300 py-3 rounded-xl font-medium transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmTransfer}
                                className="flex-1 shadow-btn bg-gradient-to-r from-blue-600 to-purple-600"
                            >
                                Send
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
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6"
                            animate={{
                                boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 60px rgba(147, 51, 234, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)'],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Loader className="w-10 h-10 text-white animate-spin" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-white mb-2">Executing Shadow Transfer</h2>
                        <p className="text-shadow-400">
                            Generating ZK proof and nullifier...
                        </p>
                        <p className="text-shadow-500 text-sm mt-4">
                            &quot;The shadows carry your message in silence...&quot;
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
                        <h2 className="text-2xl font-bold text-white mb-2">Transfer Complete!</h2>
                        <p className="text-shadow-400 mb-6">
                            {amount} SOL sent via shadow transfer
                        </p>

                        <div className="bg-void-light rounded-xl p-4 mb-6 text-left space-y-2">
                            <div>
                                <div className="text-shadow-400 text-sm mb-1">Nullifier Used</div>
                                <code className="text-shadow-300 text-xs break-all">
                                    {generateMockHash()}
                                </code>
                            </div>
                            <div>
                                <div className="text-shadow-400 text-sm mb-1">New Commitment</div>
                                <code className="text-shadow-300 text-xs break-all">
                                    {generateMockHash()}
                                </code>
                            </div>
                        </div>

                        <button onClick={reset} className="shadow-btn bg-gradient-to-r from-blue-600 to-purple-600">
                            Send Another
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function generateMockHash(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
