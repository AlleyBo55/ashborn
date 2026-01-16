'use client';

import { useState } from 'react';
import { TerminalDemoWrapper, TerminalSection, TerminalCodeBlock, TerminalButton, TerminalOutput } from '@/components/demo/TerminalComponents';
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
            const stealthRes = await fetch('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stealth', params: { recipient: recipient || 'self' } })
            });
            const stealthData = await stealthRes.json();
            if (!stealthData.success) throw new Error(stealthData.error || 'Stealth generation failed');
            setStealthAddress(stealthData.stealthAddress);

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
        <TerminalDemoWrapper
            title="STEALTH_TRANSFER"
            tag="PRIVACY_FEATURE"
            description="Send to one-time stealth addresses. Ashborn Privacy Relay ensures protocols never see your identity."
        >
            <TerminalSection title="PROTOCOL_FLOW">
                <div className="text-sm text-gray-300 space-y-2">
                    <p>$ 1. Shared Secret (ECDH)</p>
                    <p>$ 2. Derive Stealth Address</p>
                    <p>$ 3. Send to Stealth</p>
                    <p className="text-xs text-gray-500">$ Each transaction uses unique derived address</p>
                </div>
            </TerminalSection>

            {isSuccess ? (
                <>
                    <TerminalSection title="TRANSFER_COMPLETE" variant="success">
                        <TerminalOutput
                            lines={[
                                `Status: ✓ COMPLETE`,
                                `Stealth_Address: ${stealthAddress?.slice(0, 24)}...`,
                                `Transaction: ${txSignature?.slice(0, 24)}...`,
                                `Decoy_Count: ${decoys.length}`,
                                `Privacy: MAXIMUM`
                            ]}
                            type="success"
                        />
                        {decoys.length > 0 && (
                            <div className="mt-4">
                                <div className="text-xs text-gray-500 mb-2 font-mono">$ RING_MEMBERS (DECOYS)</div>
                                <div className="flex gap-2 flex-wrap text-[10px] font-mono text-gray-600">
                                    {decoys.map((d, i) => (
                                        <span key={i} className="bg-white/5 px-2 py-1 border border-white/10">
                                            {d.slice(0, 12)}...
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={handleReset}>$ SEND_ANOTHER</TerminalButton>
                    </div>
                </>
            ) : isError ? (
                <>
                    <TerminalSection title="ERROR" variant="error">
                        <TerminalOutput lines={[`Error: ${error}`, `Status: FAILED`]} type="error" />
                    </TerminalSection>
                    <div className="flex justify-center">
                        <TerminalButton onClick={handleReset}>$ TRY_AGAIN</TerminalButton>
                    </div>
                </>
            ) : (
                <TerminalSection title="TRANSFER_CONFIGURATION">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ RECIPIENT (OPTIONAL)</label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="leave_empty_for_self_transfer"
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono placeholder:text-gray-700 focus:border-green-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-green-500 mb-2 font-mono">$ AMOUNT (SOL)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black border border-green-500/30 px-4 py-3 text-sm text-green-400 font-mono focus:border-green-500 focus:outline-none"
                            />
                        </div>

                        <TerminalButton onClick={handleTransfer} loading={isLoading}>
                            {isLoading ? '$ PROCESSING...' : '$ SEND_STEALTH_TRANSFER'}
                        </TerminalButton>

                        <p className="text-center text-xs text-gray-600 font-mono">
                            $ server-side_api • no_wallet_required
                        </p>
                    </div>
                </TerminalSection>
            )}

            <TerminalSection title="PRIVACY_COMPARISON">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3">
                        <div className="text-blue-400 font-mono mb-2">$ ON_CHAIN_VIEW</div>
                        <p className="text-gray-400">Sender → StealthAddr</p>
                        <p className="text-gray-600 mt-2">Observer cannot link to recipient</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 p-3">
                        <div className="text-green-400 font-mono mb-2">$ RECIPIENT_VIEW</div>
                        <p className="text-gray-400">StealthAddr (Owned)</p>
                        <p className="text-gray-600 mt-2">Detected with private view key</p>
                    </div>
                </div>
            </TerminalSection>

            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`const stealthRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'stealth', params: { recipient } })
});

const transferRes = await fetch('/api/ashborn', {
  method: 'POST',
  body: JSON.stringify({ action: 'transfer', params: { amount: 0.5 } })
});`}
                />
            </TerminalSection>
        </TerminalDemoWrapper>
    );
}
