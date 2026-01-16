'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
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
        { role: 'assistant', content: "ASHBORN_AI_INITIALIZED\n\nExecute privacy commands using natural language.\n\nTry: 'Shield 5 SOL' or 'Send to alleyboss.sol'" },
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
            const response = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    persona: 'architect',
                    systemPrompt: `You are Ashborn AI, a privacy-focused AI agent. Parse natural language commands and respond with structured privacy operations. When a user says "shield X SOL", acknowledge and explain the shielding process. When they say "send to address", explain stealth address generation. Always be helpful and privacy-focused. Use terminal-style formatting with $ prefixes.`
                })
            });

            if (!response.ok) throw new Error("AI Request failed");

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "ERROR: Failed to reach agent. Retry." }]);
        } finally {
            setIsTyping(false);
        }
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
                    <span className="text-[10px] text-gray-600 ml-2">[AI_AGENT_PROTOCOL]</span>
                </div>

                <div className="mb-4">
                    <span className="text-green-500">root@ashborn:~$</span>
                    <span className="text-white ml-2">./shadow_whisper.sh</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    &gt; SHADOW_WHISPER
                </h1>

                <p className="text-sm text-gray-400 leading-relaxed">
                    Command privacy operations with natural language. Powered by Claude AI via Ashborn Privacy Relay.
                    <span className="animate-pulse">_</span>
                </p>
            </div>

            {/* Chat Terminal */}
            <div className="border-2 border-green-500/30 bg-black/50 h-[500px] flex flex-col">
                {/* Header */}
                <div className="border-b border-green-500/30 p-3 bg-black/50">
                    <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
                        <span className="text-green-500">$</span>
                        <span>ASHBORN_AI_INTERFACE</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-500">CLAUDE_POWERED</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${msg.role === 'user' ? 'text-right' : ''}`}
                        >
                            <div className={`inline-block max-w-[85%] ${msg.role === 'user'
                                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-200'
                                : 'bg-green-500/10 border border-green-500/30 text-green-300'
                                } px-4 py-2`}>
                                <div className="text-[10px] mb-1 opacity-60">
                                    {msg.role === 'user' ? '> USER' : '> ASHBORN_AI'}
                                </div>
                                <div className="whitespace-pre-wrap text-xs leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="inline-block bg-green-500/10 border border-green-500/30 px-4 py-2">
                                    <div className="text-[10px] mb-1 text-green-500 opacity-60">
                                        &gt; ASHBORN_AI
                                    </div>
                                    <div className="text-xs text-green-400">
                                        <span className="animate-pulse">Processing...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-green-500/30 p-3 bg-black/50">
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                        {EXAMPLE_COMMANDS.map((cmd, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(cmd)}
                                className="shrink-0 text-[10px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 px-2 py-1 font-mono text-green-400 transition"
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center bg-black border border-green-500/30 px-3">
                            <span className="text-green-500 mr-2">$</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                                placeholder="type_command..."
                                className="flex-1 bg-transparent py-3 text-sm text-green-400 font-mono placeholder:text-gray-700 focus:outline-none disabled:opacity-50"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="px-6 bg-green-500 text-black hover:bg-green-400 font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            SEND
                        </button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="border-2 border-white/20 bg-black/50 p-4">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2 font-mono">
                    <span className="text-green-500">&gt;</span>
                    USAGE
                </h2>
                <div className="text-xs text-gray-400 space-y-1 font-mono">
                    <p>$ Type natural language commands</p>
                    <p>$ AI parses intent and executes privacy operations</p>
                    <p>$ No wallet required • Server-side execution</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pb-4">
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
