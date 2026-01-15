'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn, SOL_MINT } from '@/hooks/useAshborn';
import { PublicKey } from '@solana/web3.js';
import { DemoPageHeader, InfoCard, DemoButton, TxLink, PrivacyVisualizer } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DENOMINATIONS = [
    { label: '0.1 SOL', value: BigInt(100_000_000), display: '0.1' },
    { label: '1 SOL', value: BigInt(1_000_000_000), display: '1' },
    { label: '10 SOL', value: BigInt(10_000_000_000), display: '10' },
];

export default function ShieldDemoPage() {
    const { connected, publicKey } = useWallet();
    const { ashborn, isReady } = useAshborn();
    const [selectedAmount, setSelectedAmount] = useState(DENOMINATIONS[0]);
    const { status, error, setStatus, setError, reset, isSuccess, isError, isLoading } = useDemoStatus();

    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [noteAddress, setNoteAddress] = useState<string | null>(null);

    const handleShield = async () => {
        if (!connected || !publicKey || !ashborn || !isReady) return;

        setStatus('loading');

        try {
            // Execute real shield operation on devnet
            const result = await ashborn.shield({
                amount: selectedAmount.value,
                mint: new PublicKey(SOL_MINT),
            });

            setTxSignature(result.signature);
            setNoteAddress(result.noteAddress.toBase58());
            setStatus('success');
        } catch (err: any) {
            console.error('Shield error:', err);
            setError(err.message || 'Shield transaction failed');
        }
    };

    const handleReset = () => {
        reset();
        setTxSignature(null);
        setNoteAddress(null);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <DemoPageHeader
                icon={Shield}
                badge="Interactive Demo"
                title="Shadow Extraction"
                description="Extract SOL into the Shadow Domain. Your assets become invisible to the public ledger."
                color="purple"
            />

            <InfoCard
                icon={Shield}
                title="What is Shadow Extraction?"
                color="blue"
                steps={[
                    { label: '1. Deposit SOL', color: 'blue' },
                    { label: '2. Generate Commitment', color: 'purple' },
                    { label: '3. Receive Note', color: 'green' }
                ]}
            >
                Shielding converts your <strong className="text-white">public SOL</strong> into a <strong className="text-purple-300">private ZK commitment</strong> (Shadow Note).
                After extraction, your balance is hidden from blockchain explorers. Only you can spend it using your private key.
                <p className="text-[10px] text-gray-600 mt-3 font-mono">
                    C = Poseidon(amount, blinding, nullifier) → Stored on-chain as encrypted commitment
                </p>
            </InfoCard>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
            >
                {!connected ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-gray-400 mb-6">Connect a Solana wallet to initiate extraction.</p>
                        <div className="text-sm text-purple-300 animate-pulse">(Use button in top right)</div>
                    </div>
                ) : isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Extraction Complete</h3>
                        <p className="text-gray-400 mb-4">{selectedAmount.display} SOL is now in the Shadow Domain.</p>

                        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5 space-y-3">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Transaction Signature</div>
                                <div className="flex items-center gap-2">
                                    <code className="text-xs text-purple-300 break-all font-mono flex-1">{txSignature}</code>
                                    {txSignature && <TxLink signature={txSignature} label="View" />}
                                </div>
                            </div>
                            {noteAddress && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Note Address (PDA)</div>
                                    <code className="text-xs text-green-300 break-all font-mono">{noteAddress}</code>
                                </div>
                            )}
                        </div>

                        <DemoButton onClick={handleReset} variant="secondary">Try Again</DemoButton>
                    </div>
                ) : isError ? (
                    <div className="text-center py-8">
                        <h3 className="text-xl font-semibold mb-2 text-red-400">Transaction Failed</h3>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <DemoButton onClick={handleReset} variant="secondary">Try Again</DemoButton>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                            <div>
                                <div className="text-xs text-gray-500 mb-1 font-mono">CONNECTED_WALLET</div>
                                <code className="text-sm text-purple-300 font-mono">
                                    {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                                </code>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1 font-mono">NETWORK</div>
                                <span className="text-sm text-yellow-400 flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Devnet
                                </span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm text-gray-400 mb-3 font-medium">Select Amount (Fixed Denominations)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {DENOMINATIONS.map((denom) => (
                                    <button
                                        key={denom.display}
                                        onClick={() => setSelectedAmount(denom)}
                                        className={`py-4 rounded-xl font-semibold transition border ${selectedAmount.value === denom.value
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {denom.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">* Fixed amounts prevent fingerprinting analysis.</p>
                        </div>

                        <DemoButton
                            onClick={handleShield}
                            loading={isLoading}
                            disabled={isLoading}
                            icon={Shield}
                        >
                            Extract {selectedAmount.display} SOL
                        </DemoButton>

                        <div className="mt-6 bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                            <p className="text-xs text-green-200/60 leading-relaxed">
                                <strong>🔴 Live Devnet:</strong> This executes a real blockchain transaction.
                            </p>
                        </div>
                    </>
                )}
            </motion.div>

            <PrivacyVisualizer
                publicView={
                    <>
                        <div>
                            <div className="text-gray-500 text-xs mb-1">Wallet Balance</div>
                            <div className="text-red-400 font-bold flex items-center gap-2">
                                {isSuccess ? (
                                    <>
                                        <span>0.50 SOL</span>
                                        <span className="text-[10px] text-gray-500 font-normal line-through">1.0 SOL</span>
                                    </>
                                ) : (
                                    <span>1.00 SOL</span>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-dashed border-gray-700/50 pt-4">
                            <div className="text-gray-500 text-xs mb-2">Recent Activity</div>
                            {isSuccess ? (
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-blue-400">Tx: {txSignature?.slice(0, 6)}...</span>
                                        <span className="text-gray-500">Just now</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-400">- 0.5 SOL</span>
                                        <span className="text-gray-600">→</span>
                                        <span className="text-gray-400">Ashborn Prog...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 italic">No recent transactions</div>
                            )}
                        </div>
                    </>
                }
                privateView={
                    <>
                        <div>
                            <div className="text-gray-500 text-xs mb-1">Shadow Balance</div>
                            <div className="text-green-400 font-bold flex items-center gap-2">
                                {isSuccess ? (
                                    <>
                                        <span>0.50 SOL</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400">spendable</span>
                                    </>
                                ) : (
                                    <span className="text-gray-600">0.00 SOL</span>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-dashed border-gray-800 pt-4">
                            <div className="text-gray-500 text-xs mb-2">Encrypted Notes</div>
                            {isSuccess ? (
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <span className="text-purple-300">Note #1</span>
                                        <span className="text-green-400">+ 0.5 SOL</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 break-all">
                                        Owner: {publicKey?.toBase58().slice(0, 15)}... (Hidden)
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-600 italic">Vault empty</div>
                            )}
                        </div>
                    </>
                }
            />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={`import { Ashborn } from '@alleyboss/ashborn-sdk';

const ashborn = new Ashborn(connection, wallet);

// Shield SOL into privacy pool
const result = await ashborn.shield({
  amount: ${selectedAmount.value.toString()}n, // ${selectedAmount.display} SOL
  mint: SOL_MINT,
});

console.log('Commitment:', result.commitment);
console.log('Signature:', result.signature);`}
                    filename="shield.ts"
                />
            </motion.div>
        </div>
    );
}
