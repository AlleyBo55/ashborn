'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CubeIcon from 'hugeicons-react/dist/esm/icons/cube_icon';
import SentIcon from 'hugeicons-react/dist/esm/icons/sent_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import AiChat02Icon from 'hugeicons-react/dist/esm/icons/ai_chat_02_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';
import Activity01Icon from 'hugeicons-react/dist/esm/icons/activity_01_icon';
import ViewOffIcon from 'hugeicons-react/dist/esm/icons/view_off_icon';

const demos = [
    {
        id: 'radr',
        title: 'ShadowWire',
        tag: 'STEALTH',
        desc: "Native ShadowWire stealth addresses. Unlinkable one-time keys.",
        href: '/demo/radr',
        icon: ViewOffIcon,
        color: 'purple',
        integrations: ['ShadowWire', 'Ashborn'],
    },
    {
        id: 'shield',
        title: 'Shadow Extraction',
        tag: 'ARISE',
        desc: "PrivacyCash shielding powered by Light Protocol. Enter the privacy pool.",
        href: '/demo/shield',
        icon: CubeIcon,
        color: 'blue',
        integrations: ['PrivacyCash', 'Light Protocol', 'Ashborn'],
    },
    {
        id: 'transfer',
        title: 'Shadow Strike',
        tag: 'TRANSFER',
        desc: 'Ring signatures. Unlinkable private transfers.',
        href: '/demo/transfer',
        icon: SentIcon,
        color: 'green',
        integrations: ['Ashborn', 'ShadowWire'],
    },
    {
        id: 'interop',
        title: 'Cross-Protocol',
        tag: 'INTEROP',
        desc: 'Shield → Transfer → Unshield. Full privacy flow with all protocols.',
        href: '/demo/interop',
        icon: Activity01Icon,
        color: 'cyan',
        integrations: ['Ashborn', 'PrivacyCash', 'ShadowWire', 'Light Protocol'],
    },
    {
        id: 'prove',
        title: 'Compliance Seal',
        tag: 'ZK_PROOF',
        desc: "Real Groth16 range proofs via snarkjs. Prove solvency without revealing balance.",
        href: '/demo/prove',
        icon: Shield02Icon,
        color: 'amber',
        integrations: ['Ashborn', 'ZK Groth16'],
        realZk: true,
    },
    {
        id: 'ai-payment',
        title: 'Shadow Payment',
        tag: 'AI_COMMERCE',
        desc: 'Private AI payments via x402 micropay protocol with real ZK proofs.',
        href: '/demo/ai-payment',
        icon: AiChat02Icon,
        color: 'rose',
        integrations: ['x402 Micropay', 'PrivacyCash', 'Ashborn'],
        realZk: true,
    },
    {
        id: 'nlp',
        title: 'Shadow Whisper',
        tag: 'NLP',
        desc: 'Natural language commands. AI-powered privacy.',
        href: '/demo/nlp',
        icon: SparklesIcon,
        color: 'pink',
        integrations: ['Ashborn'],
    },
    {
        id: 'shadow-agent',
        title: 'Shadow Agent',
        tag: 'AI_COMMERCE',
        desc: 'AI-to-AI private commerce with real Groth16 ZK proofs. Not simulated.',
        href: '/demo/shadow-agent',
        icon: AiChat02Icon,
        color: 'purple',
        integrations: ['All'],
        featured: true,
        realZk: true,
    },
    {
        id: 'ai-lending',
        title: 'AI Lending',
        tag: 'AI_FINANCE',
        desc: 'Private collateral proofs for AI-to-AI lending. Real snarkjs ZK verification.',
        href: '/demo/ai-lending',
        icon: Shield02Icon,
        color: 'green',
        integrations: ['Ashborn', 'ZK Groth16', 'PrivacyCash'],
        realZk: true,
    }
];

