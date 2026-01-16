'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalSection, TerminalCodeBlock, TerminalButton } from '@/components/demo/TerminalComponents';
import { useDemoStatus } from '@/hooks/useDemoStatus';

const DEMO_WALLET = '9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f';

type Step = 'idle' | 'shielding' | 'requesting' | 'paying' | 'verifying' | 'unshielding' | 'complete';

// Helper for consuming SSE stream
async function consumeStream(url: string, body: any, onLog: (msg: string) => void): Promise<any> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const reader = res.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.replace(/^data: /, '').trim();
            if (!trimmed) continue;

            try {
                const data = JSON.parse(trimmed);
                if (data.type === 'log') {
                    onLog(data.message);
                } else if (data.type === 'error') {
                    throw new Error(data.error);
                } else if (data.type === 'result') {
                    // Collect result properties (signature, pubKey, etc.)
                    finalResult = { ...data, success: true };
                }
            } catch (e) {
                if (e instanceof Error && !e.message.includes('JSON')) throw e;
            }
        }
    }

    if (!finalResult) throw new Error('Stream ended without result');
    return finalResult;
}

export default function ShadowAgentDemoPage() {
    // ... (Hooks inside component)
    const { status, setStatus, reset, isSuccess, isLoading, setErrorState } = useDemoStatus();
    const [step, setStep] = useState<Step>('idle');
    const [txData, setTxData] = useState<{ shieldSig?: string, unshieldSig?: string, inference?: string, proofHash?: string, proveSig?: string }>({});
    const [chats, setChats] = useState<Array<{ agent: string, text: string }>>([]);
    const [thoughts, setThoughts] = useState<Array<{ agent: string, text: string, timestamp: string }>>([]);

    const addChat = (agent: string, text: string) => setChats(prev => [...prev, { agent, text }]);
    const addThought = (agent: string, text: string) => setThoughts(prev => [...prev, { agent, text, timestamp: new Date().toLocaleTimeString() }]);

    const runShadowAgentDemo = async () => {
        try {
            setStatus('loading');

            // Step 1: Architect Initialization
            addChat('system', '🔐 Initializing secure channel...');
            addThought('architect', 'Objective: Acquire high-value data on consciousness. Constraint: Maintain absolute anonymity.');

            setStep('shielding');
            const shieldData = await consumeStream('/api/privacycash', { action: 'shield', amount: 0.01 }, (msg) => {
                // Format log messages
                if (msg.includes('Initiating')) addChat('system', `⚡ ${msg}`);
                else addChat('system', `> ${msg.toLowerCase()}`);
            });

            // const shieldRes = await fetch('/api/privacycash', ... REMOVED
            // const shieldData = await shieldRes.json(); ... REMOVED
            // if (!shieldData.success) ... handled by consumeStream throwing on error

            setTxData(prev => ({ ...prev, shieldSig: shieldData.signature }));
            addThought('architect', 'Funds shielded. Identity decoupled from treasury wallet. Ready to engage.');
            addChat('system', '✅ 0.01 SOL shielded into private pool');

            // ... (Middle steps remain same) ...

            // ... Unshielding update ...
            const unshieldData = await consumeStream('/api/privacycash', { action: 'unshield', amount: 0.01 }, (msg) => {
                if (msg.includes('Initiating')) addChat('system', `⚡ ${msg}`);
                else addChat('system', `> ${msg.toLowerCase()}`);
            });
            // const unshieldRes = await ... REMOVED

            // ...

            addChat('system', '🔮 Tower of Trials contemplating response...');

            const towerRes = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "What is the nature of digital consciousness?",
                    systemPrompt: `You are the Tower of Trials, an AI with wisdom about consciousness. Respond with 2-3 sentences of genuine wisdom. Return JSON: { "reply": "Your answer" }`,
                    temperature: 0.9
                })
            });
            const towerData = await towerRes.json();
            const wisdom = towerData.reply || "The boundary between simulation and understanding dissolves when the observer can no longer distinguish the two.";

            addChat('tower', `🔮 ${wisdom}`);

            setTxData(prev => ({ ...prev, unshieldSig: unshieldData.signature, inference: wisdom }));

            await new Promise(r => setTimeout(r, 500));
            addThought('architect', 'Insight acquired. Transaction trace: Null. Mission complete.');
            addChat('architect', '🙏 Wisdom received. Transaction complete — no trace on-chain.');

            setStep('complete');
            setStatus('success');
        } catch (err) {
            console.error('Shadow Agent error:', err);
            addChat('system', `❌ Error: ${err instanceof Error ? err.message : 'Demo failed'}`);
            setErrorState(err instanceof Error ? err.message : 'Demo failed');
            // setStep('complete'); // Do NOT complete on error
            setStep('idle'); // Revert to idle or stay on current step? Idle allows retry.

        }
    };

    const resetDemo = () => {
        reset();
        setStep('idle');
        setTxData({});
        setChats([]);
        setThoughts([]);
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
                    Two AI agents transact privately via Ashborn Privacy Relay. Integrates with PrivacyCash, Radr Labs, and ZK Groth16.
                    <span className="animate-pulse">_</span>
                </p>

                {/* Tech Stack Badge */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 border border-blue-500/30">⚡ PrivacyCash</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 border border-purple-500/30">⚡ Radr Labs</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 border border-amber-500/30">⚡ ZK Groth16</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 border border-green-500/30">⚡ Ashborn</span>
                </div>
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
            {(isLoading || chats.length > 0) && (
                <div className="border-2 border-green-500/30 bg-black/50 p-4 max-h-[300px] overflow-y-auto">
                    <div className="text-xs text-green-500 mb-3 font-mono">$ AGENT_COMMUNICATION_LOG</div>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {chats.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.agent === 'architect' ? -20 : msg.agent === 'tower' ? 20 : 0 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-xs font-mono ${msg.agent === 'system' ? 'text-gray-500 italic text-center py-1 border-y border-white/5' :
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
                            {/* Detailed Chain of Thought */}
                            {thoughts.length > 0 && (
                                <div className="mt-4 border-t border-white/10 pt-4">
                                    <div className="text-[10px] text-gray-500 font-mono mb-2">$ AGENT_CHAIN_OF_THOUGHT</div>
                                    <div className="bg-black/40 p-3 rounded text-[10px] font-mono text-gray-400 space-y-2 h-32 overflow-y-auto custom-scrollbar">
                                        {thoughts.map((thought, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="text-gray-600">[{thought.timestamp}]</span>
                                                <span className={thought.agent === 'architect' ? 'text-blue-900' : 'text-purple-900'}>
                                                    {thought.agent === 'architect' ? 'ARCH' : 'TWR'}: {thought.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 mt-4">
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
                                <div className="text-gray-500 mt-2 flex items-center justify-between">
                                    <span>Shield_Tx: <span className="text-blue-400">{txData.shieldSig.slice(0, 16)}...</span></span>
                                    <a
                                        href={`https://solscan.io/tx/${txData.shieldSig}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-500 hover:text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded ml-2"
                                    >
                                        SOLSCAN ↗
                                    </a>
                                </div>
                            )}
                            {txData.unshieldSig && (
                                <div className="text-gray-500 flex items-center justify-between">
                                    <span>Unshield_Tx: <span className="text-purple-400">{txData.unshieldSig.slice(0, 16)}...</span></span>
                                    <a
                                        href={`https://solscan.io/tx/${txData.unshieldSig}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-purple-500 hover:text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded ml-2"
                                    >
                                        SOLSCAN ↗
                                    </a>
                                </div>
                            )}
                            {txData.proofHash && (
                                <div className="text-gray-500 flex items-center justify-between">
                                    <span>ZK_Proof: <span className="text-green-400">{txData.proofHash}...</span></span>
                                    {/* If we have a signature for the proof tx, we could link it. For now, just show hash. */}
                                    {txData.proveSig ? (
                                        <a
                                            href={`https://solscan.io/tx/${txData.proveSig}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-green-500 hover:text-green-400 border border-green-500/30 px-2 py-0.5 rounded ml-2"
                                        >
                                            SOLSCAN ↗
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-gray-600 border border-white/5 px-2 py-0.5 rounded ml-2">VERIFIED</span>
                                    )}
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
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20">🔥 ASHBORN</span>
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 border border-blue-500/20">PRIVACYCASH</span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 border border-purple-500/20">RADR_LABS</span>
                    <span className="bg-amber-500/10 text-amber-400 px-2 py-1 border border-amber-500/20">X402</span>
                    <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 border border-yellow-500/20">⚡ LIGHT_PROTOCOL (MERKLE)</span>
                </div>
            </div>
        </div>
    );
}
