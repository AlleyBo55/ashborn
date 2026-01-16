'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SentIcon, UserGroupIcon, AlertCircleIcon, CheckmarkCircle01Icon, Loading03Icon } from 'hugeicons-react';
import CodeBlock from '@/components/ui/CodeBlock';
import { DemoPageHeader, InfoCard, DemoButton, PrivacyVisualizer, TxLink } from '@/components/demo';
import { useDemoStatus } from '@/hooks/useDemoStatus';

export default function TransferDemoPage() {
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState, isError, error } = useDemoStatus();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('0.01');
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [stealthAddress, setStealthAddress] = useState<string | null>(null);
    const [decoys, setDecoys] = useState<string[]>([]);

    const handleTransfer = async () => {
        setStatus('loading');

        try {
            // Step 1: Generate stealth address via API
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: recipient || 'self' } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth generation failed');
            setStealthAddress(stealthData.stealthAddress);

            // Step 2: Execute transfer via API
            const transferRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'transfer',
                    params: { amount: parseFloat(amount), recipient: recipient || 'self' }
                })
            });
            const transferData = await transferRes.json();
            if (!transferData.success) throw new Error(transferData.error || 'Transfer failed');

            setTxSignature(transferData.signature);
            setDecoys(transferData.decoyOutputs || []);
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
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Demo Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
                <div className="flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="text-amber-300 font-medium mb-1">Server-Side Demo</p>
                        <p className="text-amber-200/70 text-xs">All operations run via API. No wallet required.</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                icon={SentIcon}
                badge="Privacy Feature"
                title="Stealth Transfer"
                description="Send to one-time stealth addresses. Ashborn Privacy Relay ensures protocols never see your identity."
                color="blue"
                privacyRelay
            />

            <InfoCard
                icon={UserGroupIcon}
                title="How Stealth Addresses Work"
                color="blue"
                steps={[
                    { label: '1. Shared Secret (ECDH)', color: 'blue' },
                    { label: '2. Derive Stealth Addr', color: 'purple' },
                    { label: '3. Send to Stealth', color: 'green' }
                ]}
            >
                <div>
                    Stealth addresses allow private receipt of funds. Each transaction uses a unique derived address.
                </div>
            </InfoCard>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
            >
                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckmarkCircle01Icon className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="text-xl font-semibold mb-2 text-green-400">Transfer Complete</div>
                        <p className="text-gray-400 mb-4">Funds sent to stealth address.</p>

                        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5 space-y-3">
                            {stealthAddress && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Stealth Address</div>
                                    <code className="text-xs text-green-300 break-all font-mono">{stealthAddress}</code>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Transaction</div>
                                {txSignature && <TxLink signature={txSignature} />}
                            </div>
                        </div>

                        {decoys.length > 0 && (
                            <div className="mb-6 text-left">
                                <div className="text-xs text-gray-500 mb-2">Decoys (Ring Members)</div>
                                <div className="flex gap-2 flex-wrap text-[10px] font-mono text-gray-600">
                                    {decoys.map((d, i) => <span key={i} className="bg-white/5 px-2 py-1 rounded">{d.slice(0, 12)}...</span>)}
                                </div>
                            </div>
                        )}

                        <DemoButton onClick={handleReset} icon={SentIcon}>Send Another</DemoButton>
                    </div>
                ) : isError ? (
                    <div className="text-center py-8">
                        <h3 className="text-xl font-semibold mb-2 text-red-400">Failed</h3>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <DemoButton onClick={handleReset}>Try Again</DemoButton>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Recipient (Optional)</label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Leave empty for self-transfer"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono"
                                />
                            </div>
                        </div>

                        <DemoButton onClick={handleTransfer} loading={isLoading} icon={SentIcon} variant="gradient">
                            {isLoading ? 'Processing...' : 'Send Stealth Transfer'}
                        </DemoButton>
                    </>
                )}
            </motion.div>

            <PrivacyVisualizer
                publicView={
                    <>
                        <div className="text-gray-500 text-xs mb-1">On-Chain View</div>
                        <div className="text-blue-300 font-mono text-xs">
                            Sender → <span className="text-purple-400">StealthAddr</span>
                        </div>
                        <div className="mt-4 text-xs text-gray-600">
                            Observer sees transfer to random address. Cannot link to recipient.
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
                            Recipient detects address with private view key.
                        </div>
                    </>
                }
            />

            <CodeBlock
                language="typescript"
                code={`// Transfer via API (no wallet required)
const stealthRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'stealth', params: { recipient } })
});

const transferRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'transfer', params: { amount: 0.5 } })
});`}
                filename="transfer.ts"
            />
        </div>
    );
}
