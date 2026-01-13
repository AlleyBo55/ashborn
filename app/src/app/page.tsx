'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Shield, Send, Eye, Unlock, Sparkles, ChevronRight } from 'lucide-react';
import { ShadowVault } from '@/components/ShadowVault';
import { ShieldFlow } from '@/components/ShieldFlow';
import { TransferFlow } from '@/components/TransferFlow';
import { ComplianceProof } from '@/components/ComplianceProof';

type Tab = 'vault' | 'shield' | 'transfer' | 'compliance';

export default function Home() {
    const { connected } = useWallet();
    const [activeTab, setActiveTab] = useState<Tab>('vault');

    const tabs = [
        { id: 'vault' as Tab, label: 'Shadow Vault', icon: Sparkles },
        { id: 'shield' as Tab, label: 'Shield', icon: Shield },
        { id: 'transfer' as Tab, label: 'Transfer', icon: Send },
        { id: 'compliance' as Tab, label: 'Compliance', icon: Eye },
    ];

    return (
        <div className="min-h-screen bg-void">
            {/* Header */}
            <header className="border-b border-shadow-900/30 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-shadow-500 to-shadow-700 flex items-center justify-center shadow-shadow-md"
                            animate={{ boxShadow: ['0 0 20px rgba(147, 51, 234, 0.4)', '0 0 40px rgba(147, 51, 234, 0.6)', '0 0 20px rgba(147, 51, 234, 0.4)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold glow-text">ASHBORN</h1>
                            <p className="text-xs text-shadow-400">The Shadow Monarch</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="/docs" className="text-shadow-300 hover:text-white text-sm transition">Docs</a>
                        <WalletMultiButton />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {!connected ? (
                    // Hero section for non-connected users
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h2
                            className="text-5xl md:text-7xl font-bold mb-6 glow-text-strong"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            I Alone Level Up
                        </motion.h2>

                        <motion.p
                            className="text-xl text-shadow-300 mb-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            The Shadow Monarch awakens. Build an undying army of private transactions.
                            Shield your assets. Transfer in shadows. Reveal only what you choose.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap justify-center gap-6 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <FeatureCard
                                icon={Shield}
                                title="Shield Assets"
                                description="Hide your wealth in the shadows"
                            />
                            <FeatureCard
                                icon={Send}
                                title="Shadow Transfer"
                                description="Unlinkable P2P payments"
                            />
                            <FeatureCard
                                icon={Eye}
                                title="Selective Reveal"
                                description="Compliance without compromise"
                            />
                            <FeatureCard
                                icon={Unlock}
                                title="Unshield"
                                description="Exit when ready"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="inline-block"
                        >
                            <WalletMultiButton className="shadow-btn !px-8 !py-4 !text-lg" />
                        </motion.div>

                        <motion.button
                            className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 font-medium transition flex items-center gap-2 mb-12 backdrop-blur-sm border border-white/5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded">NEW</span>
                            <span>x402 Integration for AI Agents</span>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                        </motion.button>

                        <motion.div
                            className="flex flex-wrap justify-center gap-6 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <FeatureCard
                                icon={Shield}
                                title="Shield Assets"
                                description="Hide your wealth in the shadows"
                            />
                            <FeatureCard
                                icon={Send}
                                title="Shadow Transfer"
                                description="Unlinkable P2P payments"
                            />
                            <FeatureCard
                                icon={Eye}
                                title="Selective Reveal"
                                description="Compliance without compromise"
                            />
                            <FeatureCard
                                icon={Unlock}
                                title="Unshield"
                                description="Exit when ready"
                            />
                        </motion.div>

                        {/* Comparison Section */}
                        <motion.div
                            className="max-w-4xl mx-auto mb-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <span className="text-purple-400">Ashborn</span>
                                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">Next Gen</span>
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                                            <div>
                                                <div className="text-white font-medium">Compliance Friendly</div>
                                                <div className="text-sm text-gray-400">Range proofs & view keys</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                                            <div>
                                                <div className="text-white font-medium">Instant & Cheap</div>
                                                <div className="text-sm text-gray-400">~400ms finality, &lt;$0.001 fees</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                                            <div>
                                                <div className="text-white font-medium">AI Native</div>
                                                <div className="text-sm text-gray-400">x402 payments & Eliza plugin</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                                            <div>
                                                <div className="text-white font-medium">Advanced Privacy</div>
                                                <div className="text-sm text-gray-400">Stealth addresses & decoy outputs</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="glass-card p-8 rounded-2xl border-white/5 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                                    <h3 className="text-2xl font-bold mb-6 text-gray-400">Legacy Mixers</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</div>
                                            <div>
                                                <div className="text-gray-300 font-medium">Zero Compliance</div>
                                                <div className="text-sm text-gray-500">Illicit activity risk</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</div>
                                            <div>
                                                <div className="text-gray-300 font-medium">Slow & Expensive</div>
                                                <div className="text-sm text-gray-500">10+ mins, $10-50+ fees</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</div>
                                            <div>
                                                <div className="text-gray-300 font-medium">No AI Support</div>
                                                <div className="text-sm text-gray-500">Manual interaction only</div>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</div>
                                            <div>
                                                <div className="text-gray-300 font-medium">Limited Privacy</div>
                                                <div className="text-sm text-gray-500">Fixed pools only</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    // Main app interface
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Tab navigation */}
                        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-shadow-600 to-shadow-700 text-white shadow-shadow-md'
                                        : 'bg-void-light text-shadow-300 hover:bg-shadow-900/50 hover:text-white'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'vault' && <ShadowVault />}
                            {activeTab === 'shield' && <ShieldFlow />}
                            {activeTab === 'transfer' && <TransferFlow />}
                            {activeTab === 'compliance' && <ComplianceProof />}
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-shadow-900/30 mt-20 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-shadow-500 text-sm">
                        Built for Solana Privacy Hack 2026 |
                        <span className="text-shadow-400 ml-2">Powered by ShadowWire + Privacy Cash + Range Compliance</span>
                    </p>
                    <p className="text-shadow-600 text-xs mt-2">
                        &quot;The shadows will consume all.&quot; — Shadow Monarch
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            className="glass-card p-6 w-48 text-center group cursor-pointer"
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center mx-auto mb-4 group-hover:shadow-shadow-lg transition-shadow">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-shadow-400 text-sm">{description}</p>
        </motion.div>
    );
}
