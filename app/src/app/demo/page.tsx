'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Send, Shield, MessageSquare, ArrowRight, Zap, Ghost, EyeOff, Bot } from 'lucide-react';

const demos = [
    {
        id: 'shield',
        title: 'Shadow Extraction',
        desc: "Convert public SOL into invisible 'Shadow Notes'. Your public transaction history ends here.",
        href: '/demo/shield',
        icon: Box,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'transfer',
        title: 'Private Transfer',
        desc: 'Send assets silently. The recipient receives a fresh, untraceable note. No links back to you.',
        href: '/demo/transfer',
        icon: Send,
        color: 'text-green-400',
        bg: 'bg-green-500/10'
    },
    {
        id: 'prove',
        title: 'Compliance Proofs',
        desc: "Prove you are solvent (e.g., 'I have > 10 SOL') without revealing your actual net worth.",
        href: '/demo/prove',
        icon: Shield,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
    {
        id: 'nlp',
        title: 'Ashborn AI Agent',
        desc: "Command the protocol with natural language. 'Extract 5 SOL and send to Alice'.",
        href: '/demo/nlp',
        icon: Bot,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    }
];

export default function DemoIndexPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-1.5 rounded-full text-xs font-mono mb-6 border border-purple-500/20">
                    <Zap className="w-3 h-3" />
                    LIVE INTERACTIVE DEMOS
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">True Privacy</span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                    Explore the core capabilities of the Ashborn Protocol on Solana Devnet.
                    Connect your wallet to interact with zero-knowledge circuits.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {demos.map((demo, idx) => (
                    <motion.div
                        key={demo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={demo.href} className="block group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-purple-500/30 rounded-2xl p-8 transition-all duration-300 h-full overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${demo.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <demo.icon className={`w-6 h-6 ${demo.color}`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    {demo.title}
                                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </h3>

                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {demo.desc}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-sm text-gray-500 mb-4">Looking for documentation?</p>
                <Link href="/docs" className="text-sm text-white hover:text-purple-400 transition underline underline-offset-4">
                    Read the Developer Guide
                </Link>
            </div>
        </div>
    );
}
