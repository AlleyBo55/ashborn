'use client';

import { useState, useEffect } from 'react';

const sections = [
    { id: 'overview', title: 'Overview', icon: '🌑' },
    { id: 'why-ashborn', title: 'Why Ashborn?', icon: '💡' },
    { id: 'features', title: 'Features', icon: '✨' },
    { id: 'installation', title: 'Installation', icon: '📦' },
    { id: 'quick-start', title: 'Quick Start', icon: '🚀' },
    { id: 'how-it-works', title: 'How It Works', icon: '⚙️' },
    { id: 'sdk', title: 'SDK Reference', icon: '📚' },
    { id: 'nlp', title: 'Natural Language', icon: '🗣️' },
    { id: 'eliza', title: 'Eliza Plugin', icon: '🤖' },
    { id: 'nft', title: 'NFT Privacy', icon: '🖼️' },
    { id: 'security', title: 'Security', icon: '🔐' },
    { id: 'roadmap', title: 'Roadmap', icon: '🗺️' },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🌑</span>
                        <span className="font-semibold text-lg tracking-tight">Ashborn</span>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">v3.0</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <a href="/" className="hover:text-white transition">Home</a>
                        <a href="/docs" className="text-white">Docs</a>
                        <a href="https://github.com/your-org/ashborn" className="hover:text-white transition">GitHub</a>
                    </div>
                </div>
            </nav>

            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 overflow-y-auto hidden lg:block">
                    <div className="p-6 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollTo(section.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 ${activeSection === section.id
                                    ? 'bg-purple-500/10 text-purple-300 border-l-2 border-purple-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-base">{section.icon}</span>
                                {section.title}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 max-w-4xl mx-auto px-6 py-12">
                    {/* Hero */}
                    <section id="overview" className="mb-24">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full text-sm mb-6">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                Production-Ready Privacy Protocol
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                The Compliant<br />Private Payment Protocol
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Private transfers, selective disclosure, and stealth addresses on Solana.
                                Built with real ZK proofs.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <FeatureCard
                                icon="🔐"
                                title="Shielded Transfers"
                                description="Send SOL/tokens privately with hidden amounts and participants."
                            />
                            <FeatureCard
                                icon="📊"
                                title="Range Proofs"
                                description="Prove balance ranges without revealing exact amounts."
                            />
                            <FeatureCard
                                icon="👻"
                                title="Stealth Addresses"
                                description="Receive payments at unlinkable one-time addresses."
                            />
                        </div>
                    </section>

                    {/* Why Ashborn */}
                    <section id="why-ashborn" className="mb-24">
                        <SectionHeader icon="💡" title="Why Ashborn?" />
                        <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-2xl p-8 border border-red-500/10 mb-8">
                            <h3 className="text-xl font-semibold text-red-300 mb-4">The Problem</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Every Solana transaction is public. Your wallet balance, transaction history,
                                and business dealings are visible to competitors, attackers, and anyone curious
                                about your finances.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-black/30 p-4 rounded-lg">
                                    <span className="text-red-400">📈 Competitors</span>
                                    <p className="text-gray-500 mt-1">Analyzing your treasury moves</p>
                                </div>
                                <div className="bg-black/30 p-4 rounded-lg">
                                    <span className="text-red-400">🎯 Attackers</span>
                                    <p className="text-gray-500 mt-1">Tracking whale wallets</p>
                                </div>
                                <div className="bg-black/30 p-4 rounded-lg">
                                    <span className="text-red-400">👁️ Anyone</span>
                                    <p className="text-gray-500 mt-1">Curious about your finances</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl p-8 border border-green-500/10">
                            <h3 className="text-xl font-semibold text-green-300 mb-4">The Solution</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Ashborn creates a private layer where amounts are hidden in cryptographic
                                commitments, sender/recipient are unlinkable via stealth addresses, and
                                compliance is preserved via selective disclosure proofs.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <div>
                                        <span className="text-white">Pedersen Commitments</span>
                                        <p className="text-gray-500">Hide amounts cryptographically</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <div>
                                        <span className="text-white">Merkle Nullifiers</span>
                                        <p className="text-gray-500">Prevent double-spends privately</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <div>
                                        <span className="text-white">Groth16 Proofs</span>
                                        <p className="text-gray-500">Verify without revealing data</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 text-lg">✓</span>
                                    <div>
                                        <span className="text-white">Stealth ECDH</span>
                                        <p className="text-gray-500">Unlinkable receive addresses</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section id="features" className="mb-24">
                        <SectionHeader icon="✨" title="Features" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <FeatureBlock
                                title="Fixed Denominations"
                                tag="ZachXBT-proof"
                                description="Only 0.1, 1, 10, 100, or 1000 SOL. Prevents amount fingerprinting."
                                color="purple"
                            />
                            <FeatureBlock
                                title="Privacy Delay"
                                tag="24 hours"
                                description="Mandatory delay before unshield to break timing analysis."
                                color="blue"
                            />
                            <FeatureBlock
                                title="Decoy Outputs"
                                tag="3+ per tx"
                                description="Fake outputs indistinguishable from real ones."
                                color="green"
                            />
                            <FeatureBlock
                                title="Relayer Network"
                                tag="Sender privacy"
                                description="Submit transactions without revealing your wallet."
                                color="orange"
                            />
                        </div>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="mb-24">
                        <SectionHeader icon="📦" title="Installation" />
                        <div className="space-y-6">
                            <CodeBlock
                                title="1. Install the SDK"
                                language="bash"
                                code="npm install @ashborn/sdk"
                            />
                            <CodeBlock
                                title="2. Set environment variables"
                                language="bash"
                                code={`# .env.local
SOLANA_RPC_URL=https://api.devnet.solana.com
HELIUS_API_KEY=your-helius-key  # Optional
OPENAI_API_KEY=your-openai-key  # For NLP`}
                            />
                            <CodeBlock
                                title="3. Clone for development"
                                language="bash"
                                code={`git clone https://github.com/your-org/ashborn.git
cd ashborn
npm install
anchor build
anchor test`}
                            />
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section id="quick-start" className="mb-24">
                        <SectionHeader icon="🚀" title="Quick Start" />
                        <CodeBlock
                            title="Basic Usage"
                            language="typescript"
                            code={`import { Ashborn } from '@ashborn/sdk';

const ashborn = new Ashborn(connection, wallet);

// Shield 1 SOL into the privacy pool
await ashborn.shield({
  amount: 1_000_000_000n,
  mint: SOL_MINT,
});

// Send privately to recipient
await ashborn.shadowTransfer({
  amount: 500_000_000n,
  recipientStealth: stealthAddress,
});

// Prove balance range for compliance
await ashborn.proveRange({
  min: 0n,
  max: 10_000_000_000_000n, // Under $10k
});

// Exit private mode
await ashborn.unshield({
  amount: 200_000_000n,
});`}
                        />
                    </section>

                    {/* How It Works */}
                    <section id="how-it-works" className="mb-24">
                        <SectionHeader icon="⚙️" title="How It Works" />

                        <div className="space-y-8">
                            <ProcessStep
                                number="01"
                                title="Shield"
                                subtitle="Deposit into privacy pool"
                                description="User deposits SOL/tokens. A Pedersen commitment C = Poseidon(amount, blinding) is created. Only the commitment is visible on-chain."
                                code={`commitment = Poseidon(amount, blinding)
// On-chain: commitment only
// Off-chain: encrypted amount`}
                            />
                            <ProcessStep
                                number="02"
                                title="Transfer"
                                subtitle="Private peer-to-peer"
                                description="Sender reveals a nullifier (prevents double-spend), creates output commitment for recipient, generates ZK proof of value conservation, adds 3 decoy outputs."
                                code={`nullifier = Poseidon(secret, noteIndex)
output = Poseidon(amount, newBlinding)
proof = Groth16.prove(input = output + change)`}
                            />
                            <ProcessStep
                                number="03"
                                title="Prove"
                                subtitle="Selective disclosure"
                                description="Generate Bulletproof range proof to show balance ∈ [min, max] without revealing exact value. For compliance, loans, or verification."
                                code={`rangeProof = Bulletproof.prove(
  value ∈ [0, 10000]
)
// Verifier learns: balance < $10k
// Verifier does NOT learn: exact balance`}
                            />
                            <ProcessStep
                                number="04"
                                title="Unshield"
                                subtitle="Exit to public"
                                description="After 24-hour delay, reveal nullifier to prove ownership. Tokens transfer from pool to user's public wallet."
                                code={`require(now > note.createdAt + 24h)
reveal(nullifier, proof)
transfer(pool → user, amount)`}
                            />
                        </div>
                    </section>

                    {/* SDK Reference */}
                    <section id="sdk" className="mb-24">
                        <SectionHeader icon="📚" title="SDK Reference" />

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">shield(params)</code></td><td className="py-3 px-4 text-gray-400">Deposit into privacy pool</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">shadowTransfer(params)</code></td><td className="py-3 px-4 text-gray-400">Private P2P transfer</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">proveRange(params)</code></td><td className="py-3 px-4 text-gray-400">Generate range proof</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">unshield(params)</code></td><td className="py-3 px-4 text-gray-400">Withdraw to public wallet</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">getVaultBalance()</code></td><td className="py-3 px-4 text-gray-400">Check shielded balance</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">getNotes()</code></td><td className="py-3 px-4 text-gray-400">List unspent notes</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">createRelayer(network)</code></td><td className="py-3 px-4 text-gray-400">Privacy tx submission</td></tr>
                                    <tr><td className="py-3 px-4"><code className="text-purple-300">createTreeIndexer()</code></td><td className="py-3 px-4 text-gray-400">Off-chain Merkle tree</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* NLP */}
                    <section id="nlp" className="mb-24">
                        <SectionHeader icon="🗣️" title="Natural Language Interface" />
                        <p className="text-gray-400 mb-6">
                            Execute privacy operations with plain English. Powered by GPT-4 with confidence thresholds.
                        </p>
                        <CodeBlock
                            title="Natural Language Usage"
                            language="typescript"
                            code={`import { NaturalLanguageAshborn } from '@ashborn/sdk';

const ai = new NaturalLanguageAshborn({
  apiKey: 'your-openai-key',
  confidenceThreshold: 0.8,
});

// Natural language commands
await ai.execute("shield 1 SOL");
await ai.execute("send $50 to @alice privately");
await ai.execute("prove my balance is under $10,000");
await ai.execute("what's my shielded balance?");

// Low confidence → asks for confirmation
// "send maybe 50?" → "🤔 Did you mean to send $50?"`}
                        />
                    </section>

                    {/* Eliza */}
                    <section id="eliza" className="mb-24">
                        <SectionHeader icon="🤖" title="Eliza Agent Plugin" />
                        <p className="text-gray-400 mb-6">
                            Enable AI agents to execute privacy operations via the Eliza framework.
                        </p>
                        <CodeBlock
                            title="Eliza Integration"
                            language="typescript"
                            code={`import ashbornPlugin from '@ashborn/plugin-eliza';

// Register with Eliza
const agent = new ElizaAgent({
  plugins: [ashbornPlugin],
});

// Agent can now respond to:
// "shield 2 SOL" → Executes shield
// "send $100 to @bob" → Private transfer
// "prove balance under $50k" → Range proof
// "what's my balance" → Shows vault`}
                        />
                        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-300 text-sm mb-2">
                                <span>ℹ️</span> Actions Included
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                <span className="bg-purple-500/20 px-2 py-1 rounded">ASHBORN_SHIELD</span>
                                <span className="bg-purple-500/20 px-2 py-1 rounded">ASHBORN_SEND</span>
                                <span className="bg-purple-500/20 px-2 py-1 rounded">ASHBORN_PROVE</span>
                                <span className="bg-purple-500/20 px-2 py-1 rounded">ASHBORN_BALANCE</span>
                                <span className="bg-purple-500/20 px-2 py-1 rounded">ASHBORN_UNSHIELD</span>
                            </div>
                        </div>
                    </section>

                    {/* NFT Privacy */}
                    <section id="nft" className="mb-24">
                        <SectionHeader icon="🖼️" title="NFT Privacy" />
                        <p className="text-gray-400 mb-6">
                            Private NFT ownership with trait-gated proofs. Perfect for exclusive communities.
                        </p>
                        <CodeBlock
                            title="Private NFT Operations"
                            language="typescript"
                            code={`import { createNFTPrivacy } from '@ashborn/sdk';

const nftManager = createNFTPrivacy(connection, wallet);

// Shield an NFT
const privateNFT = await nftManager.shieldNFT(
  mint, 
  metadata, 
  viewKey
);

// Prove collection membership without revealing which NFT
const proof = await nftManager.proveCollectionMembership(
  privateNFT,
  viewKey,
  SHADOW_MONARCHS_COLLECTION
);

// Prove trait ownership
const traitProof = await nftManager.proveTraitOwnership(
  privateNFT,
  viewKey,
  'Rank',
  'S'
);

// Check S-Rank privilege
const hasPrivilege = await nftManager.hasSRankPrivilege(nfts, viewKey);`}
                        />
                    </section>

                    {/* Security */}
                    <section id="security" className="mb-24">
                        <SectionHeader icon="🔐" title="Security" />

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h4 className="font-semibold mb-4">Cryptographic Primitives</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Poseidon Hash (ZK-friendly)</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> AES-GCM Encryption</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Groth16 on BN254</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Bulletproof Range Proofs</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h4 className="font-semibold mb-4">Privacy Guarantees</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sender: Relayer submission</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Recipient: ECDH stealth</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Amount: Pedersen commits</li>
                                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Timing: 24h delay</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-300 text-sm mb-2">
                                <span>⚠️</span> Trust Assumptions
                            </div>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Trusted setup ceremony required for Groth16 proofs</li>
                                <li>• Relayer knows IP address (use Tor for full anonymity)</li>
                                <li>• View key holders can decrypt your balance</li>
                            </ul>
                        </div>
                    </section>

                    {/* Roadmap */}
                    <section id="roadmap" className="mb-24">
                        <SectionHeader icon="🗺️" title="Roadmap" />

                        <div className="space-y-6">
                            <RoadmapPhase
                                phase="1"
                                title="Core Protocol"
                                status="complete"
                                items={['Groth16 ZK verification', 'Merkle tree nullifiers', 'Range compliance proofs', 'Privacy Cash integration']}
                            />
                            <RoadmapPhase
                                phase="2"
                                title="Privacy Infrastructure"
                                status="in-progress"
                                items={['Distributed relayer network', 'Trusted setup ceremony', 'Light client mode', 'Mobile SDK']}
                            />
                            <RoadmapPhase
                                phase="3"
                                title="Ecosystem Integration"
                                status="planned"
                                items={['Jupiter private swaps', 'TensorSwap private trading', 'Cross-chain bridges', 'Compressed NFT support']}
                            />
                            <RoadmapPhase
                                phase="4"
                                title="Mass Adoption"
                                status="planned"
                                items={['React Native app', 'Social login (no seed phrases)', 'Fiat on-ramp integration', 'Private stablecoins']}
                            />
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center py-16 border-t border-white/5">
                        <h2 className="text-3xl font-bold mb-4">Start Building Today</h2>
                        <p className="text-gray-400 mb-8">Join the Shadow Monarch revolution.</p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/your-org/ashborn"
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition"
                            >
                                View on GitHub
                            </a>
                            <a
                                href="https://npmjs.com/package/@ashborn/sdk"
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition"
                            >
                                npm install
                            </a>
                        </div>
                        <p className="mt-12 text-4xl font-bold text-purple-400">ARISE.</p>
                    </section>
                </main>
            </div>
        </div>
    );
}

