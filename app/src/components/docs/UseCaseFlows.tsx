'use client';

import { Shield02Icon, ViewOffIcon, AiChat02Icon } from 'hugeicons-react';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';

export default function UseCaseFlows() {
    return (
        <div className="space-y-12">
            {/* Ashborn Direct Flow */}
            <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <ViewOffIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">A. Ashborn Direct (Single Layer)</h4>
                        <p className="text-xs text-purple-400 font-mono">Ashborn Only Mode</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="Relay Deposit" detail="Wallet → Relay" desc="Decouples sender from tx" color="purple" />
                    <FlowStep num="02" label="Stealth Gen" detail="ECDH Derivation" desc="Unique address calculation" color="purple" />
                    <FlowStep num="03" label="ZK Proof" detail="Groth16 Range" desc="Proves solvency privately" color="purple" />
                    <FlowStep num="04" label="Direct Transfer" detail="Relay → Recipient" desc="Funds sent to stealth addr" color="green" final />
                </div>
            </div>

            {/* Dual Privacy Flow */}
            <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Shield02Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">B. Dual Privacy (Full Demo)</h4>
                        <p className="text-xs text-blue-400 font-mono">Ashborn + PrivacyCash</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="Ashborn Layer" detail="Stealth + ZK" desc="Executes Layer 1 privacy" color="purple" />
                    <FlowStep num="02" label="Shielding" detail="Relay → Pool" desc="Funds enter mixing pool" color="blue" />
                    <FlowStep num="03" label="Mixing" detail="Poseidon Hash" desc="Cryptographic disconnect" color="blue" />
                    <FlowStep num="04" label="Unshield" detail="Pool → Recipient" desc="Clean funds delivered" color="green" final />
                </div>
            </div>

            {/* AI Commerce Flow */}
            <div className="border-l-4 border-red-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AiChat02Icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">C. AI Agent Commerce</h4>
                        <p className="text-xs text-red-400 font-mono">x402 Negotiation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="Negotiation" detail="LLM Arbitrage" desc="Agents agree on price" color="red" />
                    <FlowStep num="02" label="Payment Lock" detail="x402 Gateway" desc="Content gated by payment" color="red" />
                    <FlowStep num="03" label="Execution" detail="Run Flow A or B" desc="Privacy layer executes" color="red" />
                    <FlowStep num="04" label="Delivery" detail="Insight Unlocked" desc="Agent receives data" color="green" final />
                </div>
            </div>
        </div>
    );
}

function FlowStep({ num, label, detail, desc, color, final }: {
    num: string;
    label: string;
    detail: string;
    desc: string;
    color: 'blue' | 'purple' | 'red' | 'green';
    final?: boolean;
}) {
    const colors = {
        blue: 'border-blue-500/30 bg-blue-950/20',
        purple: 'border-purple-500/30 bg-purple-950/20',
        red: 'border-red-500/30 bg-red-950/20',
        green: 'border-green-500/30 bg-green-950/20'
    };

    const badgeColors = {
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        red: 'bg-red-500 text-white',
        green: 'bg-green-500 text-white'
    };

    const textColors = {
        blue: 'text-blue-300',
        purple: 'text-purple-300',
        red: 'text-red-300',
        green: 'text-green-300'
    };

    return (
        <div className="relative group">
            <div className={`relative h-full p-5 rounded-xl border ${colors[color]} transition-all hover:border-opacity-60`}>
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full ${badgeColors[color]} flex items-center justify-center text-xs font-bold shadow-lg`}>
                    {num}
                </div>

                <div className="space-y-3 mt-2">
                    <div className={`font-mono text-xs uppercase tracking-wider ${textColors[color]}`}>{label}</div>
                    <div className="font-mono text-sm bg-black/60 px-2 py-1.5 rounded border border-white/10 text-white">{detail}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                </div>
            </div>

            {!final && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight01Icon className="w-4 h-4 text-gray-600" />
                </div>
            )}
        </div>
    );
}