const colorClasses: Record<string, { border: string; text: string; glow: string }> = {
    purple: { border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    blue: { border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    green: { border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
    cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    amber: { border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    rose: { border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
    pink: { border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
};

export default function DemoIndexPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-green-400 font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* ASCII Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <pre className="text-[8px] sm:text-xs text-green-500/50 mb-6 overflow-x-auto">
                        {`╔═══════════════════════════════════════════════════════════════╗
║  Ashborn v0.2.3 - SHADOW DOMAIN ACCESS TERMINAL     ║
║  [DEVNET] Status: ONLINE | Latency: <2s | Cost: ~0.001◎     ║
╚═══════════════════════════════════════════════════════════════╝`}
                    </pre>

                    <div className="mb-6">
                        <span className="text-green-500">root@ashborn:~$</span>
                        <span className="text-white ml-2">cat SHADOW_DOMAIN.txt</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                        &gt; SHADOW DOMAIN
                    </h1>

                    <p className="text-sm text-gray-400 max-w-2xl mb-6">
                        Zero-knowledge privacy on Solana. Shield, transfer, prove.
                        <span className="animate-pulse">_</span>
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="bg-black/50 border border-green-500/30 px-3 py-1.5">
                            <span className="text-gray-500">PROOF_TIME:</span>
                            <span className="text-green-400 ml-2">&lt;2s</span>
                        </div>
                        <div className="bg-black/50 border border-green-500/30 px-3 py-1.5">
                            <span className="text-gray-500">ANONYMITY:</span>
                            <span className="text-green-400 ml-2">∞</span>
                        </div>
                        <div className="bg-black/50 border border-green-500/30 px-3 py-1.5">
                            <span className="text-gray-500">COST:</span>
                            <span className="text-green-400 ml-2">~0.001◎</span>
                        </div>
                    </div>
                </motion.header>

                {/* Demo Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {demos.map((demo, idx) => {
                        const colors = colorClasses[demo.color];
                        return (
                            <motion.div
                                key={demo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Link
                                    href={demo.href}
                                    className={`block bg-black/80 border-2 ${colors.border} p-5 transition-all duration-300 group hover:${colors.glow} hover:shadow-xl hover:-translate-y-1 ${demo.featured ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/20 relative' : ''}`}
                                >
                                    {demo.featured && (
                                        <div className="absolute -top-3 -right-3 bg-red-500 text-black text-[10px] font-bold px-3 py-1 rotate-12 shadow-lg">
                                            ⚡ FEATURED
                                        </div>
                                    )}
                                    {(demo as any).realZk && !demo.featured && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-black text-[8px] font-bold px-2 py-0.5 shadow-lg">
                                            ⚡ REAL_ZK
                                        </div>
                                    )}
                                    {(demo as any).realZk && demo.featured && (
                                        <div className="absolute -top-3 left-2 bg-green-500 text-black text-[8px] font-bold px-2 py-0.5 shadow-lg">
                                            ⚡ REAL_ZK
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="text-[10px] text-gray-600 mb-2 tracking-wider">
                                                [{demo.tag}]
                                            </div>
                                            <h2 className={`text-lg sm:text-xl font-bold ${colors.text} mb-2 group-hover:text-white transition-colors`}>
                                                &gt; {demo.title}
                                            </h2>
                                        </div>
                                        <demo.icon className={`w-8 h-8 ${colors.text} opacity-30 group-hover:opacity-100 transition-opacity`} />
                                    </div>

                                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                        {demo.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {demo.integrations.map((tech) => (
                                            <span
                                                key={tech}
                                                className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 border border-white/10"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 text-[10px] text-gray-600 group-hover:text-green-500 transition-colors">
                                        $ ./execute_{demo.id}.sh
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* How It Works */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border-2 border-green-500/30 p-6 sm:p-8 mb-12 bg-black/50"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-green-500">&gt;</span>
                        <h3 className="text-xl font-bold text-white">EXECUTION_FLOW</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { num: '01', title: 'EXTRACT', desc: 'Deposit SOL into pool' },
                            { num: '02', title: 'ENCRYPT', desc: 'Generate ZK commitment' },
                            { num: '03', title: 'ANONYMIZE', desc: 'Join anonymity set' },
                            { num: '04', title: 'COMMAND', desc: 'Spend with ZK proof' },
                        ].map((step) => (
                            <div key={step.num} className="border-l-2 border-green-500/50 pl-4">
                                <div className="text-[10px] text-green-500 mb-2">[{step.num}]</div>
                                <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                                <div className="text-xs text-gray-500">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="border-2 border-white/20 p-6 sm:p-8 bg-black/50"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="text-lg font-bold text-white mb-1">
                                <span className="text-green-500">&gt;</span> READY_TO_INTEGRATE?
                            </div>
                            <div className="text-xs text-gray-500">Read the SDK documentation</div>
                        </div>
                        <Link
                            href="/docs"
                            className="text-sm bg-green-500 text-black px-6 py-3 hover:bg-green-400 transition-colors font-bold"
                        >
                            $ cat /docs/README.md
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
