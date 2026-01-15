'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cube01Icon,
    SentIcon,
    Shield02Icon,
    AiChat02Icon,
    ArrowRight01Icon,
    FlashIcon,
    SparklesIcon,
    ViewIcon,
    Lock01Icon,
    UserGroup01Icon,
    CommandLine01Icon,
    Activity01Icon,
    GhostIcon
} from 'hugeicons-react';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ASHBORN DEMO PAGE - SHADOW MONARCH AESTHETIC
// Apple minimalism × Google vibes × Solo Leveling darkness
// ═══════════════════════════════════════════════════════════════════════════════

// Integration Badge Component
const IntegrationBadge = ({ tech }: { tech: string }) => {
    if (tech === 'Ashborn') return (
        <span className="text-[9px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-wider">
            🔥 Ashborn
        </span>
    );
    if (tech === 'PrivacyCash') return (
        <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">
            🛡️ PrivacyCash
        </span>
    );
    if (tech.includes('Radr') || tech.includes('ShadowWire')) return (
        <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase tracking-wider">
            👻 Radr/ShadowWire
        </span>
    );
    return (
        <span className="text-[9px] font-mono bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5">
            {tech}
        </span>
    );
};

const demos = [
    {
        id: 'radr',
        title: 'ShadowWire by Radr',
        subtitle: 'STEALTH_PRIMITIVES',
        desc: "Generate unlinkable stealth addresses and ephemeral keys. The cryptographic core of private transfers.",
        href: '/demo/radr',
        icon: GhostIcon,
        gradient: 'from-purple-500 to-indigo-600',
        glow: 'shadow-[0_0_60px_rgba(139,92,246,0.3)]',
        flow: ['Gen Ephemeral Key', 'Derive Shared Secret', 'Comput Stealth Addr', 'Scan Outputs'],
        integrations: ['Radr', 'Ashborn'],
        techStack: ['ShadowWire', 'Secp256k1', 'ECDH'],
        rank: 'S+',
    },
    {
        id: 'shield',
        title: 'Shadow Extraction',
        subtitle: 'ARISE_PROTOCOL',
        desc: "Convert public SOL into invisible Shadow Notes. Your transaction history ends here.",
        href: '/demo/shield',
        icon: Cube01Icon,
        gradient: 'from-blue-600 to-purple-600',
        glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
        flow: ['Deposit SOL', 'Generate Commitment', 'Encrypt Note', 'Store On-Chain'],
        integrations: ['Ashborn'],
        techStack: ['Poseidon Hash', 'Groth16', 'BN128'],
        rank: 'S',
    },
    {
        id: 'transfer',
        title: 'Shadow Strike',
        subtitle: 'STEALTH_TRANSFER',
        desc: 'Send assets with 3 decoy outputs. Graph analysis becomes mathematically impossible.',
        href: '/demo/transfer',
        icon: SentIcon,
        gradient: 'from-green-600 to-emerald-600',
        glow: 'shadow-[0_0_60px_rgba(34,197,94,0.3)]',
        flow: ['Enter Recipient', 'Generate Decoys', 'Nullify Old', 'Create New Note'],
        integrations: ['Ashborn', 'Radr'],
        techStack: ['Ring Signatures', 'ShadowWire', 'Stealth Addr'],
        rank: 'A',
    },
    {
        id: 'interop',
        title: 'Cross-Protocol Link',
        subtitle: 'INTEROPERABILITY',
        desc: 'Seamlessly move assets between Ashborn and PrivacyCash privacy islands.',
        href: '/demo/interop',
        icon: Activity01Icon,
        gradient: 'from-cyan-500 to-blue-600',
        glow: 'shadow-[0_0_60px_rgba(6,182,212,0.3)]',
        flow: ['Shield (PrivacyCash)', 'Stealth Transfer (Ashborn)', 'Unshield (PrivacyCash)'],
        integrations: ['Ashborn', 'PrivacyCash', 'Radr'],
        techStack: ['PrivacyCash SDK', 'Ashborn SDK', 'ShadowWire'],
        rank: 'SS',
    },
    {
        id: 'prove',
        title: 'Compliance Seal',
        subtitle: 'ZK_RANGE_PROOF',
        desc: "Prove solvency without revealing balance. Auditors verify, privacy preserved.",
        href: '/demo/prove',
        icon: Shield02Icon,
        gradient: 'from-amber-500 to-orange-600',
        glow: 'shadow-[0_0_60px_rgba(245,158,11,0.3)]',
        flow: ['Define Range', 'Compute Proof', 'On-Chain Verify', 'Issue Certificate'],
        integrations: ['Ashborn'],
        techStack: ['Range Proofs', 'Groth16', 'Merkle Tree'],
        rank: 'A',
    },
    {
        id: 'ai-payment',
        title: 'Shadow Payment',
        subtitle: 'AI_COMMERCE',
        desc: 'AI Agents paying for services privately. No tracking of model usage or prompts.',
        href: '/demo/ai-payment',
        icon: AiChat02Icon,
        gradient: 'from-pink-600 to-rose-600',
        glow: 'shadow-[0_0_60px_rgba(244,63,94,0.3)]',
        flow: ['Agent Request', 'PrivacyCash Pay', 'x402 Verify', 'Service Unlock'],
        integrations: ['Ashborn', 'PrivacyCash'],
        techStack: ['PrivacyCash SDK', 'Micropay', 'x402'],
        rank: 'A+',
    },
    {
        id: 'nlp',
        title: 'Shadow Whisper',
        subtitle: 'AI_AGENT_PROTOCOL',
        desc: 'Command privacy operations with natural language. Pay-per-query micropayments.',
        href: '/demo/nlp',
        icon: SparklesIcon,
        gradient: 'from-purple-600 to-pink-600',
        glow: 'shadow-[0_0_60px_rgba(168,85,247,0.3)]',
        flow: ['Speak Intent', 'Parse Command', 'Execute Action', 'Confirm Result'],
        integrations: ['Ashborn'],
        techStack: ['OpenAI', 'x402 Paywall', 'Micropay'],
        rank: 'S',
    }
];

