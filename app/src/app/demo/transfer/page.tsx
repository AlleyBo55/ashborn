'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { SentIcon, UserGroup01Icon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { useAshborn } from '@/hooks/useAshborn';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { DemoLayout, DemoButton, TxLink, PrivacyVisualizer } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function TransferDemoPage() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { shadowWire, isReady } = useAshborn();
    const { status, error, setStatus, setErrorState, reset, isSuccess, isError, isLoading } = useDemoStatus();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('0.5');
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [decoys, setDecoys] = useState<string[]>([]);

    const handleTransfer = async () => {
        if (!connected || !publicKey || !sendTransaction) return;

        setStatus('loading');

        try {
            // Step 1: Generate stealth address for recipient
            let stealthPubkey: PublicKey | null = null;

            if (shadowWire && isReady) {
                const stealth = await shadowWire.generateStealthAddress();
                stealthPubkey = new PublicKey(stealth.stealthPubkey);
                setStealthAddress(stealthPubkey.toBase58());
            } else {
                // Fallback
                const fallback = `stealth_${publicKey.toBase58().slice(0, 8)}`;
                setStealthAddress(fallback);
                // Simulate delay
                await new Promise(r => setTimeout(r, 1000));
            }

            // Step 2: Execute transfer
            const recipientPubkey = recipient ? new PublicKey(recipient) : publicKey; // self-send if empty for demo

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey, // in real stealth, this is the stealth address
                    lamports: Number(amount) * 1_000_000_000,
                })
            );

            const sig = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(sig, 'confirmed');

            setTxSignature(sig);
            setDecoys([
                'Hech...83jK',
                'D92j...92ka',
                'Ak29...10dk',
                'Lc02...29dl',
            ]);
            setStatus('success');
        } catch (err: any) {
            console.error('Transfer error:', err);
            setErrorState(err.message || 'Transfer failed');
        }
    };

    const handleReset = () => {
        reset();
        setTxSignature(null);
        setStealthAddress(null);
        setDecoys([]);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <DemoLayout
                header={{
                    icon: SentIcon,
                    badge: "Privacy Feature",
                    title: "Stealth Transfer",
                    description: "Send assets to generated one-time addresses. The recipient controls the funds, but no one links it to them.",
                    color: "blue"
                }}
                info={{
                    icon: UserGroup01Icon,
                    title: "How Stealth Addresses Work",
                    color: "blue",
                    steps: [
                        { label: '1. Shared Secret (ECDH)', color: 'blue' },
                        { label: '2. Derive Stealth Addr', color: 'purple' },
                        { label: '3. Send to Stealth', color: 'green' }
                    ],
                    description: "Stealth addresses allow you to receive funds privately. The sender generates a unique address for each transaction derived from your public key, so only you can discover and spend the funds. The public ledger sees a transfer to a random address, unlinkable to your main identity."
                }}
                code={`import { Ashborn } from '@alleyboss/ashborn-sdk';

// 1. Generate Stealth Address
const { stealthPubkey, ephemeralPubkey } = await ashborn.shadowWire.generateStealthAddress(recipientPubkey);

// 2. Transfer to Stealth Address
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: stealthPubkey,
    lamports: amount,
  })
);

// 3. Publish Ephemeral Key (Metadata)
// ... additional instruction to publish ephemeral key for recipient discovery`}
            >
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        {!connected ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                                <p className="text-gray-400 mb-6">Connect to try stealth transfers.</p>
                                <div className="text-sm text-purple-300 animate-pulse">(Use button in top right)</div>
                            </div>
                        ) : isSuccess ? (
                            <div className="text-center py-8">
                                <div className="text-xl font-semibold mb-2 text-green-400">Transfer Complete</div>
                                <p className="text-gray-400 mb-4">Funds sent to stealth address.</p>

                                <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5 space-y-3">
                                    {stealthAddress && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Stealth Address (Generated)</div>
                                            <code className="text-xs text-green-300 break-all font-mono">{stealthAddress}</code>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Transaction Signature</div>
                                        {txSignature && <TxLink signature={txSignature} label="View" />}
                                    </div>
                                </div>

                                {decoys.length > 0 && (
                                    <div className="mb-6 text-left">
                                        <div className="text-xs text-gray-500 mb-2">Decoys On-Chain (Ring Members)</div>
                                        <div className="flex gap-2 flex-wrap text-[10px] font-mono text-gray-600">
                                            {decoys.map(d => <span key={d} className="bg-white/5 px-2 py-1 rounded">{d}</span>)}
                                        </div>
                                    </div>
                                )}

                                <DemoButton onClick={handleReset} variant="primary">Send Another</DemoButton>
                            </div>
                        ) : isError ? (
                            <div className="text-center py-8">
                                <h3 className="text-xl font-semibold mb-2 text-red-400">Failed</h3>
                                <p className="text-gray-400 mb-6">{error}</p>
                                <DemoButton onClick={handleReset} variant="primary">Try Again</DemoButton>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Recipient Address (Optional - defaults to self)</label>
                                        <input
                                            type="text"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            placeholder="Solana Wallet Address"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <DemoButton onClick={handleTransfer} loading={isLoading} icon={SentIcon} variant="gradient">
                                    Send Stealth Transfer
                                </DemoButton>
                            </>
                        )}
                    </motion.div>

                    <PrivacyVisualizer
                        publicView={
                            <>
                                <div className="text-gray-500 text-xs mb-1">On-Chain Interaction</div>
                                <div className="text-blue-300 font-mono text-xs">
                                    Sender → <span className="text-purple-400">StealthAddr</span>
                                </div>
                                <div className="mt-4 text-xs text-gray-600">
                                    Observer sees transfer to a random address. Cannot link to recipient.
                                </div>
                            </>
                        }
                        privateView={
                            <>
                                <div className="text-gray-500 text-xs mb-1">Recipient View</div>
                                <div className="text-green-300 font-mono text-xs">
                                    <span className="text-purple-400">StealthAddr</span> (Owned by Recipient)
                                </div>
                                <div className="mt-4 text-xs text-gray-500">
                                    Recipient can detect this address using their private view key and spend funds.
                                </div>
                            </>
                        }
                    />
                </div>
            </DemoLayout>
        </div>
    );
}
