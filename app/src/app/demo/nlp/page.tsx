'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

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
    "Shield 1 SOL",
    "Send $50 to @alice privately",
    "Prove my balance is under $10,000",
    "What's my shielded balance?",
    "Unshield 0.5 SOL",
];

const parseCommand = (input: string): Message['parsed'] => {
    const lower = input.toLowerCase();

    if (lower.includes('shield') && !lower.includes('unshield')) {
        const amount = input.match(/(\d+\.?\d*)\s*(sol|SOL)?/);
        return { action: 'ASHBORN_SHIELD', params: { amount: amount?.[1] || '1', mint: 'SOL' }, confidence: 0.95 };
    }
    if (lower.includes('send') || lower.includes('transfer')) {
        const amount = input.match(/\$?(\d+\.?\d*)/);
        const recipient = input.match(/@(\w+)/);
        return { action: 'ASHBORN_SEND', params: { amount: amount?.[1] || '50', recipient: recipient?.[1] || 'unknown', private: 'true' }, confidence: 0.88 };
    }
    if (lower.includes('prove') || lower.includes('range')) {
        const amount = input.match(/\$?([\d,]+)/);
        return { action: 'ASHBORN_PROVE_RANGE', params: { max: amount?.[1]?.replace(',', '') || '10000' }, confidence: 0.92 };
    }
    if (lower.includes('balance')) return { action: 'ASHBORN_BALANCE', params: {}, confidence: 0.97 };
    if (lower.includes('unshield')) {
        const amount = input.match(/(\d+\.?\d*)\s*(sol|SOL)?/);
        return { action: 'ASHBORN_UNSHIELD', params: { amount: amount?.[1] || '0.5' }, confidence: 0.94 };
    }
    return { action: 'UNKNOWN', params: {}, confidence: 0.2 };
};

const generateResponse = (parsed: Message['parsed']): string => {
    if (!parsed) return "I couldn't understand that command.";
    if (parsed.confidence < 0.5) return "🤔 I'm not sure what you meant. Try commands like 'shield 1 SOL'.";

    switch (parsed.action) {
        case 'ASHBORN_SHIELD': return `✅ **Shielding ${parsed.params.amount} SOL**\n\nCreating commitment: \`C = Poseidon(amount, blinding)\`\n\n*Demo: Transaction would execute on devnet.*`;
        case 'ASHBORN_SEND': return `✅ **Sending $${parsed.params.amount} to @${parsed.params.recipient}**\n\nGenerating stealth address...\nAdding 3 decoy outputs...\n\n*Demo: Private transfer would execute via relayer.*`;
        case 'ASHBORN_PROVE_RANGE': return `✅ **Generating Range Proof**\n\nProving: balance ∈ [$0, $${parsed.params.max}]\n\n*Verifier will learn:* Balance is under $${parsed.params.max}\n*Verifier will NOT learn:* Exact balance`;
        case 'ASHBORN_BALANCE': return `💰 **Shielded Balance**\n\n• Total: 2.5 SOL (simulated)\n• Available: 2.0 SOL\n• Pending: 0.5 SOL (24h delay)`;
        case 'ASHBORN_UNSHIELD': return `✅ **Unshielding ${parsed.params.amount} SOL**\n\nRevealing nullifier...\nVerifying 24-hour delay...\n\n*Demo: Funds would transfer to public wallet.*`;
        default: return "I couldn't understand that command.";
    }
};

export default function NLPDemoPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "👋 **Welcome to Ashborn NLP**\n\nI understand natural language commands for privacy operations. Try saying:\n\n• \"Shield 1 SOL\"\n• \"Send $50 to @alice privately\"\n• \"Prove my balance is under $10k\"\n\nPowered by GPT-4 with confidence thresholds." },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage: Message = { role: 'user', content: input };
        const parsed = parseCommand(input);
        userMessage.parsed = parsed;
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
        const response = generateResponse(parsed);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsTyping(false);
    };

    return (
        <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* Title Header inside the card */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white">Ashborn AI Interface</h2>
                    <p className="text-[10px] text-gray-400">Natural Language Processor v2.0</p>
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
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><Bot className="w-4 h-4 text-purple-400" /></div>
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3"><Loader2 className="w-4 h-4 animate-spin text-purple-400" /></div>
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
                        placeholder="Type a command (e.g., 'Shield 1 SOL')..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition placeholder:text-gray-600"
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-4 bg-white text-black hover:bg-gray-200 rounded-xl transition disabled:opacity-50 font-medium">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