// ... (existing RankBadge and FlowStep components)

// Rank Badge Component
const RankBadge = ({ rank }: { rank: string }) => (
    <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border ${rank === 'S' || rank === 'S+' || rank === 'SS'
        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
        : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
        }`}>
        {rank}
    </div>
);

// Flow Step Component
const FlowStep = ({ step, index, total }: { step: string; index: number; total: number }) => (
    <div className="flex items-center gap-1">
        <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/5 font-mono">
            {index + 1}. {step}
        </span>
        {index < total - 1 && <ArrowRight01Icon className="w-3 h-3 text-gray-700" />}
    </div>
);

// Demo Card Component
const DemoCard = ({ demo, index }: { demo: typeof demos[0]; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={demo.href}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group block relative h-full"
            >
                <div className={`relative h-full bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 overflow-hidden
                    hover:border-white/20 hover:bg-[#0E0E0E] ${isHovered ? demo.glow : ''}`}
                >
                    {/* Rank Badge */}
                    <RankBadge rank={demo.rank} />

                    {/* Gradient Orb Background */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />

                    {/* Icon */}
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${demo.gradient} p-[1px] mb-5 group-hover:scale-110 transition-transform duration-500`}>
                        <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center">
                            <demo.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Subtitle & Integrations */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {demo.integrations.map((tech) => (
                            <IntegrationBadge key={tech} tech={tech} />
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight">
                        {demo.title}
                        <ArrowRight01Icon className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{demo.desc}</p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {demo.techStack.map((tech, i) => (
                            <span key={i} className="text-[9px] font-mono bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5">
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Flow Steps - Hidden by default, shown on hover */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-[9px] text-gray-600 font-mono mb-2">EXECUTION_FLOW</div>
                                    <div className="flex flex-wrap items-center gap-1">
                                        {demo.flow.map((step, i) => (
                                            <FlowStep key={i} step={step} index={i} total={demo.flow.length} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>
        </motion.div>
    );
};

// How It Works Section
const HowItWorksSection = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
    >
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mb-4">
                <ViewIcon className="w-3 h-3" />
                HOW ASHBORN WORKS
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">The Shadow Protocol</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
                Your assets enter the Shadow Domain through ZK cryptography.
                Only you hold the key to command them.
            </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
            {[
                { icon: Cube01Icon, title: 'Extract', desc: 'Deposit SOL into pool', color: 'text-blue-400', num: '01' },
                { icon: Lock01Icon, title: 'Encrypt', desc: 'Generate ZK commitment', color: 'text-purple-400', num: '02' },
                { icon: UserGroup01Icon, title: 'Anonymize', desc: 'Join global anonymity set', color: 'text-green-400', num: '03' },
                { icon: SentIcon, title: 'Command', desc: 'Spend with ZK proof', color: 'text-amber-400', num: '04' },
            ].map((step, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="relative group"
                >
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all h-full">
                        <div className="text-[10px] font-mono text-gray-700 mb-3">{step.num}</div>
                        <step.icon className={`w-5 h-5 ${step.color} mb-3`} />
                        <h4 className="font-semibold text-white text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600">{step.desc}</p>
                    </div>
                    {i < 3 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                            <ArrowRight01Icon className="w-4 h-4 text-gray-800" />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    </motion.div>
);

// Main Page Component
export default function DemoIndexPage() {
    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 pt-4"
            >
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 px-4 py-2 rounded-full text-xs font-mono mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                    <span className="text-green-400">DEVNET_LIVE</span>
                    <span className="text-gray-600">|</span>
                    <FlashIcon className="w-3 h-3 text-amber-400" />
                    <span className="text-gray-400">INTERACTIVE_DEMOS</span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                    <span className="text-white">Enter the </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">Shadow Domain</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
                    Experience zero-knowledge privacy on Solana.
                    Shield assets, transfer silently, prove compliance.
                </p>

                {/* Quick Stats */}
                <div className="flex justify-center gap-8 mt-8">
                    {[
                        { label: 'Proof Time', value: '<2s' },
                        { label: 'Anonymity Set', value: '∞' },
                        { label: 'Cost', value: '~0.001◎' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                            <div className="text-[10px] text-gray-600 font-mono tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recommended Flow Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10 p-4 bg-gradient-to-r from-purple-900/20 via-black to-purple-900/20 border border-purple-500/20 rounded-xl"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                        <div>
                            <div className="text-xs font-mono text-purple-300">RECOMMENDED_PATH</div>
                            <div className="text-sm text-gray-400">Start with Shadow Extraction, then try Transfer</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded border border-blue-500/30">Shield</span>
                        <ArrowRight01Icon className="w-3 h-3 text-gray-700" />
                        <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded border border-green-500/30">Transfer</span>
                        <ArrowRight01Icon className="w-3 h-3 text-gray-700" />
                        <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded border border-amber-500/30">Prove</span>
                        <ArrowRight01Icon className="w-3 h-3 text-gray-700" />
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded border border-purple-500/30">AI</span>
                    </div>
                </div>
            </motion.div>

            {/* Demo Cards Grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-16">
                {demos.map((demo, idx) => (
                    <DemoCard key={demo.id} demo={demo} index={idx} />
                ))}
            </div>

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* CTA Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pb-12"
            >
                <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl">
                    <div className="text-left">
                        <div className="text-sm font-semibold text-white mb-1">Ready to integrate?</div>
                        <div className="text-xs text-gray-500">Read the SDK documentation</div>
                    </div>
                    <Link
                        href="/docs"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                    >
                        <CommandLine01Icon className="w-4 h-4" />
                        View Docs
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
