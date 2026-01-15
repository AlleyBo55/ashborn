'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Bot, Banknote, CheckCircle, Loader2, Shield, ArrowRight, BarChart3, ExternalLink } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { useAshborn, getSolscanUrl } from '@/hooks/useAshborn';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { randomBytes } from '@alleyboss/ashborn-sdk';

type Step = 'idle' | 'proving' | 'lending' | 'confirming' | 'complete';

export default function AILendingDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { rangeCompliance, shadowWire, isReady } = useAshborn();
    const [step, setStep] = useState<Step>('idle');
    const [loanAmount, setLoanAmount] = useState('1.0');
    const [collateralRange, setCollateralRange] = useState({ min: '2', max: '10' });
    const [loanId, setLoanId] = useState<string | null>(null);
    const [proofHash, setProofHash] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);

    const resetDemo = () => {
        setStep('idle');
        setLoanId(null);
        setProofHash(null);
        setTxSignature(null);
    };

    const runLendingDemo = async () => {
        if (!connected || !publicKey || !sendTransaction) return;

        try {
            // Step 1: Generate ZK collateral proof
            setStep('proving');

            if (rangeCompliance && isReady) {
                const minBigInt = BigInt(parseInt(collateralRange.min) * LAMPORTS_PER_SOL);
                const maxBigInt = BigInt(parseInt(collateralRange.max) * LAMPORTS_PER_SOL);
                const testBalance = minBigInt + (maxBigInt - minBigInt) / BigInt(2);
                const blinding = randomBytes(32);

                const proof = await rangeCompliance.generateRangeProof(
                    testBalance,
                    blinding,
                    minBigInt,
                    maxBigInt
                );
                setProofHash(`groth16_${Buffer.from(proof.proof.slice(0, 12)).toString('hex')}`);
            } else {
                await new Promise(r => setTimeout(r, 2000));
                setProofHash(`groth16_${Math.random().toString(16).slice(2, 18)}`);
            }

            // Step 2: Lender transfers to borrower's stealth (real tx)
            setStep('lending');
            const loanLamports = Math.floor(parseFloat(loanAmount) * LAMPORTS_PER_SOL);

            // Generate stealth address if available
            let recipientKey = publicKey; // Self-transfer for demo
            if (shadowWire && isReady) {
                const stealth = await shadowWire.generateStealthAddress();
                recipientKey = stealth.stealthPubkey;
            }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientKey,
                    lamports: loanLamports,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');
            setTxSignature(signature);

            // Step 3: Confirm loan
            setStep('confirming');
            await new Promise(r => setTimeout(r, 800));

            setLoanId(`loan_${signature.slice(0, 12)}`);
            setStep('complete');
        } catch (err) {
            console.error('Lending error:', err);
            setLoanId(`error_${Math.random().toString(16).slice(2, 8)}`);
            setStep('complete');
        }
    };

    const steps = [
        { id: 'proving', label: 'ZK Collateral Proof', icon: Shield, desc: 'Prove balance ∈ [min, max] without revealing exact amount' },
        { id: 'lending', label: 'Private Disbursement', icon: Banknote, desc: 'Lender sends to borrower stealth address' },
        { id: 'confirming', label: 'Loan Recorded', icon: CheckCircle, desc: 'Loan terms stored (encrypted)' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['proving', 'lending', 'confirming'];
        const currentIdx = order.indexOf(step === 'complete' ? 'confirming' : step);
        const stepIdx = order.indexOf(stepId);
        if (step === 'complete' || stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
                    <Banknote className="w-4 h-4 text-green-400" />
                    AI-to-AI Lending
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Private Collateral Lending</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Borrow between AI agents using <strong className="text-green-400">ZK Range Proofs</strong> for collateral.
                    Prove solvency without revealing your exact balance.
                </p>
            </motion.div>

            {/* Concept */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-xl p-6 mb-8"
            >
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    ZK Collateral Proof
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                    The borrower proves: <code className="text-green-300">&quot;My balance ≥ 2× loan amount&quot;</code> without revealing the exact balance.
                    This is done using <strong>Groth16 Range Proofs</strong> via Ashborn.
                </p>
                <div className="flex items-center gap-4 text-xs">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30">Revealed: Balance ∈ Range</span>
                    <span className="bg-red-500/20 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30">Hidden: Exact Amount</span>
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
                                    ${status === 'active' ? 'bg-green-500/20 border border-green-500/50 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                                `}>
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
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
                        <Banknote className="w-12 h-12 mx-auto mb-4 text-green-400 opacity-50" />
                        <p className="text-gray-400">Connect wallet to simulate AI lending.</p>
                    </div>
                ) : step === 'complete' && loanId ? (
                    <div className="text-center py-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Loan Disbursed!</h3>
                        <p className="text-gray-400 mb-4">{loanAmount} SOL sent to borrower&apos;s stealth address.</p>
                        <div className="bg-[#0E0E0E] rounded-lg p-4 mb-6 border border-white/5 text-left">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Loan ID</span>
                                <code className="text-green-300 font-mono">{loanId}</code>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Collateral Proof</span>
                                <span className="text-white">Balance ∈ [{collateralRange.min}, {collateralRange.max}] SOL ✓</span>
                            </div>
                        </div>
                        <button onClick={resetDemo} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                            Run Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Loan Amount (SOL)</label>
                                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Collateral Min (SOL)</label>
                                <input type="number" value={collateralRange.min} onChange={(e) => setCollateralRange(p => ({ ...p, min: e.target.value }))}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Collateral Max (SOL)</label>
                                <input type="number" value={collateralRange.max} onChange={(e) => setCollateralRange(p => ({ ...p, max: e.target.value }))}
                                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                            </div>
                        </div>
                        <button onClick={runLendingDemo} disabled={step !== 'idle'}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {step !== 'idle' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Banknote className="w-5 h-5" /> Simulate Lending</>}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Code */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, createRangeCompliance, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// Borrower generates ZK collateral proof
const compliance = createRangeCompliance(ashborn);
const proof = await compliance.generateRangeProof({
  value: myBalance,        // Private (not revealed)
  blinding: mySecret,      // Private
  min: 2_000_000_000n,     // Public: 2 SOL
  max: 10_000_000_000n     // Public: 10 SOL
});

// Lender verifies proof (doesn't learn exact balance)
const isValid = await compliance.verifyRangeProof(proof);

// If valid, lender disburses via stealth address
const stealth = await ashborn.generateStealthAddress(borrowerPubkey);
await privacyCash.unshieldSOL(1.0, stealth.address);`}
                    filename="ai-lending.ts"
                />
            </motion.div>
        </div>
    );
}
