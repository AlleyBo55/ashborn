'use client';

import CodeBlock from '@/components/ui/CodeBlock';
import TerminalBlock from '@/components/ui/TerminalBlock';

// ... (existing imports, but remove Copy, Check from lucide if unused locally, mostly unused now as CodeBlock handles it)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight01Icon, Shield02Icon, ViewOffIcon, Activity01Icon, BookOpen01Icon, ConsoleIcon, CodeIcon, CpuIcon, LockIcon, FlashIcon, Search01Icon, Menu01Icon, Cancel01Icon, AiChat02Icon, SparklesIcon } from 'hugeicons-react';
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
        <Activity01Icon className="w-5 h-5 text-amber-500 mt-0.5" />
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
        title: "SDK Reference", items: [
            { id: 'sdk-core', title: 'Core SDK', icon: CodeIcon },
            { id: 'shadow-agent', title: 'Shadow Agent Protocol', icon: SparklesIcon },
            { id: 'stealth', title: 'Stealth Addresses', icon: ViewOffIcon },
            { id: 'nlp', title: 'Natural Language', icon: Activity01Icon },
            { id: 'eliza', title: 'Eliza Plugin', icon: ViewOffIcon },
        ]
    },
    {
        title: "guides", items: [
            { id: 'tutorials', title: 'Tutorials', icon: BookOpen01Icon },
            { id: 'deployment', title: 'Deployment', icon: Activity01Icon },
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
                        <Search01Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-gray-300 transition" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-gray-300 placeholder:text-gray-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 border border-white/10 px-1 rounded bg-white/5">⌘K</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                        {isMenuOpen ? <Cancel01Icon className="w-5 h-5" /> : <Menu01Icon className="w-5 h-5" />}
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
                            Ashborn
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mb-8">
                            <strong className="text-white">The Shadow Monarch.</strong> Ashborn shadows your intent, enveloping assets and executing private transfers. The underlying world never sees your identity.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 not-prose">
                            <Link href="/demo" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <FlashIcon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white">Live Demo</span>
                                </div>
                                <p className="text-sm text-gray-400">Try the protocol on devnet instantly.</p>
                            </Link>
                            <a href="#quick-start" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-gray-800 text-gray-300 group-hover:bg-gray-700 group-hover:text-white transition-colors">
                                        <ConsoleIcon className="w-5 h-5" />
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
                                icon={Shield02Icon}
                                title="Shielded Pool"
                                desc="Deposit SOL/SPL tokens into a global anonymity set. On-chain amounts are hidden."
                            />
                            <FeatureCard
                                icon={ViewOffIcon}
                                title="Stealth Addresses"
                                desc="Receive assets at one-time addresses unlinkable to your main identity."
                            />
                            <FeatureCard
                                icon={LockIcon}
                                title="Compliance Proofs"
                                desc="Prove solvability or clean funds (ZK) without revealing balances."
                            />
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">Installation</h2>
                        <CodeBlock
                            language="bash"
                            code="npm install @alleyboss/ashborn-sdk"
                            filename="Installation"
                        />
                        <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                            <Activity01Icon className="w-5 h-5 text-amber-500 mt-0.5" />
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

                    {/* How it Works (Conceptual) */}
                    <section id="how-it-works" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6">How it Works</h2>

                        {/* Analogy Card */}
                        <div className="bg-gradient-to-br from-[#1a1b26] to-black border border-purple-500/20 rounded-xl p-8 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <LockIcon className="w-5 h-5 text-purple-400" />
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
                                    <Shield02Icon className="w-4 h-4 text-green-400" />
                                    Non-Custodial
                                </h3>
                                <p className="text-sm text-gray-400">
                                    <strong>Not a Bank:</strong> The protocol developers cannot touch the funds. The smart contract is immutable. Only the user holding the ZK Proof (Private Key) can spend or withdraw the assets.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <ConsoleIcon className="w-4 h-4 text-blue-400" />
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
                                <CpuIcon className="w-4 h-4 text-purple-400" />
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

                    {/* Privacy Relay */}
                    <section id="privacy-relay" className="mb-20 scroll-mt-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                The Shadow Arsenal
                            </h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Ashborn is <strong className="text-white">The Shadow Monarch</strong>.
                            Protocols only see The Monarch&apos;s army — never your identity.
                        </p>

                        {/* Architecture Diagram */}
                        <div className="bg-gradient-to-br from-[#0a1a0a] to-black border border-green-500/20 rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="text-red-300 mb-1">⚡ RELAY</div>
                                    <div className="text-gray-500 leading-tight">Network Privacy</div>
                                </div>
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="text-blue-300 mb-1">🤖 AGENTS</div>
                                    <div className="text-gray-500 leading-tight">AI Commerce</div>
                                </div>
                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                    <div className="text-purple-300 mb-1">👻 WIRE</div>
                                    <div className="text-gray-500 leading-tight">Stealth Addr</div>
                                </div>
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="text-green-300 mb-1">🎭 SEAL</div>
                                    <div className="text-gray-500 leading-tight">ZK Proofs</div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6 text-gray-500 text-xs text-center border-t border-white/5 pt-4">
                                <span>All converge into <strong className="text-white">THE SHADOW MONARCH</strong></span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <h4 className="font-medium text-white mb-2 text-sm">🎭 K-Anonymity Amplified</h4>
                                <p className="text-xs text-gray-400">
                                    You hide in Ashborn&apos;s traffic + the protocol&apos;s pool. Double anonymity layer.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <h4 className="font-medium text-white mb-2 text-sm">📋 Compliant by Design</h4>
                                <p className="text-xs text-gray-400">
                                    ZK proofs let you prove compliance without revealing your identity.
                                </p>
                            </div>
                        </div>

                        {/* Code Example */}
                        <div className="mt-6">
                            <CodeBlock
                                language="typescript"
                                code={`// Server-side: The Shadow Monarch
import { PrivacyRelay } from '@alleyboss/ashborn-sdk';

const relay = new PrivacyRelay({
  relayKeypair: serverKeypair,
  rpcUrl: 'https://api.devnet.solana.com',
});

// All operations used the Monarch's identity
await relay.shield({ amount: 0.1 });      // PrivacyCash sees "Monarch"
await relay.generateStealth({ hint: 'x' }); // Unlinkable address
await relay.prove({ balance: 0.5 });       // ZK range proof`}
                                filename="privacy-relay.ts"
                            />
                        </div>
                    </section>

                    {/* SDK Core */}
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

                    {/* Shadow Agent Protocol */}
                    <section id="shadow-agent" className="mb-20 scroll-mt-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                Shadow Agent Protocol <span className="text-xs font-normal text-purple-500 font-mono border border-purple-500/20 px-1.5 py-0.5 rounded bg-purple-500/5">NEW</span>
                            </h2>
                            <Link href="/demo/shadow-agent" className="text-xs text-purple-300 border border-purple-500/30 px-2 py-1 rounded-full hover:bg-purple-500/10 transition">
                                Try Demo →
                            </Link>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Private AI-to-AI commerce layer. Two AI agents transact without exposing strategies or transaction history.
                        </p>

                        {/* AI Personas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">🏛️</span>
                                    <div>
                                        <h4 className="font-bold text-blue-300">The Architect</h4>
                                        <p className="text-xs text-gray-500">AI Buyer</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Designs systems. Pays for data inference privately.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">🗼</span>
                                    <div>
                                        <h4 className="font-bold text-purple-300">Tower of Trials</h4>
                                        <p className="text-xs text-gray-500">AI Seller</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Tests the worthy. Sells insights via shielded payments.</p>
                            </div>
                        </div>

                        {/* Integration Badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">👑 Ashborn (Monarch)</span>
                            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">🛡️ PrivacyCash</span>
                            <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">👻 Radr Labs</span>
                            <span className="text-[10px] font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">⚡ Light Protocol</span>
                            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">💳 x402 Paywall</span>
                        </div>

                        {/* Flow Diagram (Mobile Friendly) */}
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6">
                            <h4 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-wider">Execution Flow</h4>
                            <div className="flex flex-col gap-2">
                                {[
                                    { step: '1', label: '🤖 NOVA Shields', tech: 'PrivacyCash', color: 'blue' },
                                    { step: '2', label: '🤖 x402 Request', tech: '402 Payment Required', color: 'amber' },
                                    { step: '3', label: '🤖 → 🔮 Pay', tech: 'Radr Stealth Addr', color: 'purple' },
                                    { step: '4', label: '⚡ Verify Proof', tech: 'Light Protocol', color: 'green' },
                                    { step: '5', label: '🔮 ORACLE Unshields', tech: 'PrivacyCash', color: 'blue' },
                                ].map((s, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg bg-${s.color}-500/5 border border-${s.color}-500/20`}>
                                        <span className={`text-xs font-mono text-${s.color}-400 w-5 h-5 flex items-center justify-center rounded bg-${s.color}-500/20`}>{s.step}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-white text-sm block truncate">{s.label}</span>
                                            <span className="text-gray-500 text-[10px]">{s.tech}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                <h4 className="font-medium text-white mb-1 text-sm">Private Commerce</h4>
                                <p className="text-xs text-gray-500">Agents transact privately without exposing strategies</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                <h4 className="font-medium text-white mb-1 text-sm">Unlinkable Payments</h4>
                                <p className="text-xs text-gray-500">No on-chain trace between buyer and seller</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                <h4 className="font-medium text-white mb-1 text-sm">Compliant by Design</h4>
                                <p className="text-xs text-gray-500">ZK proofs enable selective disclosure</p>
                            </div>
                        </div>

                        {/* Code Example */}
                        <CodeBlock
                            language="typescript"
                            code={`import { Ashborn } from '@alleyboss/ashborn-sdk';
import { ShadowWire } from '@alleyboss/ashborn-sdk/stealth';
import { PrivacyCashOfficial } from '@alleyboss/ashborn-sdk/integrations';

// Ashborn orchestrates the entire flow
const ashborn = new Ashborn(connection, wallet);

// The Architect (Buyer) shields funds
const architectPC = new PrivacyCashOfficial({ rpcUrl, owner });
await architectPC.shieldSOL(0.01);

// Tower of Trials (Seller) receives via stealth address
const shadowWire = new ShadowWire();
const { stealthPubkey } = shadowWire.generateStealthAddress(
  towerViewPubKey, towerSpendPubKey
);

// Tower unshields after providing data
await towerPC.unshieldSOL(0.01);`}
                            filename="shadow-agent.ts"
                        />
                    </section>

                    {/* Stealth Addresses (ECDH) - NEW */}
                    <section id="stealth" className="mb-20 scroll-mt-24">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            Stealth Addresses <span className="text-xs font-normal text-green-500 font-mono border border-green-500/20 px-1.5 py-0.5 rounded bg-green-500/5">ECDH v1.1</span>
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Generate unlinkable one-time addresses using Vitalik&apos;s formula: <code className="text-purple-300 bg-purple-500/10 px-1 rounded">P = H(r*A)*G + B</code>
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`import { ShadowWire } from '@alleyboss/ashborn-sdk';

// Recipient: Generate keypair ONCE (publish pubkeys)
const meta = shadowWire.generateStealthMetaAddress();
// Share: meta.viewPubKey, meta.spendPubKey

// Sender: Derive stealth address for payment
const { ephemeralPubkey, stealthPubkey } = shadowWire.generateStealthAddress(
  recipientViewPubKey,
  recipientSpendPubKey
);
// Send funds to stealthPubkey, publish ephemeralPubkey

// Recipient: Scan for incoming payments
const matches = shadowWire.scanForPayments(
  meta.viewPrivKey,
  meta.spendPubKey,
  ephemeralPubkeys
);

// Recipient: Derive spending key to claim
const spendKey = shadowWire.deriveStealthPrivateKey(
  meta.viewPrivKey,
  meta.spendPrivKey,
  ephemeralPubkey
);`}
                            filename="stealth-ecdh.ts"
                        />
                        <div className="mt-4 p-4 rounded-lg bg-green-900/10 border border-green-500/20">
                            <p className="text-sm text-green-200/80">
                                <strong className="text-green-400">Cryptography:</strong> Uses <code className="text-green-300">@noble/curves/ed25519</code> for elliptic curve operations. Both sender and receiver remain unlinkable on-chain.
                            </p>
                        </div>
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
                        <CodeBlock
                            language="typescript"
                            code={`import { AshbornPlugin } from '@alleyboss/plugin-ashborn';

const agent = new Agent({
    plugins: [new AshbornPlugin()]
});`}
                            filename="agent-config.ts"
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
                                <div className="bg-black/50 p-2 rounded border border-white/10">
                                    <span className="text-gray-500 block mb-1">Ashborn Program ID:</span>
                                    <code className="text-purple-400 break-all text-xs sm:text-sm">BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe</code>
                                    <span className="text-gray-400 text-xs block mt-1">Handles: Shadow vaults, ZK proofs, compliance</span>
                                </div>
                                <div className="bg-black/50 p-2 rounded border border-white/10">
                                    <span className="text-gray-500 block mb-1">PrivacyCash Program ID:</span>
                                    <code className="text-blue-400 break-all text-xs sm:text-sm">ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS</code>
                                    <span className="text-gray-400 text-xs block mt-1">Handles: Shielded pool deposits/withdrawals</span>
                                    <span className="text-gray-500 text-xs block mt-1">Deployed by @alleyboss from <a href="https://github.com/Privacy-Cash/privacy-cash" className="text-blue-300 hover:underline" target="_blank" rel="noopener">Privacy-Cash/privacy-cash</a></span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-lg overflow-x-auto">
                            <table className="w-full text-sm min-w-[600px]">
                                <thead className="bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Network</th>
                                        <th className="px-4 py-3 text-left font-medium">Program ID</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap">Devnet</td>
                                        <td className="px-4 py-3 text-purple-300 text-xs">BzBUgtEFiJjUXR2xjsvhvVx2oZEhD2K6qenpg727z5Qe</td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Live (ZK)</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap">Mainnet</td>
                                        <td className="px-4 py-3 text-gray-600">Pending Launch...</td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className="text-gray-500 text-xs px-2 py-0.5 bg-white/5 rounded-full">Planned Q3</span></td>
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

// CodeSnippet removed, using CodeBlock instead
