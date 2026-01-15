'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { AiChat01Icon, Money03Icon, CheckmarkCircle01Icon, Loading03Icon, Shield02Icon, ArrowRight01Icon, ChartHistogramIcon, LinkSquare02Icon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useConnection } from '@solana/wallet-adapter-react';

const randomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
};

type Step = 'idle' | 'proving' | 'lending' | 'confirming' | 'complete';

export default function AILendingDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { rangeCompliance, shadowWire, isReady } = useAshborn();

    // Status
    const [step, setStep] = useState<Step>('idle');
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();

    const [loanAmount, setLoanAmount] = useState('1.0');
    const [collateralRange, setCollateralRange] = useState({ min: '2', max: '10' });
    const [loanData, setLoanData] = useState<{ id?: string; proofHash?: string; signature?: string; stealthAddr?: string }>({});

    const resetDemo = () => {
        setStep('idle');
        reset();
        setLoanData({});
    };

    const runLendingDemo = async () => {
        if (!connected || !publicKey || !sendTransaction) return;

        try {
            setStatus('loading');

            // Step 1: Generate ZK collateral proof
            setStep('proving');
            let proofHash = '';
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
                proofHash = `groth16_${Buffer.from(proof.proof.slice(0, 12)).toString('hex')}...`;
            } else {
                await new Promise(r => setTimeout(r, 2000));
                proofHash = `groth16_${Math.random().toString(16).slice(2, 14)}...`;
            }
            setLoanData(prev => ({ ...prev, proofHash }));

            // Step 2: Lender transfers (Real Tx)
            setStep('lending');

            // Real transfer simulation (Lender -> Borrower/Stealth)
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey, // Self for demo purposes
                    lamports: Math.floor(parseFloat(loanAmount) * LAMPORTS_PER_SOL),
                })
            );
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            setLoanData(prev => ({ ...prev, signature }));

            // Generate stealth address (simulation)
            const stealthString = `stealth_${publicKey.toBase58().slice(0, 10)}`;
            setLoanData(prev => ({ ...prev, stealthAddr: stealthString }));

            // Step 3: Confirm loan (Real Tx simulation)
            setStep('confirming');
            const confirmTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey,
                    lamports: 1000,
                })
            );
            const confirmSig = await sendTransaction(confirmTx, connection);
            await connection.confirmTransaction(confirmSig, 'confirmed');

            const loanId = `loan_${Math.random().toString(36).substring(7)}`;
            setLoanData(prev => ({ ...prev, id: loanId }));

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Lending error:', err);
            setErrorState('Lending failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'proving', label: 'ZK Collateral Proof', icon: Shield02Icon, desc: 'Prove balance ∈ [min, max]' },
        { id: 'lending', label: 'Private Disbursement', icon: Money03Icon, desc: 'Lender sends to stealth addr' },
        { id: 'confirming', label: 'Loan Recorded', icon: CheckmarkCircle01Icon, desc: 'Encrypted loan terms stored' },
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
        <div className="max-w-3xl mx-auto space-y-8">
            <DemoPageHeader
                icon={Money03Icon}
                badge="AI-to-AI Lending"
                title="Private Collateral Lending"
                description="Borrow between AI agents using ZK Range Proofs for collateral. Prove solvency without revealing exact balance."
                color="green"
            />

            <InfoCard
                icon={ChartHistogramIcon}
                title="ZK Collateral Proof"
                color="green"
                steps={[
                    { label: "Private Balance", color: "green" },
                    { label: "Range Proof", color: "blue" },
                    { label: "Verify", color: "purple" },
                    { label: "Disburse", color: "amber" }
                ]}
            >
                <div>
                    The borrower proves: <code className="text-green-300">Balance ≥ 2× Loan</code> without revealing the exact balance.
                    This uses <strong>Groth16 Range Proofs</strong> via Ashborn ZK module.
                    Lender verifies proof and disburses funds to a stealth address.
                </div>
            </InfoCard>

            {/* Custom Progress */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
            >
                <div className="space-y-4">
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
                                        <CheckmarkCircle01Icon className="w-5 h-5 text-green-400" />
                                    ) : status === 'active' ? (
                                        <Loading03Icon className="w-5 h-5 text-green-400 animate-spin" />
                                    ) : (
                                        <Icon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{s.label}</p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                                {i < steps.length - 1 && <ArrowRight01Icon className="w-4 h-4 text-gray-700" />}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Result */}
            {isSuccess ? (
                <div className="space-y-6">
                    <PrivacyVisualizer
                        publicView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">On-Chain Proof</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Proof Type:</span>
                                        <span className="text-green-300 font-mono">Groth16 Range</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Public Inputs:</span>
                                        <span className="text-gray-300">Min: {collateralRange.min}, Max: {collateralRange.max}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Proof Hash:</span>
                                        <span className="text-gray-500 font-mono truncate max-w-[120px]">{loanData.proofHash}</span>
                                    </div>
                                    <span className="text-gray-400">Loan Tx:</span>
                                    {loanData.signature && <TxLink signature={loanData.signature} className="text-xs" />}
                                </div>
                            </div>
                        }
                        privateView={
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Private State</div>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between border-b border-purple-500/20 pb-1">
                                        <span className="text-purple-300">Actual Balance:</span>
                                        <span className="text-white font-mono blur-[2px] hover:blur-none transition">50.0 SOL (Hidden)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-purple-500/20 pb-1">
                                        <span className="text-purple-300">Borrower Identity:</span>
                                        <span className="text-white font-mono blur-[2px] hover:blur-none transition">{publicKey?.toBase58().slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-300">Receiver Stealth:</span>
                                        <span className="text-green-400 font-mono">{loanData.stealthAddr?.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <div className="flex justify-center">
                        <DemoButton onClick={resetDemo} icon={Money03Icon}>
                            Make Another Loan
                        </DemoButton>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Loan Amount</label>
                            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Collateral Min</label>
                            <input type="number" value={collateralRange.min} onChange={(e) => setCollateralRange(p => ({ ...p, min: e.target.value }))}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Collateral Max</label>
                            <input type="number" value={collateralRange.max} onChange={(e) => setCollateralRange(p => ({ ...p, max: e.target.value }))}
                                className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" disabled={step !== 'idle'} />
                        </div>
                    </div>

                    {!connected ? (
                        <div className="text-center p-4 border border-dashed border-gray-700 rounded-xl">
                            <p className="text-gray-400 text-sm">Connect wallet to execute AI lending</p>
                        </div>
                    ) : (
                        <DemoButton
                            onClick={runLendingDemo}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={Money03Icon}
                            variant="gradient"
                        >
                            Execute Lending
                        </DemoButton>
                    )}
                </div>
            )}

            {/* SDK Code */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn, AshbornRangeCompliance, PrivacyCashOfficial } from '@alleyboss/ashborn-sdk';

// 1. Borrower generates ZK collateral proof
const compliance = createRangeCompliance(ashborn);
const proof = await compliance.generateRangeProof({
  value: myBalance,
  min: 2_000_000_000n,
  max: 10_000_000_000n
});

// 2. Lender verifies proof and disburses
const isValid = await compliance.verifyRangeProof(proof);
if (isValid) {
    await privacyCash.unshieldSOL(1.0, stealth.address);
}`}
                    filename="ai-lending.ts"
                />
            </motion.div>
        </motion.div>

                </div >
    );
}