// Components

function SectionHeader({ icon, title }: { icon: string; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition">
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}

function FeatureBlock({ title, tag, description, color }: { title: string; tag: string; description: string; color: string }) {
    const colors: Record<string, string> = {
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        green: 'bg-green-500/10 border-green-500/20 text-green-300',
        orange: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    };

    return (
        <div className={`rounded-xl p-6 border ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">{title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors[color]}`}>{tag}</span>
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}

function CodeBlock({ title, language, code }: { title: string; language: string; code: string }) {
    return (
        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10">
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm text-gray-400">{title}</span>
                <span className="text-xs text-gray-500">{language}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{code}</code>
            </pre>
        </div>
    );
}

function ProcessStep({ number, title, subtitle, description, code }: {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    code: string;
}) {
    return (
        <div className="flex gap-6">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
                    {number}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{title}</h4>
                    <span className="text-xs text-gray-500">— {subtitle}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{description}</p>
                <pre className="bg-[#1a1a1a] p-4 rounded-lg text-xs text-gray-400 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

function RoadmapPhase({ phase, title, status, items }: {
    phase: string;
    title: string;
    status: 'complete' | 'in-progress' | 'planned';
    items: string[];
}) {
    const statusStyles = {
        complete: 'bg-green-500/20 text-green-300 border-green-500/30',
        'in-progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        planned: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const statusLabels = {
        complete: '✓ Complete',
        'in-progress': '⏳ In Progress',
        planned: '📋 Planned',
    };

    return (
        <div className={`rounded-xl p-6 border ${statusStyles[status]}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">Phase {phase}</span>
                    <span className="text-lg">{title}</span>
                </div>
                <span className="text-sm">{statusLabels[status]}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{status === 'complete' ? '✓' : '○'}</span>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
