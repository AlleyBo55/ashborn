'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiChat02Icon, SentIcon, UserIcon, Loading03Icon, AlertCircleIcon } from 'hugeicons-react';
import { DemoPageHeader } from '@/components/demo/DemoPageHeader';

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
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "👋 **Welcome to Ashborn AI**\n\nI can execute privacy commands using the SDK.\n\nTry saying: *\"Shield 5 SOL and send to 9TW3...\"* or *\"Send to alleyboss.sol\"*" },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Call agent API directly (no micropayment for demo)
            const response = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    persona: 'architect',
                    systemPrompt: `You are Ashborn AI, a privacy-focused AI agent. Parse natural language commands and respond with structured privacy operations. When a user says "shield X SOL", acknowledge and explain the shielding process. When they say "send to address", explain stealth address generation. Always be helpful and privacy-focused.`
                })
            });

            if (!response.ok) throw new Error("AI Request failed");

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply,
                parsed: data.parsed
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "❌ **Error**\n\nFailed to reach the agent. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Demo Notice */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
                <div className="flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="text-amber-300 font-medium mb-1">Lightweight Demo</p>
                        <p className="text-amber-200/70 text-xs">No wallet required. AI agent runs via /api/agent.</p>
                    </div>
                </div>
            </motion.div>

            <DemoPageHeader
                badge="AI_AGENT_PROTOCOL"
                title="Shadow Whisper"
                description="Command privacy operations with natural language. Powered by Claude AI via Ashborn Privacy Relay."
                icon={AiChat02Icon}
                privacyRelay
            />

            <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <AiChat02Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Ashborn AI Interface</h2>
                            <p className="text-[10px] text-gray-400">Powered by Claude AI</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">1. Type Command</span>
                        <span className="text-gray-600">→</span>
                        <span className="bg-green-500/10 text-green-300 px-2 py-0.5 rounded border border-green-500/20">2. AI Responds</span>
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
                                {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-blue-400" /> : <AiChat02Icon className="w-4 h-4 text-purple-400" />}
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
                            </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><AiChat02Icon className="w-4 h-4 text-purple-400" /></div>
                                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-xs text-gray-400">
                                    <Loading03Icon className="w-3 h-3 animate-spin text-purple-400" />
                                    <span>Ashborn is thinking...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                            disabled={isTyping}
                            placeholder="Type a command..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition placeholder:text-gray-600 disabled:opacity-50"
                        />
                        <button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-4 bg-white text-black hover:bg-gray-200 rounded-xl transition disabled:opacity-50 font-medium flex items-center justify-center">
                            <SentIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
