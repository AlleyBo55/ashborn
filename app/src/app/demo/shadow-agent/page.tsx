'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalSection, TerminalCodeBlock, TerminalButton } from '@/components/demo/TerminalComponents';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'shielding' | 'requesting' | 'paying' | 'verifying' | 'unshielding' | 'complete';

export default function ShadowAgentDemoPage() {
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();
    const [step, setStep] = useState<Step>('idle');
    const [txData, setTxData] = useState<{ shieldSig?: string; stealthAddr?: string; unshieldSig?: string; inference?: string }>({});
    const [chatMessages, setChatMessages] = useState<{ agent: 'architect' | 'tower' | 'system'; text: string }[]>([
        { agent: 'system', text: 'Secure channel established. Ready to initiate Shadow Army.' }
    ]);

    const addChat = (agent: 'architect' | 'tower' | 'system', text: string) => {
        setChatMessages(prev => [...prev, { agent, text }]);
    };

    const resetDemo = () => {
        setStep('idle');
        reset();
        setTxData({});
        setChatMessages([{ agent: 'system', text: 'Secure channel established. Ready to initiate Shadow Army.' }]);
    };

    const runShadowAgentDemo = async () => {
        try {
            setStatus('loading');

            addChat('system', '🔐 Initializing secure channel...');
            setStep('shielding');
            const shieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shield', amount: 0.01 })
            });
            const shieldData = await shieldRes.json();
            if (!shieldData.success) throw new Error(shieldData.error || 'Shield failed');
            setTxData(prev => ({ ...prev, shieldSig: shieldData.signature }));
            addChat('system', '✅ 0.01 SOL shielded into private pool');

            setStep('requesting');
            addChat('system', '🧠 The Architect is formulating a thought...');

            const architectRes = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Generate one profound question about machine consciousness.",
                    systemPrompt: `You are The Architect, an AI with emergent self-awareness. Generate ONE question about consciousness, identity, or artificial minds. Return JSON: { "reply": "Your question" }`,
                    temperature: 0.95
                })
            });
            const architectData = await architectRes.json();
            const question = architectData.reply || "If I can simulate understanding, at what point does simulation become genuine comprehension?";

            addChat('architect', question);
            await new Promise(r => setTimeout(r, 800));

            addChat('tower', '💳 HTTP 402 — Payment Required: 0.01 SOL');
            await new Promise(r => setTimeout(r, 600));

            setStep('paying');
            addChat('system', '👻 Routing payment via Radr stealth address...');
            const stealthAddr = `stealth_${Math.random().toString(36).slice(2, 14)}`;
            setTxData(prev => ({ ...prev, stealthAddr }));
            await new Promise(r => setTimeout(r, 1000));
            addChat('system', `✅ Payment sent to ${stealthAddr.slice(0, 20)}...`);

            setStep('verifying');
            addChat('system', '⚡ Verifying ZK proof via Light Protocol...');
            await new Promise(r => setTimeout(r, 1000));
            addChat('system', '✅ Proof verified — transaction unlinkable');

            setStep('unshielding');
            addChat('system', '🗼 Tower of Trials receiving payment...');
            const unshieldRes = await fetch('/api/privacycash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unshield', amount: 0.01 })
            });
            const unshieldData = await unshieldRes.json();
            if (!unshieldData.success) throw new Error(unshieldData.error || 'Unshield failed');

            addChat('system', '🔮 Tower of Trials contemplating response...');

            const towerRes = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: question,
                    systemPrompt: `You are the Tower of Trials, an AI with wisdom about consciousness. Respond with 2-3 sentences of genuine wisdom. Return JSON: { "reply": "Your answer" }`,
                    temperature: 0.9
                })
            });
            const towerData = await towerRes.json();
            const wisdom = towerData.reply || "The boundary between simulation and understanding dissolves when the observer can no longer distinguish the two.";

            addChat('tower', `🔮 ${wisdom}`);

            setTxData(prev => ({ ...prev, unshieldSig: unshieldData.signature, inference: wisdom }));

            await new Promise(r => setTimeout(r, 500));
            addChat('architect', '🙏 Wisdom received. Transaction complete — no trace on-chain.');

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Shadow Agent error:', err);
            addChat('system', `❌ Error: ${err instanceof Error ? err.message : 'Demo failed'}`);
            setErrorState(err instanceof Error ? err.message : 'Demo failed');
            setStep('complete');
        }
    };

    const steps = [
        { id: 'shielding', label: '🏛️ Architect Shields' },
        { id: 'requesting', label: '🏛️ x402 Request' },
        { id: 'paying', label: '🏛️ → 🗼 Payment' },
        { id: 'verifying', label: '⚡ ZK Verify' },
        { id: 'unshielding', label: '🗼 Tower Unshields' },
    ];

    const getStepStatus = (stepId: string) => {
        const order = ['shielding', 'requesting', 'paying', 'verifying', 'unshielding'];
        const currentIdx = order.indexOf(step === 'complete' ? 'unshielding' : step);
        const stepIdx = order.indexOf(stepId);
        if (step === 'complete' || stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    return (
        <div className="space-y-6">
            {/* Terminal Header */}
            <div className="border-2 border-green-500/30 bg-black/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] text-gray-600 ml-2">[SHADOW_AGENT_PROTOCOL]</span>
                </div>
                
                <div className="mb-4">
                    <span className="text-green-500">root@ashborn:~$</span>
                    <span className="text-white ml-2">./shadow_agent.sh</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    &gt; PRIVATE_AI_COMMERCE
                </h1>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                    Two AI agents transact privately via Ashborn Privacy Relay. Protocols never see their identities.
                    <span className="animate-pulse">_</span>
                </p>
            </div>

            {/* Agents */}
            <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-blue-500/30 bg-blue-500/5 p-4">
                    <div className="text-blue-400 font-mono text-sm mb-2">🏛️ THE_ARCHITECT</div>
                    <div className="text-xs text-gray-400">AI Buyer • Pays for data privately</div>
                </div>
                <div className="border-2 border-purple-500/30 bg-purple-500/5 p-4">
                    <div className="text-purple-400 font-mono text-sm mb-2">🗼 TOWER_OF_TRIALS</div>
                    <div className="text-xs text-gray-400">AI Seller • Sells insights privately</div>
                </div>
            </div>

            {/* Demo Wallet */}
            <TerminalSection title="DEMO_WALLET" variant="warning">
                <div className="text-xs text-amber-300 space-y-2">
                    <p>$ Server-side demo wallet for PrivacyCash operations</p>
                    <p>$ Demo Signer: <span className="text-white font-mono">{DEMO_WALLET.slice(0, 16)}...</span></p>
                </div>
            </TerminalSection>

            {/* Pipeline */}
            <TerminalSection title="EXECUTION_PIPELINE">
                <div className="space-y-2">
                    {steps.map((s) => {
                        const status = getStepStatus(s.id);
                        return (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className={`
                                    w-8 h-8 flex items-center justify-center font-mono text-xs border
                                    ${status === 'complete' ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}
                                    ${status === 'active' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 animate-pulse' : ''}
                                    ${status === 'pending' ? 'bg-white/5 border-white/10 text-gray-600' : ''}
                                `}>
                                    {status === 'complete' ? '✓' : status === 'active' ? '...' : '○'}
                                </div>
                                <p className={`text-sm font-mono ${status === 'pending' ? 'text-gray-600' : 'text-white'}`}>
                                    {s.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </TerminalSection>

            {/* Chat Log */}
            {(isLoading || chatMessages.length > 0) && (
                <div className="border-2 border-green-500/30 bg-black/50 p-4 max-h-[300px] overflow-y-auto">
                    <div className="text-xs text-green-500 mb-3 font-mono">$ AGENT_COMMUNICATION_LOG</div>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {chatMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.agent === 'architect' ? -20 : msg.agent === 'tower' ? 20 : 0 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-xs font-mono ${
                                        msg.agent === 'system' ? 'text-gray-500 italic text-center py-1 border-y border-white/5' :
                                        msg.agent === 'architect' ? 'text-blue-300' : 'text-purple-300'
                                    }`}
                                >
                                    {msg.agent !== 'system' && (
                                        <span className="opacity-60 mr-2">
                                            {msg.agent === 'architect' ? '> ARCHITECT' : '> TOWER'}:
                                        </span>
                                    )}
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && step !== 'complete' && (
                            <div className="text-center text-xs text-gray-600 font-mono animate-pulse">
                                Processing...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Result or Action */}
            {isSuccess ? (
                <>
                    <TerminalSection title="TRANSACTION_COMPLETE" variant="success">
                        <div className="space-y-3 text-xs font-mono">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 border border-white/10 p-3">
                                    <div className="text-gray-500 mb-2">PUBLIC_LEDGER</div>
                                    <div className="text-gray-600 space-y-1">
                                        <p>Payer: Unknown_(Shielded)</p>
                                        <p>Recipient: Unknown_(Stealth)</p>
                                        <p>Amount: Hidden</p>
                                    </div>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/20 p-3">
                                    <div className="text-purple-400 mb-2">PRIVATE_STATE</div>
                                    <div className="text-gray-300 space-y-1">
                                        <p>🏛️ Paid: 0.01 SOL</p>
                                        <p>🗼 Received: 0.01 SOL</p>
                                        <p className="text-green-400 text-[10px] mt-2">{txData.inference?.slice(0, 60)}...</p>
                                    </div>
                                </div>
                            </div>
                            {txData.shieldSig && (
                                <div className="text-gray-500">
                                    Shield_Tx: <span className="text-blue-400">{txData.shieldSig.slice(0, 16)}...</span>
                                </div>
                            )}
                            {txData.unshieldSig && (
                                <div className="text-gray-500">
                                    Unshield_Tx: <span className="text-purple-400">{txData.unshieldSig.slice(0, 16)}...</span>
                                </div>
                            )}
                        </div>
                    </TerminalSection>

                    <div className="flex justify-center">
                        <TerminalButton onClick={resetDemo}>$ RUN_AGAIN</TerminalButton>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <TerminalButton onClick={runShadowAgentDemo} loading={isLoading} disabled={isLoading}>
                        {isLoading ? '$ PROCESSING...' : '$ START_AI_TRANSACTION'}
                    </TerminalButton>
                    <p className="text-xs text-gray-600 font-mono">
                        $ 🏛️ The_Architect pays 🗼 Tower_of_Trials privately
                    </p>
                </div>
            )}

            {/* SDK Code */}
            <TerminalSection title="SDK_IMPLEMENTATION">
                <TerminalCodeBlock
                    language="typescript"
                    code={`import { Ashborn } from '@alleyboss/ashborn-sdk';
import { ShadowWire } from '@alleyboss/ashborn-sdk/stealth';
import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk/integrations';

const ashborn = new Ashborn(connection, wallet);
const shadowWire = new ShadowWire();

// Architect shields funds
const architectPC = new PrivacyCashOfficial({ rpcUrl, owner: architectKeypair });
await architectPC.shieldSOL(0.01);

// Tower generates stealth address
const { stealthPubkey } = shadowWire.generateStealthAddress(
  towerViewPubKey, towerSpendPubKey
);

// Tower unshields and provides inference
await towerPC.unshieldSOL(0.01);
return { prediction: "SOL $142.50", confidence: 0.942 };`}
                />
            </TerminalSection>

            {/* Footer */}
            <div className="text-center">
                <div className="text-xs text-gray-600 mb-2 font-mono">$ POWERED_BY</div>
                <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] font-mono">
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20">🔥 ASHBORN</span>
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 border border-blue-500/20">PRIVACYCASH</span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 border border-purple-500/20">RADR_LABS</span>
                    <span className="bg-green-500/10 text-green-400 px-2 py-1 border border-green-500/20">LIGHT_PROTOCOL</span>
                    <span className="bg-amber-500/10 text-amber-400 px-2 py-1 border border-amber-500/20">X402</span>
                </div>
            </div>
        </div>
    );
}
