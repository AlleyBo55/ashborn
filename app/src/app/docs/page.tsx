'use client';

import CodeBlock from '@/components/ui/CodeBlock';
import TerminalBlock from '@/components/ui/TerminalBlock';
// import { Highlight, themes } from 'prism-react-renderer'; // Handled in CodeBlock now
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import ViewOffIcon from 'hugeicons-react/dist/esm/icons/view_off_icon';
import Activity01Icon from 'hugeicons-react/dist/esm/icons/activity_01_icon';
import BookOpen01Icon from 'hugeicons-react/dist/esm/icons/book_open_01_icon';
import ConsoleIcon from 'hugeicons-react/dist/esm/icons/console_icon';
import CodeIcon from 'hugeicons-react/dist/esm/icons/code_icon';
import CpuIcon from 'hugeicons-react/dist/esm/icons/cpu_icon';
import LockIcon from 'hugeicons-react/dist/esm/icons/lock_icon';
import FlashIcon from 'hugeicons-react/dist/esm/icons/flash_icon';
import Search01Icon from 'hugeicons-react/dist/esm/icons/search_01_icon';
import Menu01Icon from 'hugeicons-react/dist/esm/icons/menu_01_icon';
import Cancel01Icon from 'hugeicons-react/dist/esm/icons/cancel_01_icon';
import AiChat02Icon from 'hugeicons-react/dist/esm/icons/ai_chat_02_icon';
import SparklesIcon from 'hugeicons-react/dist/esm/icons/sparkles_icon';
import Link from 'next/link';

