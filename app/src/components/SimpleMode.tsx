'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader, CheckCircle } from 'lucide-react';

/**
 * SimpleMode - "Send money to mom" interface
 * 
 * Elon-approved: Hide ALL crypto complexity
 */
export function SimpleMode() {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [step, setStep] = useState<'input' | 'sending' | 'done'>('input');

    const handleSend = async () => {
        if (!amount || !recipient) return;

        setStep('sending');

        // Simulate transaction
        await new Promise(r => setTimeout(r, 2500));

        setStep('done');
    };

    const reset = () => {
        setAmount('');
        setRecipient('');
        setStep('input');
    };

    if (step === 'sending') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-sm mx-auto p-8 text-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-6"
                >
                    <Loader className="w-full h-full text-purple-500" />
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">Sending privately...</h2>
                <p className="text-gray-400 text-sm">
                    Your payment is being securely processed
                </p>
            </motion.div>
        );
    }

    if (step === 'done') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-sm mx-auto p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Sent!</h2>
                <p className="text-gray-400 mb-6">
                    ${amount} sent privately to {recipient}
                </p>

                <p className="text-green-400 text-sm flex items-center justify-center gap-2 mb-6">
                    <Lock className="w-4 h-4" />
                    No one can see this payment
                </p>

                <button
                    onClick={reset}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                    Send another
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto p-6"
        >
            {/* Header - Simple and friendly */}
            <h1 className="text-2xl font-bold text-center mb-8">
                Send Money Privately
            </h1>

            {/* Amount - USD first, not SOL */}
            <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <div className="flex items-center bg-gray-800/50 rounded-2xl px-4 py-3">
                    <span className="text-3xl text-gray-400 mr-2">$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent text-4xl font-semibold text-white outline-none"
                        inputMode="decimal"
                    />
                </div>
                {amount && parseFloat(amount) > 0 && (
                    <p className="text-gray-500 text-xs mt-2 text-right">
                        ≈ {(parseFloat(amount) / 200).toFixed(4)} SOL
                    </p>
                )}
            </div>

            {/* Recipient - Name or handle, not address */}
            <div className="mb-8">
                <label className="block text-gray-400 text-sm mb-2">To</label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Name, @handle, or email"
                    className="w-full bg-gray-800/50 rounded-2xl px-4 py-3 text-lg text-white outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500/50"
                />
                <p className="text-gray-500 text-xs mt-2">
                    We&apos;ll find their secure address automatically
                </p>
            </div>

            {/* Send button - Big and friendly */}
            <button
                onClick={handleSend}
                disabled={!amount || !recipient}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
                Send Privately
                <ArrowRight className="w-5 h-5" />
            </button>

            {/* Privacy indicator */}
            <div className="mt-6 flex items-center justify-center text-green-400 text-sm gap-2">
                <Lock className="w-4 h-4" />
                <span>End-to-end private · No one can see</span>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex justify-center gap-4 text-gray-500 text-xs">
                    <span>🔒 Zero-knowledge</span>
                    <span>⚡ Instant</span>
                    <span>💸 Low fees</span>
                </div>
            </div>
        </motion.div>
    );
}
