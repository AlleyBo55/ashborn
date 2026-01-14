'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Ghost, Activity, Book, Terminal, Code, Cpu, Lock, Zap, Search, Menu, X, ChevronRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';

// Navigation Data
const sections = [
    {
        title: "Getting Started", items: [
            { id: 'overview', title: 'Overview', icon: Book },
            { id: 'quick-start', title: 'Quick Start', icon: Zap },
            { id: 'installation', title: 'Installation', icon: Terminal },
        ]
    },
    {
        title: "Core Concepts", items: [
            { id: 'how-it-works', title: 'Architecture', icon: Cpu },
            { id: 'features', title: 'Privacy Features', icon: Shield },
            { id: 'security', title: 'Security', icon: Lock },
        ]
    },
    {
        title: "SDK Reference", items: [
            { id: 'sdk-core', title: 'Core SDK', icon: Code },
            { id: 'nlp', title: 'Natural Language', icon: Activity },
            { id: 'eliza', title: 'Eliza Plugin', icon: Ghost },
        ]
    },
    {
        title: "guides", items: [
            { id: 'tutorials', title: 'Tutorials', icon: Book },
            { id: 'deployment', title: 'Deployment', icon: Activity },
        ]
    }
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
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-purple-500/30 selection:text-purple-200">
            {/* Background Grid (Vercel Style) */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
            />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-purple-900/10 blur-[100px] pointer-events-none z-0" />

            {/* Header (Apple Style Glass) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-14 flex items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center group-hover:bg-purple-500 transition-colors shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                            <span className="text-xs font-bold text-white">A</span>
                        </div>
                        <span className="font-medium text-sm tracking-tight text-white/90">Ashborn Docs</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-mono border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded-full text-purple-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        DEVNET LIVE
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-gray-300 transition" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-gray-300 placeholder:text-gray-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 border border-white/10 px-1 rounded bg-white/5">⌘K</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <a href="https://github.com/AlleyBo55/ashborn" className="hidden lg:block text-xs font-medium text-gray-400 hover:text-white transition">GitHub</a>
                </div>
            </header>

            <div className="pt-24 max-w-[1400px] mx-auto flex">
                {/* Sidebar (Google Style - Sticky & Clean) */}
                <aside className={`fixed lg:sticky top-24 left-0 bottom-0 w-64 lg:w-64 bg-[#050505] lg:bg-transparent border-r lg:border-r-0 border-white/5 z-40 transform lg:transform-none transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto h-[calc(100vh-6rem)] pl-6 pr-4 pb-12`}>
                    <nav className="space-y-8">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">{section.title}</h3>
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollTo(item.id)}
                                            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-all flex items-center gap-2.5 group relative ${activeSection === item.id ? 'text-purple-300 bg-purple-500/10 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <item.icon className={`w-3.5 h-3.5 ${activeSection === item.id ? 'text-purple-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                            {item.title}
                                            {activeSection === item.id && <motion.div layoutId="active-indicator" className="absolute left-0 w-0.5 h-4 bg-purple-500 rounded-r-full" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content (Prose Invert - Readable) */}
                <main className="flex-1 px-6 lg:px-12 pb-24 max-w-4xl mx-auto w-full relative z-10">
                    {/* Hero Section */}
                    <section id="overview" className="mb-20 pt-2">
                        <div className="mb-6 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] uppercase tracking-wider font-semibold">Docs v0.2.2</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                            Ashborn Protocol
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mb-8">
                            The compliant privacy layer for Solana. Shield assets, execute private transfers, and prove compliance using Zero-Knowledge Proofs (Groth16).
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 not-prose">
                            <Link href="/demo/shield" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white">Live Demo</span>
                                </div>
                                <p className="text-sm text-gray-400">Try the protocol on devnet instantly.</p>
                            </Link>
                            <a href="#quick-start" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-gray-800 text-gray-300 group-hover:bg-gray-700 group-hover:text-white transition-colors">
                                        <Terminal className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white">Quick Start</span>
                                </div>
                                <p className="text-sm text-gray-400">Integrate the SDK in 5 minutes.</p>
                            </a>
                        </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

                    {/* Features (Grid Layout) */}
                    <section id="features" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            Privacy Features <span className="text-xs font-normal text-gray-500 font-mono border border-white/10 px-1.5 py-0.5 rounded">CORE</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={Shield}
                                title="Shielded Pool"
                                desc="Deposit SOL/SPL tokens into a global anonymity set. On-chain amounts are hidden."
                            />
                            <FeatureCard
                                icon={Ghost}
                                title="Stealth Addresses"
                                desc="Receive assets at one-time addresses unlinkable to your main identity."
                            />
                            <FeatureCard
                                icon={Lock}
                                title="Compliance Proofs"
                                desc="Prove solvability or clean funds (ZK) without revealing balances."
                            />
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Installation</h2>
                        <CodeSnippet
                            lang="bash"
                            code="npm install @ashborn/sdk"
                            label="Installation"
                        />
                        <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                            <Activity className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div className="text-sm text-amber-200/80">
                                <strong className="text-amber-400 block mb-1">Devnet Only</strong>
                                The current release (v0.2.2) is deployed to Solana Devnet. Mainnet deployment is scheduled for Q3 2026.
                            </div>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Quick Start</h2>
                        <p className="text-gray-400 mb-6">Initialize the SDK and shield your first asset.</p>

                        <div className="space-y-6">
                            <Step number="01" title="Initialize Client">
                                <CodeSnippet
                                    lang="typescript"
                                    code={`import { Ashborn } from '@ashborn/sdk';\n\nconst ashborn = new Ashborn(connection, wallet, {\n  network: 'devnet'\n});`}
                                />
                            </Step>
                            <Step number="02" title="Shield Assets">
                                <CodeSnippet
                                    lang="typescript"
                                    code={`const tx = await ashborn.shield({\n  amount: 1_000_000_000n, // 1 SOL\n  mint: SOL_MINT\n});\n\nconsole.log("Shielded:", tx.signature);`}
                                />
                            </Step>
                        </div>
                    </section>

                    {/* Architecture */}
                    <section id="how-it-works" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Architecture</h2>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-purple-400">
                                MERKLE_DEPTH: 20
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <h3 className="font-medium text-white mb-2">Note Structure</h3>
                                    <p className="text-sm text-gray-400 mb-4">Each shielded asset is represented as a UTXO note comprising:</p>
                                    <ul className="text-sm text-gray-500 space-y-2 font-mono">
                                        <li>• Amount (u64)</li>
                                        <li>• Blinding Factor (Fr)</li>
                                        <li>• Owner Pubkey (Point)</li>
                                    </ul>
                                </div>
                                <div className="border-l border-white/10 pl-8">
                                    <h3 className="font-medium text-white mb-2">Zero-Knowledge</h3>
                                    <p className="text-sm text-gray-400 mb-4">Groth16 proofs verify:</p>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Sum of inputs = Sum of outputs</li>
                                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Ownership of input notes</li>
                                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Nullifier uniqueness</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Deployment */}
                    <section id="deployment" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Deployment</h2>
                        <p className="text-gray-400 mb-6">Program IDs for current deployments.</p>

                        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Network</th>
                                        <th className="px-4 py-3 text-left font-medium">Program ID</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
                                    <tr>
                                        <td className="px-4 py-3">Devnet</td>
                                        <td className="px-4 py-3 text-purple-300">BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe</td>
                                        <td className="px-4 py-3"><span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Live</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">Mainnet</td>
                                        <td className="px-4 py-3 text-gray-600">Pending Launch...</td>
                                        <td className="px-4 py-3"><span className="text-gray-500 text-xs px-2 py-0.5 bg-white/5 rounded-full">Planned Q3</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}

// Sub-components
function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
            <Icon className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ number, title, children }: any) {
    return (
        <div className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0 hover:border-purple-500/30 transition-colors">
            <span className="absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full bg-[#050505] border border-white/20 text-[9px] flex items-center justify-center text-gray-500 font-mono font-bold">{number}</span>
            <h3 className="font-medium text-white mb-3 text-sm tracking-wide uppercase text-gray-400">{title}</h3>
            {children}
        </div>
    );
}

function CodeSnippet({ lang, code, label }: any) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-lg border border-white/10 bg-[#0E0E0E] overflow-hidden group">
            {label && (
                <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">{label}</span>
                    <button onClick={copy} className="text-gray-500 hover:text-white transition">
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                </div>
            )}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