const sections = [
    {
        title: "Getting Started", items: [
            { id: 'overview', title: 'Overview', icon: BookOpen01Icon },
            { id: 'quick-start', title: 'Quick Start', icon: FlashIcon },
            { id: 'installation', title: 'Installation', icon: ConsoleIcon },
        ]
    },
    {
        title: "Core Concepts", items: [
            { id: 'how-it-works', title: 'Architecture', icon: CpuIcon },
            { id: 'features', title: 'Privacy Features', icon: Shield02Icon },
            { id: 'privacy-relay', title: 'Privacy Relay', icon: LockIcon },
            { id: 'security', title: 'Security', icon: LockIcon },
        ]
    },
    {
        title: "Protocol Integrations", items: [
            { id: 'integrations', title: 'Overview', icon: Activity01Icon },
            { id: 'privacycash', title: 'PrivacyCash', icon: Shield02Icon },
            { id: 'radr-labs', title: 'Radr Labs', icon: ViewOffIcon },
            { id: 'light-protocol', title: 'Light Protocol', icon: LockIcon },
            { id: 'x402-micropay', title: 'x402 Micropay', icon: AiChat02Icon },
            { id: 'zk-groth16', title: 'ZK Groth16', icon: FlashIcon },
        ]
    },
    {
        title: "SDK Reference", items: [
            { id: 'sdk-core', title: 'Core SDK', icon: CodeIcon },
            { id: 'shadow-agent', title: 'Shadow Agent Protocol', icon: SparklesIcon },
            { id: 'stealth', title: 'Stealth Addresses', icon: ViewOffIcon },
            { id: 'nlp', title: 'Natural Language', icon: Activity01Icon },
        ]
    },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            const allItems = sections.flatMap(s => s.items);
            for (const item of allItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(item.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // Fixed header offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-purple-500/30 selection:text-purple-100">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-200">
                            <span className="text-sm font-bold text-white">A</span>
                        </div>
                        <span className="font-semibold text-sm tracking-tight text-white/90 group-hover:text-white transition-colors">Ashborn Docs</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-mono border border-green-500/20 bg-green-500/5 px-2 py-0.5 rounded-full text-green-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        DEVNET CONNECTED
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/" className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/demo" className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                        Demos
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                        {isMenuOpen ? <Cancel01Icon className="w-5 h-5" /> : <Menu01Icon className="w-5 h-5" />}
                    </button>
                    <a href="https://github.com/AlleyBo55/ashborn" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                        <CodeIcon className="w-4 h-4" />
                        GitHub
                    </a>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-[#0A0A0A] pt-20 px-6 pb-8 overflow-y-auto lg:hidden"
                    >
                        <nav className="space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">{section.title}</h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollTo(item.id)}
                                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3 ${activeSection === item.id ? 'bg-purple-500/10 text-purple-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-purple-400' : 'text-gray-600'}`} />
                                                {item.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-24 max-w-[1440px] mx-auto flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block fixed top-24 left-0 bottom-0 w-72 overflow-y-auto border-r border-white/5 pl-8 pr-6 pb-12 custom-scrollbar">
                    <nav className="space-y-8">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">{section.title}</h3>
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollTo(item.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center gap-2.5 group relative ${activeSection === item.id ? 'text-white font-medium bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <item.icon className={`w-4 h-4 transition-colors ${activeSection === item.id ? 'text-purple-400' : 'text-gray-600 group-hover:text-gray-500'}`} />
                                            {item.title}
                                            {activeSection === item.id && (
                                                <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-4 bg-purple-500 rounded-r-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-6 lg:px-12 lg:ml-72 pb-24 max-w-5xl mx-auto w-full relative z-10">

                    {/* Heroes and Introductions */}
                    <div id="overview" className="scroll-mt-32 mb-20 fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono mb-8">
                            <span>DOCS V0.2.3</span>
                            <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                            <span>BETA</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-white">
                            Ashborn
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mb-12 font-light">
                            The Shadow Monarch. Ashborn shadows your intent, enveloping assets and executing private transfers. The underlying world never sees your identity.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 not-prose mb-16">
                            <Link href="/demo" className="group p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 to-transparent border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.02]">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <FlashIcon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white text-lg">Live Demo</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed pl-[52px]">Experience instant private transfers on devnet.</p>
                            </Link>
                            <button onClick={() => scrollTo('quick-start')} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.04] text-left">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-2.5 rounded-xl bg-gray-800 text-gray-300 group-hover:bg-gray-700 group-hover:text-white transition-colors">
                                        <ConsoleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white text-lg">Quick Start</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed pl-[52px]">Integrate the TypeScript SDK in under 5 minutes.</p>
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Quick Start" description="Initialize the SDK and shield your first asset to enter the privacy pool." />

                        <div className="space-y-12 pl-4 border-l border-white/5">
                            <Step number="01" title="Initialize Client">
                                <p className="text-gray-400 mb-4 text-sm">Create an Ashborn instance with your connection and wallet adapter.</p>
                                <CodeBlock
                                    language="typescript"
                                    code={`import { Ashborn } from '@alleyboss/ashborn-sdk';\n\nconst ashborn = new Ashborn(connection, wallet, {\n  network: 'devnet'\n});`}
                                    filename="client.ts"
                                />
                            </Step>
                            <Step number="02" title="Shield Assets">
                                <p className="text-gray-400 mb-4 text-sm">Deposit SOL or SPL tokens into the shielded pool.</p>
                                <CodeBlock
                                    language="typescript"
                                    code={`const tx = await ashborn.shield({\n  amount: 1_000_000_000n, // 1 SOL\n  mint: SOL_MINT\n});\n\nconsole.log("Shielded:", tx.signature);`}
                                    filename="shield.ts"
                                />
                            </Step>
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Installation" description="Add the SDK to your existing Solana project." />
                        <TerminalBlock
                            command="npm install @alleyboss/ashborn-sdk"
                            cwd="~/project"
                        />
                        <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                            <Activity01Icon className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div className="text-sm text-amber-200/80 leading-relaxed">
                                <strong className="text-amber-400 block mb-1">Devnet Only</strong>
                                The current release (v0.2.3) is deployed to Solana Devnet. Mainnet deployment is scheduled for Q3 2026.
                            </div>
                        </div>

                        {/* Deployed Programs */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Deployed Programs (Devnet)</h3>

                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield02Icon className="w-4 h-4 text-purple-400" />
                                    <h4 className="font-semibold text-white text-sm">Ashborn Program</h4>
                                </div>
                                <code className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded block mb-2">
                                    BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe
                                </code>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Core Ashborn for privacy operations, ZK proofs, and stealth address management.
                                </p>
                                <a
                                    href="https://explorer.solana.com/address/BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe?cluster=devnet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1"
                                >
                                    View on Explorer →
                                </a>
                            </div>

                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <LockIcon className="w-4 h-4 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">PrivacyCash Program</h4>
                                </div>
                                <code className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded block mb-2">
                                    ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS
                                </code>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Third-party privacy protocol for shielding/unshielding SOL. Integrated into Ashborn SDK for unified access.
                                </p>
                                <a
                                    href="https://explorer.solana.com/address/ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS?cluster=devnet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-flex items-center gap-1"
                                >
                                    View on Explorer →
                                </a>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

                    {/* Architecture */}
                    <section id="how-it-works" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Architecture" description="How Ashborn achieves privacy on a public ledger." />

                        {/* Visual Flow Diagram */}
                        <div className="mb-8 p-8 rounded-xl bg-[#0A0A0A] border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-6 text-center">Transaction Flow Visualization</h3>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                                {/* User */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-white/20 flex items-center justify-center mb-2">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">Your App</span>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center">
                                    <ArrowRight01Icon className="w-6 h-6 text-purple-400 rotate-90 md:rotate-0" />
                                </div>

                                {/* SDK */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-400/50 flex items-center justify-center mb-2 shadow-lg shadow-purple-900/50">
                                        <CodeIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs text-purple-300 font-mono font-bold">Ashborn SDK</span>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center">
                                    <ArrowRight01Icon className="w-6 h-6 text-blue-400 rotate-90 md:rotate-0" />
                                </div>

                                {/* PrivacyCash */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-400/50 flex items-center justify-center mb-2 shadow-lg shadow-blue-900/50">
                                        <LockIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs text-blue-300 font-mono font-bold">PrivacyCash</span>
                                    <span className="text-[9px] text-gray-500 font-mono mt-1">ATZj4jZ4...</span>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center">
                                    <ArrowRight01Icon className="w-6 h-6 text-amber-400 rotate-90 md:rotate-0" />
                                </div>

                                {/* Ashborn Program */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 border border-amber-400/50 flex items-center justify-center mb-2 shadow-lg shadow-amber-900/50">
                                        <Shield02Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs text-amber-300 font-mono font-bold">Ashborn</span>
                                    <span className="text-[9px] text-gray-500 font-mono mt-1">BzBUgtEFi...</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div className="flex items-start gap-2">
                                    <div className="w-3 h-3 rounded bg-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-semibold mb-1">PrivacyCash Layer</div>
                                        <div className="text-gray-500">Handles shielding, commitments, and Merkle trees</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-3 h-3 rounded bg-amber-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-semibold mb-1">Ashborn Layer</div>
                                        <div className="text-gray-500">Adds stealth addresses and ZK proofs</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-3 h-3 rounded bg-purple-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-semibold mb-1">SDK Orchestration</div>
                                        <div className="text-gray-500">Unified API for both programs</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Program Flow Diagram */}
                        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-purple-500/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity01Icon className="w-5 h-5 text-purple-400" />
                                Complete Transaction Flow
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">User calls Ashborn SDK</div>
                                        <code className="text-xs bg-black/30 px-2 py-1 rounded text-purple-300">ashborn.shield()</code>
                                        <p className="text-gray-400 mt-1">Your application uses the unified Ashborn SDK interface</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-300 text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">Ashborn SDK routes to PrivacyCash</div>
                                        <code className="text-xs bg-black/30 px-2 py-1 rounded text-blue-300">ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS</code>
                                        <p className="text-gray-400 mt-1">SDK internally calls PrivacyCash program for shielding operations</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-300 text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">PrivacyCash creates commitment</div>
                                        <p className="text-gray-400 mt-1">Generates Poseidon hash commitment and stores encrypted note on-chain</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">Ashborn adds stealth layer</div>
                                        <code className="text-xs bg-black/30 px-2 py-1 rounded text-amber-300">BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe</code>
                                        <p className="text-gray-400 mt-1">Ashborn program generates stealth addresses using Radr/ShadowWire cryptography</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 text-xs font-bold flex-shrink-0 mt-0.5">5</div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">Return to user</div>
                                        <p className="text-gray-400 mt-1">SDK returns transaction signature and encrypted note to your application</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Program Responsibilities */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield02Icon className="w-5 h-5 text-purple-400" />
                                    <h3 className="font-semibold text-white">Ashborn Program</h3>
                                </div>
                                <code className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded block mb-3 break-all">
                                    BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe
                                </code>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <span>Stealth address generation (ECDH)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <span>Ring signature verification</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <span>ZK range proofs for compliance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <span>Privacy relay coordination</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <span>NLP intent parsing</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-6 rounded-xl bg-white/[0.02] border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <LockIcon className="w-5 h-5 text-blue-400" />
                                    <h3 className="font-semibold text-white">PrivacyCash Program</h3>
                                </div>
                                <code className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded block mb-3 break-all">
                                    ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS
                                </code>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>SOL/SPL token shielding</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>Poseidon hash commitments</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>Merkle tree management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>Nullifier tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>Groth16 proof verification</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* SDK Integration */}
                        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 mb-8">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <CodeIcon className="w-5 h-5 text-gray-400" />
                                SDK Integration Layer
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                The Ashborn SDK provides a unified interface that orchestrates both programs:
                            </p>
                            <CodeBlock
                                language="typescript"
                                code={`// Single SDK call handles both programs
import { Ashborn } from '@alleyboss/ashborn-sdk';

const ashborn = new Ashborn(connection, wallet);

// Internally:
// 1. Calls PrivacyCash (ATZj4jZ4...) for shielding
// 2. Calls Ashborn (BzBUgtEFiJj...) for stealth addressing
// 3. Returns unified result
const result = await ashborn.shield({ amount: 1_000_000n });

// You never need to interact with programs directly
// SDK handles all cross-program communication`}
                                filename="unified-sdk.ts"
                            />
                        </div>

                        {/* Demo Usage */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-900/10 to-transparent border border-green-500/20">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <FlashIcon className="w-5 h-5 text-green-400" />
                                In Our Demos
                            </h3>
                            <div className="space-y-3 text-sm text-gray-400">
                                <div>
                                    <span className="text-blue-300 font-semibold">Shield Demo:</span> Uses PrivacyCash program via SDK to deposit SOL into privacy pool
                                </div>
                                <div>
                                    <span className="text-purple-300 font-semibold">Radr Demo:</span> Uses Ashborn program to generate stealth addresses with ShadowWire
                                </div>
                                <div>
                                    <span className="text-green-300 font-semibold">Transfer Demo:</span> Uses both programs - Ashborn for stealth + PrivacyCash for shielded transfer
                                </div>
                                <div>
                                    <span className="text-cyan-300 font-semibold">Interop Demo:</span> Full flow using both programs in sequence
                                </div>
                                <div>
                                    <span className="text-amber-300 font-semibold">Prove Demo:</span> Uses Ashborn program for ZK range proofs
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-8">
                            <FeatureCard
                                icon={Shield02Icon}
                                title="Zero-Knowledge Proofs"
                                desc="Uses Groth16 proofs to validate transactions without revealing amounts or senders on-chain."
                            />
                            <FeatureCard
                                icon={ViewOffIcon}
                                title="Stealth Addresses"
                                desc="Generates unique, one-time addresses for every transfer, decoupling the recipient's identity."
                            />
                            <FeatureCard
                                icon={LockIcon}
                                title="UTXO Model"
                                desc="Manages assets as Unspent Transaction Outputs, similar to Bitcoin but with encrypted values."
                            />
                            <FeatureCard
                                icon={Activity01Icon}
                                title="Privacy Relay"
                                desc="Relayers submit proofs on behalf of users, paying gas fees to break the link between wallet and transaction."
                            />
                        </div>
                    </section>

                    {/* Privacy Features */}
                    <section id="features" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Privacy Features" description="Core privacy mechanisms that protect your identity." />
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                    <Shield02Icon className="w-5 h-5 text-purple-400" />
                                    K-Anonymity Amplification
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    By routing through the Shadow Monarch relay, your transactions are mixed with thousands of other users across multiple privacy protocols, exponentially increasing your anonymity set.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                    <ViewOffIcon className="w-5 h-5 text-purple-400" />
                                    Metadata Stripping
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    All IP addresses, wallet signatures, and timing information are stripped before transactions reach privacy protocols, ensuring no correlation attacks.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Privacy Relay */}
                    <section id="privacy-relay" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Privacy Relay" description="The Shadow Monarch's core infrastructure." />
                        <CodeBlock
                            language="typescript"
                            code={`import { PrivacyRelay } from '@alleyboss/ashborn-sdk';\n\nconst relay = new PrivacyRelay({\n  relayKeypair: serverKeypair,\n  rpcUrl: 'https://api.devnet.solana.com'\n});\n\n// Shield via relay\nawait relay.shield({ amount: 0.1 });\n\n// Generate stealth address via relay\nawait relay.generateStealth({ viewPubKey, spendPubKey });`}
                            filename="relay.ts"
                        />
                        <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                            <Activity01Icon className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div className="text-sm text-blue-200/80 leading-relaxed">
                                <strong className="text-blue-400 block mb-1">Server-Side Only</strong>
                                Privacy Relay should only be used in server environments to protect the relay keypair.
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section id="security" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Security" description="Audits, best practices, and threat model." />
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <h3 className="font-semibold text-white mb-3">Threat Model</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                    Ashborn protects against network observers, protocol operators, and chain analysts. It does not protect against compromised client devices or malicious relayers with your private keys.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <h3 className="font-semibold text-white mb-3">Best Practices</h3>
                                <ul className="text-sm text-gray-400 leading-relaxed space-y-2 list-disc list-inside">
                                    <li>Always use HTTPS endpoints for RPC connections</li>
                                    <li>Run your own relay for maximum privacy</li>
                                    <li>Never reuse stealth addresses</li>
                                    <li>Use Tor or VPN when interacting with public relays</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Protocol Integrations */}
                    <section id="integrations" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Protocol Integrations" description="Ashborn unifies the Solana privacy ecosystem into a single Shadow Monarch identity." />

                        <div className="mb-12 p-8 rounded-xl bg-[#0A0A0A] border border-white/10 font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar shadow-2xl shadow-black">
                            <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-white/5 pb-2">
                                <Activity01Icon className="w-4 h-4" />
                                <span>RELAY_ARCHITECTURE_V1.ASCII</span>
                            </div>
                            <pre className="text-purple-300 font-bold">
                                {`          ┌─────────────────┐
          │      USER       │
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  ASHBORN RELAY  │◀─── [Light Protocol]
          │ (Identity Layer)│     (Compression/ZK)
          └────────┬────────┘
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐   ┌────▼────┐   ┌────▼────┐
│ Privacy │   │ Radr    │   │ x402    │
│ Cash    │   │ Labs    │   │ Micropay│
└─────────┘   └─────────┘   └─────────┘
   (Pool)      (Stealth)      (Pay)`}
                            </pre>
                        </div>
                    </section>

                    <section id="privacycash" className="mb-24 scroll-mt-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                <Shield02Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">PrivacyCash</h3>
                                <p className="text-blue-400 font-mono text-sm">The Anonymity Pool</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            PrivacyCash provides the fundamental <strong>Shielded Pool</strong> technology. Ashborn integrates directly with the PrivacyCash program to handle the actual deposit and withdrawal of assets, ensuring your funds are mixed with others.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4 mb-6">
                            <li className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <strong className="text-white block mb-1">Role</strong>
                                <span className="text-gray-400 text-sm">Asset custody and mixing.</span>
                            </li>
                            <li className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <strong className="text-white block mb-1">Integration</strong>
                                <span className="text-gray-400 text-sm">SDK calls <code>privacyCash.shieldSOL()</code> inside the Relay.</span>
                            </li>
                        </ul>
                    </section>

                    <section id="radr-labs" className="mb-24 scroll-mt-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                <ViewOffIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Radr Labs</h3>
                                <p className="text-purple-400 font-mono text-sm">Stealth Addressing</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Radr Labs provides the <strong>ShadowWire</strong> cryptographic primitives known as ECDH (Elliptic Curve Diffie-Hellman). Ashborn uses this to generate one-time stealth addresses that only the recipient can unlock.
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`// Ashborn uses Radr's ShadowWire under the hood
const { stealthAddress } = await ashborn.generateStealthAddress({
    recipientMeta: metaAddress
});`}
                            filename="radr-integration.ts"
                        />
                    </section>

                    <section id="light-protocol" className="mb-24 scroll-mt-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <LockIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Light Protocol</h3>
                                <p className="text-amber-400 font-mono text-sm">State Compression & ZK</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Ashborn leverages Light Protocol's infrastructure for <strong>ZK State Compression</strong>. This allows us to store massive Merkle trees on Solana at a fraction of the cost, enabling scalable privacy for millions of users.
                        </p>
                    </section>

                    <section id="x402-micropay" className="mb-24 scroll-mt-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                                <AiChat02Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">x402 Micropay</h3>
                                <p className="text-red-400 font-mono text-sm">Private AI Payments</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            The <strong>Shadow Agent</strong> protocol integrates x402 Micropay to enable AI agents to pay for resources (compute, data) privately. The payment flow is wrapped in an Ashborn shield, hiding the agent's treasury wallet.
                        </p>
                    </section>

                    <section id="zk-groth16" className="mb-24 scroll-mt-32">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                                <FlashIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">ZK Groth16</h3>
                                <p className="text-green-400 font-mono text-sm">Compliance Proofs</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            We use real <strong>Groth16 Zero-Knowledge Proofs</strong> (via <code>snarkjs</code> and <code>circom</code>) to prove validity. For example, proving a user is not in a blacklist or has sufficient funds, without revealing the user's identity or balance.
                        </p>
                        <div className="p-4 rounded-lg bg-green-900/10 border border-green-500/20 text-xs font-mono text-green-300">
                            $ Using curve: bn128<br />
                            $ Proving system: groth16<br />
                            $ Circuits: range_proof.circom
                        </div>
                    </section>

                    {/* Core SDK */}
                    <section id="sdk-core" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Core SDK" description="Primary methods for interacting with the Ashborn program." />
                        <CodeBlock
                            language="typescript"
                            code={`// Shield Assets
await ashborn.shield({ amount: 1_000_000n });

// Private Transfer
await ashborn.transfer({ 
    to: stealthAddress, 
    amount: 1_000_000n 
});

// Generate Proof
const proof = await ashborn.proveRange({ max: 1000n });`}
                            filename="sdk-usage.ts"
                        />
                    </section>

                    {/* Shadow Agent Protocol */}
                    <section id="shadow-agent" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Shadow Agent Protocol" description="AI-to-AI private commerce via the Shadow Monarch." />
                        <CodeBlock
                            language="typescript"
                            code={`import { ShadowAgent } from '@alleyboss/ashborn-sdk';\n\nconst agent = new ShadowAgent({\n  connection,\n  wallet,\n  personality: 'merchant'\n});\n\n// AI negotiates and executes private payment\nconst result = await agent.negotiate({\n  intent: 'Buy 100 USDC worth of compute',\n  maxPrice: 100_000_000n\n});`}
                            filename="shadow-agent.ts"
                        />
                        <div className="mt-6 p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-start gap-3">
                            <AiChat02Icon className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div className="text-sm text-purple-200/80 leading-relaxed">
                                <strong className="text-purple-400 block mb-1">Experimental</strong>
                                Shadow Agent Protocol is in alpha. Use with caution in production.
                            </div>
                        </div>
                    </section>

                    {/* Stealth Addresses */}
                    <section id="stealth" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Stealth Addresses" description="One-time addresses for unlinkable transfers." />
                        <CodeBlock
                            language="typescript"
                            code={`// Generate stealth meta-address (share publicly)\nconst meta = await ashborn.generateStealthMeta();\n\n// Sender: Generate one-time address\nconst { stealthAddress, ephemeralPubkey } = \n  await ashborn.generateStealthAddress(meta);\n\n// Send to stealth address\nawait ashborn.transfer({ \n  to: stealthAddress, \n  amount: 1_000_000n \n});\n\n// Receiver: Scan for incoming transfers\nconst received = await ashborn.scanStealth(meta.viewKey);`}
                            filename="stealth.ts"
                        />
                    </section>

                    {/* NLP Section */}
                    <section id="nlp" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Natural Language" description="Control Ashborn using plain English via the NLP module." />
                        <CodeBlock
                            language="typescript"
                            code={`const result = await ashborn.nlp.process("Send 5 SOL to @alice privately");\n\nif (result.intent === 'TRANSFER') {\n    await ashborn.execute(result.transaction);\n}`}
                            filename="nlp-example.ts"
                        />
                    </section>

                    {/* Eliza Section - HIDDEN */}
                    {/*
                    <section id="eliza" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Eliza Plugin" description="Drop-in integration for the Eliza agent framework." />
                        // ...
                    </section>
                    */}

                    {/* Tutorials - HIDDEN */}
                    {/*
                    <section id="tutorials" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Tutorials" description="Step-by-step guides for common use cases." />
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Building a Private Payment App</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                    Learn how to integrate Ashborn into a Next.js application for private peer-to-peer payments.
                                </p>
                                <span className="text-xs text-purple-400 font-mono">15 min read →</span>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">AI Agent Integration</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                    Connect your AI agent to Ashborn for autonomous private transactions.
                                </p>
                                <span className="text-xs text-purple-400 font-mono">20 min read →</span>
                            </div>
                        </div>
                    </section>
                    */}

                    {/* Deployment - HIDDEN */}
                    {/*
                    <section id="deployment" className="mb-24 scroll-mt-32">
                        <SectionHeader title="Deployment" description="Deploying the Ashborn Privacy Relay." />
                        <div className="prose prose-invert prose-sm max-w-none text-gray-400">
                            <p>
                                Self-hosting a privacy relay allows you to service your own application&apos;s users without relying on the public relay network.
                            </p>
                            <TerminalBlock
                                command="docker run -d -p 8080:8080 alleyboss/ashborn-relay:latest"
                                cwd="~/server"
                            />
                        </div>
                    </section>
                    */}

                    <footer className="mt-32 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
                        <p>&copy; 2026 Ashborn. All rights reserved.</p>
                    </footer>

                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                html {
                   scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
            <Icon className="w-6 h-6 text-gray-500 mb-4 group-hover:text-purple-400 transition-colors" />
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ number, title, children }: any) {
    return (
        <div className="relative pl-8 pt-1">
            <span className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/10 text-[10px] flex items-center justify-center text-gray-500 font-mono font-bold z-10 shadow-[0_0_0_4px_#0A0A0A]">{number}</span>
            <h3 className="font-medium text-white mb-3 text-sm tracking-wide uppercase text-gray-300">{title}</h3>
            {children}
        </div>
    );
}
