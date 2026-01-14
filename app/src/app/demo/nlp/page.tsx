'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2, Coins } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    parsed?: {
        action: string;
        params: Record<string, string>;
        confidence: number;
    };
}

const EXAMPLE_COMMANDS = [
    "Shield 5 SOL and send to 9TW3HR9WkGpiA9Ju8UvZh8LDCCZfcjELfzpSKHsqyR9f",
    "Send $50 to alleyboss.sol privately",
    "Prove my balance is under $10,000",
    "What's my shielded balance?",
    "Unshield 0.5 SOL",
];

export default function NLPDemoPage() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "👋 **Welcome to Ashborn AI**\n\nI can execute privacy commands using the SDK.\nCost per request: **0.001 SOL** (Micropayment)\n\nTry saying: *\"Shield 5 SOL and send to 9TW3...\"* or *\"Send to alleyboss.sol\"*" },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'paying' | 'paid'>('idle');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // 1. Attempt Request
            let response = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            // 2. Handle 402 Payment Required
            if (response.status === 402) {
                if (!publicKey) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ **Wallet Required**\n\nPlease connect your wallet to pay the 0.001 SOL query fee." }]);
                    setIsTyping(false);
                    return;
                }

                setPaymentStatus('paying');
                const paymentInfo = await response.json(); // { address, amount, token }

                // Create Payment Transaction
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey(paymentInfo.address),
                        lamports: paymentInfo.amount,
                    })
                );

                const signature = await sendTransaction(transaction, connection);
                await connection.confirmTransaction(signature, 'confirmed');
                setPaymentStatus('paid');

                // 3. Retry Request with Proof of Payment
                response = await fetch('/api/agent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Solana ${signature}`
                    },
                    body: JSON.stringify({ message: input })
                });
            }

            if (!response.ok) throw new Error("AI Request failed");

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply,
                parsed: {
                    action: data.action,
                    params: data.params,
                    confidence: data.confidence
                }
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "❌ **Error**\n\nFailed to reach the agent. Please try again." }]);
        } finally {
            setIsTyping(false);
            setPaymentStatus('idle');
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* Title Header inside the card */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Ashborn AI Interface</h2>
                            <p className="text-[10px] text-gray-400">Powered by OpenAI &amp; x402 Paywall</p>
                        </div>
                    </div>
                    {!publicKey && <WalletMultiButton className="!bg-purple-600 !h-8 !text-xs !px-3" />}
                </div>
                {/* How it works mini-guide */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">1. Type Command</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">2. Pay 0.001 SOL</span>
                    <span className="text-gray-600">→</span>
                    <span className="bg-green-500/10 text-green-300 px-2 py-0.5 rounded border border-green-500/20">3. AI Executes</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-blue-400" /> : <Bot className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className={`max-w-[80%]`}>
                            <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm shadow-lg'
                                : 'bg-[#1A1A1A] border border-white/10 text-gray-200 rounded-bl-sm shadow-sm'
                                }`}>
                                <div className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 rounded font-mono text-xs">$1</code>').replace(/\n/g, '<br/>')
                                }} />
                            </div>
                            {msg.parsed && msg.role === 'user' && (
                                <div className="mt-1 text-[10px] text-gray-600 font-mono text-right">
                                    Parsed: {msg.parsed.action} • {Math.round(msg.parsed.confidence * 100)}%
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Status Indicator */}
                {(isTyping || paymentStatus === 'paying') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><Bot className="w-4 h-4 text-purple-400" /></div>
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-xs text-gray-400">
                            {paymentStatus === 'paying' ? (
                                <>
                                    <Coins className="w-3 h-3 text-yellow-500 animate-pulse" />
                                    <span>Processing micropayment (0.001 SOL)...</span>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                                    <span>Ashborn is thinking...</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                    {EXAMPLE_COMMANDS.map((cmd, i) => (
                        <button key={i} onClick={() => setInput(cmd)} className="shrink-0 text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition text-gray-400 hover:text-white">
                            {cmd}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isTyping || paymentStatus !== 'idle'}
                        placeholder="Type a command..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition placeholder:text-gray-600 disabled:opacity-50"
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isTyping || paymentStatus !== 'idle'} className="px-4 bg-white text-black hover:bg-gray-200 rounded-xl transition disabled:opacity-50 font-medium">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
