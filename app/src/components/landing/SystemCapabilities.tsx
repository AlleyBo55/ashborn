'use client';

import { motion } from 'framer-motion';
import { Bot, Ghost, ShieldCheck, Zap, Globe, Lock, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const DemoCard = ({ icon: Icon, title, desc, link, tech, color }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative group cursor-pointer"
    >
        <Link href={link}>
            <div className={`absolute inset-0 bg-${color}-500/10 blur-xl group-hover:bg-${color}-500/20 transition-all duration-500`} />
            <div className="relative h-full bg-black/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl overflow-hidden group-hover:border-white/10 transition-colors">
                <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500`}>
                    <ExternalLink className="w-5 h-5 text-white" />
                </div>

                <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center mb-6 border border-${color}-500/30 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-mono tracking-tight">{title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{desc}</p>

                <div className="flex flex-wrap gap-2">
                    {tech.map((t: string) => (
                        <span key={t} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 group-hover:text-white transition-colors">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    </motion.div>
);

const PartnerBadge = ({ name, role, color }: any) => (
    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-default">
        <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`} />
        <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-widest uppercase font-mono">{name}</span>
            <span className={`text-[10px] text-${color}-400 uppercase tracking-wider`}>{role}</span>
        </div>
    </div>
);

export default function SystemCapabilities() {
    return (
        <section className="relative w-full py-32 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                                INFINITE<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">POSSIBILITIES</span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
                                The Shadow Monarch protocol is not just a tool. It is a canvas.
                                Built for developers who demand <span className="text-white font-bold">unstoppable applications</span>.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 text-right">Power Integrations</p>
                            <div className="flex flex-wrap justify-end gap-3">
                                <PartnerBadge name="Privacy Cash" role="Shielded Pool" color="blue" />
                                <PartnerBadge name="Radr Labs" role="Stealth Network" color="purple" />
                                <PartnerBadge name="X402" role="Agent Commerce" color="green" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: AI Payment */}
                    <DemoCard
                        icon={Bot}
                        title="AI-to-AI Economy"
                        desc="Agents paying agents in total darkness. Using X402 for payment gates and Ashborn for receiver anonymity. The future of machine commerce."
                        link="/demo/ai-payment"
                        color="blue"
                        tech={['PrivacyCash', 'X402', 'Devnet']}
                    />

                    {/* Card 2: Stealth Transfer */}
                    <DemoCard
                        icon={Ghost}
                        title="Shadow Transfer"
                        desc="Mathematical invisibility for P2P payments. Send SOL to anyone without revealing their main wallet. Radr Labs integration active."
                        link="/demo/transfer"
                        color="purple"
                        tech={['Radr Labs', 'ZK Proofs', 'Relayer']}
                    />

                    {/* Card 3: Compliance */}
                    <DemoCard
                        icon={ShieldCheck}
                        title="Solvency Proofs"
                        desc="Prove you have funds without showing how much. Selective disclosure verified on-chain. Regulatory compliance, solved."
                        link="/demo/prove"
                        color="green"
                        tech={['Groth16', 'Circom', 'Range Proof']}
                    />

                    {/* Card 4: Interop */}
                    <DemoCard
                        icon={Zap}
                        title="Protocol Interop"
                        desc="Seamlessly move assets between PrivacyCash pools and Ashborn stealth addresses. One shield, infinite destinations."
                        link="/demo/interop"
                        color="yellow"
                        tech={['Composable', 'Atomic', 'SDK']}
                    />

                    {/* Card 5: Radr Native */}
                    <DemoCard
                        icon={Globe}
                        title="Radr Labs Integration"
                        desc="Direct integration with Radr's stealth infrastructure. Ephemeral keys ensuring perfect forward secrecy for every transaction."
                        link="/demo/radr"
                        color="pink"
                        tech={['Curve25519', 'Stealth', 'Radr']}
                    />

                    {/* Card 6: Build Your Own */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative group cursor-pointer h-full"
                    >
                        <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all duration-500" />
                        <div className="relative h-full bg-gradient-to-br from-gray-900 to-black border border-dashed border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center group-hover:border-white/20 transition-colors">
                            <Code className="w-12 h-12 text-gray-600 mb-4 group-hover:text-white transition-colors" />
                            <h3 className="text-xl font-bold text-gray-500 mb-2 font-mono tracking-tight group-hover:text-white transition-colors">Build The Unknown</h3>
                            <p className="text-gray-600 text-sm max-w-xs group-hover:text-gray-400 transition-colors">
                                The SDK is open. The circuits are verified. What will you build in the shadows?
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
