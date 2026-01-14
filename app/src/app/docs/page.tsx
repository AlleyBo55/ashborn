'use client';

import CodeBlock from '@/components/ui/CodeBlock';
import TerminalBlock from '@/components/ui/TerminalBlock';

// ... (existing imports, but remove Copy, Check from lucide if unused locally, mostly unused now as CodeBlock handles it)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Ghost, Activity, Book, Terminal, Code, Cpu, Lock, Zap, Search, Menu, X, ChevronRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';

// ... (sections data remains same)

// ... (DocsPage main component)

{/* Installation */ }
<section id="installation" className="mb-20 scroll-mt-24">
    <h2 className="text-2xl font-semibold mb-6">Installation</h2>
    <TerminalBlock
        command="npm install @alleyboss/ashborn-sdk"
        cwd="~/project"
    />
    <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
        <Activity className="w-5 h-5 text-amber-500 mt-0.5" />
        <div className="text-sm text-amber-200/80">
            <strong className="text-amber-400 block mb-1">Devnet Only</strong>
            The current release (v0.2.2) is deployed to Solana Devnet. Mainnet deployment is scheduled for Q3 2026.
        </div>
    </div>
</section>

{/* Quick Start */ }
<section id="quick-start" className="mb-20 scroll-mt-24">
    <h2 className="text-2xl font-semibold mb-6">Quick Start</h2>
    <p className="text-gray-400 mb-6">Initialize the SDK and shield your first asset.</p>

    <div className="space-y-6">
        <Step number="01" title="Initialize Client">
            <CodeBlock
                language="typescript"
                code={`import { Ashborn } from '@alleyboss/ashborn-sdk';\n\nconst ashborn = new Ashborn(connection, wallet, {\n  network: 'devnet'\n});`}
                filename="client.ts"
            />
        </Step>
        <Step number="02" title="Shield Assets">
            <CodeBlock
                language="typescript"
                code={`const tx = await ashborn.shield({\n  amount: 1_000_000_000n, // 1 SOL\n  mint: SOL_MINT\n});\n\nconsole.log("Shielded:", tx.signature);`}
                filename="shield.ts"
            />
        </Step>
    </div>
</section>

// ... (Architecture section)

{/* SDK Core */ }
<section id="sdk-core" className="mb-20 scroll-mt-24">
    <h2 className="text-2xl font-semibold mb-6">Core SDK</h2>
    <p className="text-gray-400 mb-6">Primary methods for interacting with the Ashborn program.</p>
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

// ... (NLP section)

{/* Eliza Plugin */ }
<section id="eliza" className="mb-20 scroll-mt-24">
    <h2 className="text-2xl font-semibold mb-6">Eliza Plugin</h2>
    <p className="text-gray-400 mb-6">
        Drop-in integration for the Eliza agent framework. Give your AI agents a bank account they can use privately.
    </p>
    <CodeBlock
        language="typescript"
        code={`import { AshbornPlugin } from '@alleyboss/plugin-ashborn';

const agent = new Agent({
    plugins: [new AshbornPlugin()]
});`}
        filename="agent-config.ts"
    />
</section>

// ... (Tutorials, Deployment)

