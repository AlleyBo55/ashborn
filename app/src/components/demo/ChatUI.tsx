import { motion, AnimatePresence } from 'framer-motion';

type Message = { agent: string; text: string; thought?: string };
type Thought = { agent: string; text: string; timestamp: string };

export function ChatUI({ chats, logs, thoughts, demoMode = 'full-demo', isLoading = false }: { chats: Message[]; logs: Message[]; thoughts?: Thought[]; demoMode?: 'full-demo' | 'ashborn-only'; isLoading?: boolean }) {
    const getPhaseIndicator = (index: number) => {
        const msg = chats[index];
        const nextMsg = chats[index + 1];

        if (index === 0 && msg.agent === 'architect') {
            return { type: 'phase', text: '📋 NEGOTIATION INITIATED' };
        }

        if (msg.agent === 'system' && (msg.text.includes('PAYMENT PROCESSING') || msg.text.includes('PAYMENT CONFIRMED'))) {
            return null;
        }

        if (index > 0 && chats[index - 1]?.agent === 'system' &&
            chats[index - 1]?.text.includes('PAYMENT CONFIRMED') &&
            msg.agent === 'tower' && msg.text.includes('🗼')) {
            return { type: 'paid', text: '✅ PAID ANSWER' };
        }

        if (msg.agent === 'architect' && nextMsg?.agent === 'system' &&
            nextMsg?.text.includes('PAYMENT PROCESSING')) {
            return { type: 'phase', text: '🤝 NEGOTIATION COMPLETE' };
        }

        return null;
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-purple-500/30 bg-black/50 rounded-xl min-h-[600px] max-h-[800px] flex flex-col relative overflow-hidden">
                {/* Header - Fixed at Top */}
                <div className="flex justify-between items-center p-6 pb-4 bg-black/40 border-b border-white/5 backdrop-blur-sm z-10 shrink-0">
                    <div className="text-sm text-purple-400 font-mono">💬 AGENT CONVERSATION</div>

                    {/* Chat Box Mode Indicator */}
                    <div className={`
                        flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono border
                        ${demoMode === 'full-demo'
                            ? 'bg-blue-900/60 border-blue-500/40 text-blue-300'
                            : 'bg-green-900/60 border-green-500/40 text-green-300'}
                    `}>
                        <div className={`w-1.5 h-1.5 rounded-full ${demoMode === 'full-demo' ? 'bg-blue-400' : 'bg-green-400'}`} />
                        <span>{demoMode === 'full-demo' ? 'DUAL PRIVACY' : 'ASHBORN ONLY'}</span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                    <AnimatePresence>
                        {chats.map((msg, i) => {
                            const isArchitect = msg.agent === 'architect';
                            const isSystem = msg.agent === 'system';
                            const phaseIndicator = getPhaseIndicator(i);

                            return (
                                <div key={i}>
                                    {phaseIndicator && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center mb-4"
                                        >
                                            <div className={`px-4 py-2 rounded-full text-xs font-mono font-bold ${phaseIndicator.type === 'paid'
                                                ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                                                : 'bg-gray-500/20 border border-gray-500/40 text-gray-400'
                                                }`}>
                                                {phaseIndicator.text}
                                            </div>
                                        </motion.div>
                                    )}

                                    {isSystem ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex justify-center my-4"
                                        >
                                            <div className="bg-amber-500/20 border border-amber-500/40 px-6 py-3 rounded-lg text-amber-300 font-mono text-sm">
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, x: isArchitect ? -20 : 20, y: 10 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            className={`flex flex-col ${isArchitect ? 'items-start' : 'items-end'}`}
                                        >
                                            {msg.thought && (
                                                <div className={`max-w-[85%] mb-2 ${isArchitect ? 'text-left' : 'text-right'}`}>
                                                    <div className="text-xs font-mono text-gray-600 mb-1">
                                                        {isArchitect ? '🧠 ARCHITECT THINKING' : '🧠 TOWER THINKING'}
                                                    </div>
                                                    <div className="text-sm font-mono text-gray-400 italic bg-black/30 px-4 py-3 rounded border border-gray-700/30 leading-relaxed">
                                                        {msg.thought}
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`max-w-[85%] flex flex-col gap-1 ${isArchitect ? 'items-start' : 'items-end'}`}>
                                                <div className="text-xs font-mono opacity-60">
                                                    {isArchitect ? '🏛️ THE ARCHITECT' : '🗼 TOWER OF TRIALS'}
                                                </div>
                                                <div className={`px-6 py-4 rounded-2xl text-base leading-relaxed ${isArchitect
                                                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-100 rounded-tl-sm'
                                                    : 'bg-purple-500/20 border border-purple-500/30 text-purple-100 rounded-tr-sm'
                                                    }`}>
                                                    {/* Convert escaped \n from API to real newlines, then split and render markdown */}
                                                    {msg.text.replace(/^[🏛️🗼]\s*"?|"$/g, '').replace(/\\n/g, '\n').split('\n').map((line, i) => {
                                                        const trimmed = line.trim();

                                                        // Headers
                                                        if (trimmed.startsWith('# ')) {
                                                            return (
                                                                <h1 key={i} className={`text-xl sm:text-2xl font-black mt-6 mb-3 tracking-tight ${isArchitect ? 'text-blue-300' : 'text-purple-300'
                                                                    }`}>
                                                                    {trimmed.replace(/^#\s+/, '')}
                                                                </h1>
                                                            );
                                                        }
                                                        if (trimmed.startsWith('## ')) {
                                                            return (
                                                                <h2 key={i} className={`text-lg sm:text-xl font-bold mt-4 mb-2 tracking-tight ${isArchitect ? 'text-blue-200' : 'text-purple-200'
                                                                    }`}>
                                                                    {trimmed.replace(/^##\s+/, '')}
                                                                </h2>
                                                            );
                                                        }
                                                        if (trimmed.startsWith('### ')) {
                                                            return (
                                                                <h3 key={i} className={`text-base sm:text-lg font-semibold mt-3 mb-1 ${isArchitect ? 'text-blue-100' : 'text-purple-100'
                                                                    }`}>
                                                                    {trimmed.replace(/^###\s+/, '')}
                                                                </h3>
                                                            );
                                                        }

                                                        // Lists
                                                        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                                                            return (
                                                                <div key={i} className="flex gap-2 mb-1 pl-2">
                                                                    <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isArchitect ? 'bg-blue-300/50' : 'bg-purple-300/50'
                                                                        }`} />
                                                                    <div className="flex-1">
                                                                        {trimmed.substring(2).split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
                                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                                return <strong key={j} className="text-white font-bold tracking-wide">{part.slice(2, -2)}</strong>;
                                                                            }
                                                                            if (part.startsWith('*') && part.endsWith('*')) {
                                                                                return <em key={j} className={isArchitect ? "text-blue-200 italic" : "text-purple-200 italic"}>{part.slice(1, -1)}</em>;
                                                                            }
                                                                            return part;
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        // Regular Paragraphs
                                                        return (
                                                            <div key={i} className="min-h-[1.5em] mb-2 last:mb-0">
                                                                {line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
                                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                                        return <strong key={j} className="text-white font-bold tracking-wide">{part.slice(2, -2)}</strong>;
                                                                    }
                                                                    if (part.startsWith('*') && part.endsWith('*')) {
                                                                        return <em key={j} className={isArchitect ? "text-blue-200 italic" : "text-purple-200 italic"}>{part.slice(1, -1)}</em>;
                                                                    }
                                                                    return part;
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center"
                            >
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {logs.length > 0 && (
                <div className="border-2 border-green-500/30 bg-black/80 p-4 rounded-xl max-h-[200px] overflow-y-auto">
                    <div className="text-xs text-green-500 mb-3 font-mono">$ SYSTEM_LOGS</div>
                    <div className="space-y-1">
                        <AnimatePresence>
                            {logs.map((msg, i) => {
                                const urlMatch = msg.text.match(/(https?:\/\/[^\s]+)/);
                                const hasUrl = urlMatch && urlMatch[1];

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs font-mono text-gray-500"
                                    >
                                        <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                                        {hasUrl ? (
                                            <>
                                                {msg.text.substring(0, urlMatch!.index)}
                                                <a
                                                    href={hasUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 underline hover:text-blue-300"
                                                >
                                                    {hasUrl}
                                                </a>
                                                {msg.text.substring(urlMatch!.index! + hasUrl.length)}
                                            </>
                                        ) : (
                                            <> {msg.text}</>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {thoughts && thoughts.length > 0 && (
                <div className="border-2 border-yellow-500/30 bg-black/50 p-4 rounded-xl max-h-[150px] overflow-y-auto">
                    <div className="text-xs text-yellow-500 mb-3 font-mono">🧠 AGENT_THOUGHTS</div>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {thoughts.map((thought, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs font-mono text-yellow-400/80"
                                >
                                    <span className="text-yellow-600">[{thought.timestamp}]</span>
                                    <span className="text-yellow-500 ml-2">{thought.agent}:</span>
                                    <span className="ml-2">{thought.text}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
