'use client';

import { motion } from 'framer-motion';
import { Cube01Icon, Lock01Icon, UserGroup01Icon, SentIcon, ViewIcon, ArrowRight01Icon, FlashIcon, Shield02Icon } from 'hugeicons-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// HOW ASHBORN WORKS - HERO SECTION COMPONENT
// Shadow Monarch Protocol Explanation
// ═══════════════════════════════════════════════════════════════════════════════

const steps = [
    {
        num: '01',
        icon: Cube01Icon,
        title: 'Extract',
        subtitle: 'SHIELD_PROTOCOL',
        desc: 'Deposit SOL into the Shadow Pool. Your public balance becomes a hidden ZK commitment.',
        formula: 'C = Poseidon(amt, blind)',
        color: 'from-blue-600 to-cyan-600',
        textColor: 'text-blue-400',
    },
    {
        num: '02',
        icon: Lock01Icon,
        title: 'Encrypt',
        subtitle: 'ZK_COMMITMENT',
        desc: 'Generate cryptographic proof. Only you possess the private key to spend.',
        formula: 'Note = Encrypt(C, viewKey)',
        color: 'from-purple-600 to-violet-600',
        textColor: 'text-purple-400',
    },
    {
        num: '03',
        icon: UserGroup01Icon,
        title: 'Anonymize',
        subtitle: 'ANONYMITY_SET',
        desc: 'Join the global anonymity pool. Your deposit is indistinguishable from millions.',
        formula: 'MerkleTree.insert(C)',
        color: 'from-green-600 to-emerald-600',
        textColor: 'text-green-400',
    },
    {
        num: '04',
        icon: SentIcon,
        title: 'Command',
        subtitle: 'SHADOW_STRIKE',
        desc: 'Spend or transfer with ZK proof. Recipient gets fresh note, no links to you.',
        formula: 'Prove(C ∈ Tree, nullifier)',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-400',
    },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative group"
    >
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-500 h-full">
            {/* Step Number */}
            <div className="text-[10px] font-mono text-gray-700 mb-4 tracking-[0.3em]">{step.num}</div>

            {/* Icon with Gradient Border */}
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <div className="w-full h-full rounded-xl bg-[#0A0A0A] flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Subtitle */}
            <div className={`text-[9px] font-mono ${step.textColor} tracking-[0.2em] mb-2`}>{step.subtitle}</div>

            {/* Title */}
            <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.desc}</p>

            {/* Formula */}
            <div className="text-[10px] font-mono text-gray-600 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                <code>{step.formula}</code>
            </div>
        </div>

        {/* Connector Arrow (hidden on last item and mobile) */}
        {index < 3 && (
            <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight01Icon className="w-5 h-5 text-gray-800" />
            </div>
        )}
    </motion.div>
);

export default function HowAshbornWorks() {
    return (
        <section className="relative w-full max-w-7xl mx-auto py-24 px-6 md:px-12 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16 relative z-10"
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full text-xs font-mono mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <ViewIcon className="w-3 h-3" />
                    THE_SHADOW_PROTOCOL
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Ashborn</span> Works
                </h2>

                {/* Subtitle */}
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    Your assets enter the Shadow Domain through zero-knowledge cryptography.
                    No one can trace, link, or identify your transactions – not even us.
                </p>
            </motion.div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10 mb-12">
                {steps.map((step, i) => (
                    <StepCard key={i} step={step} index={i} />
                ))}
            </div>

            {/* Bottom Stats & CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="relative z-10"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-900/20 via-black to-purple-900/20 border border-purple-500/20 rounded-2xl p-6">
                    {/* Stats */}
                    <div className="flex items-center gap-8">
                        {[
                            { label: 'Proof System', value: 'Groth16' },
                            { label: 'Hash Function', value: 'Poseidon' },
                            { label: 'Curve', value: 'BN128' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center md:text-left">
                                <div className="text-sm font-mono font-bold text-white">{stat.value}</div>
                                <div className="text-[10px] text-gray-600 font-mono">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        href="/demo"
                        className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        <FlashIcon className="w-4 h-4" />
                        Try Live Demo
                        <ArrowRight01Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