// ... (Sub-components)

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
                            <Link href="/demo" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07]">
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
                            code="npm install @alleyboss/ashborn-sdk"
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
                                    code={`import { Ashborn } from '@alleyboss/ashborn-sdk';\n\nconst ashborn = new Ashborn(connection, wallet, {\n  network: 'devnet'\n});`}
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

                    {/* How it Works (Conceptual) */}
                    <section id="how-it-works" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">How it Works</h2>

                        {/* Analogy Card */}
                        <div className="bg-gradient-to-br from-[#1a1b26] to-black border border-purple-500/20 rounded-xl p-8 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-400" />
                                The &quot;Glass Vault&quot; Analogy
                            </h3>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Imagine a <strong>transparent glass vault</strong> (the Smart Contract) in the middle of a town square (Solana Blockchain).
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0">1</span>
                                        <span>
                                            <strong>Deposit (Extract):</strong> You put 1 Gold Coin into the vault. In return, the machine gives you a <span className="text-white">Secret Ticket</span> (ZK Note). You are now anonymous; your coin looks identical to everyone else&apos;s in the pile.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0">2</span>
                                        <span>
                                            <strong>Transfer (Strike):</strong> You want to pay your friend. You securely mail them your Secret Ticket. They now own the claim to 1 coin in the vault. The vault never moved; only the ownership of the claim changed invisibly.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0">3</span>
                                        <span>
                                            <strong>Withdraw (Arise):</strong> Your friend uses the ticket to take 1 coin out. The vault verifies the ticket is valid without ever asking <em>&quot;Who gave this to you?&quot;</em>.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    Non-Custodial
                                </h3>
                                <p className="text-sm text-gray-400">
                                    <strong>Not a Bank:</strong> The protocol developers cannot touch the funds. The smart contract is immutable. Only the user holding the ZK Proof (Private Key) can spend or withdraw the assets.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-blue-400" />
                                    Smart Contract Pool
                                </h3>
                                <p className="text-sm text-gray-400">
                                    <strong>Pooled Liquidity:</strong> All user assets are pooled together in a single Solana account. This &quot;Anonymity Set&quot; makes it mathematically impossible to link a specific deposit to a specific withdrawal.
                                </p>
                            </div>
                        </div>

                        {/* Technical ZK Flow */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-purple-400" />
                                Cryptographic Flow
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                    <div className="text-xs font-mono text-purple-300 mb-2">STEP 1: COMMITMENT</div>
                                    <code className="text-[11px] text-gray-400 block mb-2">C = Poseidon(amount, blinding)</code>
                                    <p className="text-xs text-gray-500">Hidden amount stored on-chain</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                    <div className="text-xs font-mono text-blue-300 mb-2">STEP 2: MERKLE INSERT</div>
                                    <code className="text-[11px] text-gray-400 block mb-2">Tree.insert(C)</code>
                                    <p className="text-xs text-gray-500">Commitment added to Merkle tree</p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                    <div className="text-xs font-mono text-green-300 mb-2">STEP 3: NULLIFY & SPEND</div>
                                    <code className="text-[11px] text-gray-400 block mb-2">Prove(C ∈ Tree, nullifier)</code>
                                    <p className="text-xs text-gray-500">ZK proof without revealing leaf</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div><span className="text-gray-500">Hash:</span> <span className="text-white font-mono">Poseidon</span></div>
                                    <div><span className="text-gray-500">Proof:</span> <span className="text-white font-mono">Groth16</span></div>
                                    <div><span className="text-gray-500">Curve:</span> <span className="text-white font-mono">BN128</span></div>
                                    <div><span className="text-gray-500">Tree:</span> <span className="text-white font-mono">Sparse Merkle</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section id="security" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Security Model</h2>
                        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6">
                            <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Audited Compliance
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                The core circuits are based on standard Groth16 implementations.
                                Trusted setup was performed in Phase 2 ceremony (simulated for devnet).
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-black/40 rounded border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">Prove Algorithm</div>
                                    <div className="text-gray-300 font-mono">Groth16</div>
                                </div>
                                <div className="p-3 bg-black/40 rounded border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">Curve</div>
                                    <div className="text-gray-300 font-mono">BN128</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SDK Core */}
                    <section id="sdk-core" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Core SDK</h2>
                        <p className="text-gray-400 mb-6">Primary methods for interacting with the Ashborn program.</p>
                        <CodeSnippet
                            lang="typescript"
                            code={`// Shield Assets
await ashborn.shield({ amount: 1_000_000n });

// Private Transfer
await ashborn.transfer({ 
    to: stealthAddress, 
    amount: 1_000_000n 
});

// Generate Proof
const proof = await ashborn.proveRange({ max: 1000n });`}
                            label="sdk-usage.ts"
                        />
                    </section>

                    {/* Natural Language */}
                    <section id="nlp" className="mb-20 scroll-mt-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Natural Language</h2>
                            <Link href="/demo/nlp" className="text-xs text-purple-300 border border-purple-500/30 px-2 py-1 rounded-full hover:bg-purple-500/10 transition">
                                Try Demo →
                            </Link>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Ashborn includes a semantic layer to parse user intents into privacy operations.
                        </p>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 italic text-gray-400 border-l-4 border-l-purple-500">
                            &quot;Shield 50 USDC and send half to alleyboss.sol&quot;
                        </div>
                    </section>

                    {/* Eliza Plugin */}
                    <section id="eliza" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Eliza Plugin</h2>
                        <p className="text-gray-400 mb-6">
                            Drop-in integration for the Eliza agent framework. Give your AI agents a bank account they can use privately.
                        </p>
                        <CodeSnippet
                            lang="typescript"
                            code={`import { AshbornPlugin } from '@alleyboss/plugin-ashborn';

const agent = new Agent({
    plugins: [new AshbornPlugin()]
});`}
                            label="agent-config.ts"
                        />
                    </section>

                    {/* Tutorials */}
                    <section id="tutorials" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Tutorials</h2>
                        <div className="grid gap-4">
                            <a href="#" className="block p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition group">
                                <h3 className="font-medium text-white mb-1 group-hover:text-purple-300 transition-colors">Building a Private Payroll App</h3>
                                <p className="text-sm text-gray-500">Learn how to stream salaries privately using Ashborn.</p>
                            </a>
                            <a href="#" className="block p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition group">
                                <h3 className="font-medium text-white mb-1 group-hover:text-purple-300 transition-colors">Compliance for DAOs</h3>
                                <p className="text-sm text-gray-500">Prove treasury solvency without revealing exact holdings.</p>
                            </a>
                        </div>
                    </section>

                    {/* Deployment */}
                    <section id="deployment" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Deployment</h2>

                        <div className="p-4 border border-green-500/20 bg-green-900/10 rounded-lg mb-6">
                            <h3 className="text-green-400 font-bold mb-2">🚀 PRODUCTION READY (Devnet)</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                The Ashborn protocol is deployed on Solana Devnet with <strong>REAL ZK Verification</strong> enabled.
                            </p>
                            <div className="grid gap-2 font-mono text-sm">
                                <div className="bg-black/50 p-2 rounded border border-white/10 flex justify-between items-center">
                                    <span className="text-gray-500">Program ID:</span>
                                    <code className="text-purple-400">BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe</code>
                                </div>
                                <div className="bg-black/50 p-2 rounded border border-white/10 flex justify-between items-center">
                                    <span className="text-gray-500">IDL Address:</span>
                                    <code className="text-blue-400">54Fp3foQ9XkLpykGaYKF7Hnb2YywpfLebRpZ637AGoxz</code>
                                </div>
                            </div>
                        </div>

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
                                        <td className="px-4 py-3"><span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Live (ZK)</span></td>
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


// CodeSnippet with copy button

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
