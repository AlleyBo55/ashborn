'use client';

import { Shield02Icon, ViewOffIcon, AiChat02Icon } from 'hugeicons-react';
import ArrowRight01Icon from 'hugeicons-react/dist/esm/icons/arrow_right_01_icon';

export default function UseCaseFlows() {
    return (
        <div className="space-y-12">
            {/* Shield Flow */}
            <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Shield02Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">A. Shielding Assets</h4>
                        <p className="text-xs text-blue-400 font-mono">PrivacyCash Integration</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="Deposit Request" detail="ashborn.shield()" desc="User signs 1 SOL deposit" color="blue" />
                    <FlowStep num="02" label="UTXO Creation" detail="Blinding Factor" desc="Generate random noise" color="blue" />
                    <FlowStep num="03" label="Poseidon Hash" detail="ZK Commitment" desc="Create cryptographic proof" color="blue" />
                    <FlowStep num="04" label="Merkle Insert" detail="On-Chain State" desc="Encrypted note stored" color="green" final />
                </div>
            </div>

            {/* Stealth Flow */}
            <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <ViewOffIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">B. Stealth Transfer</h4>
                        <p className="text-xs text-purple-400 font-mono">Shadow Agent Protocol</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="Negotiation" detail="Meta-Address" desc="Exchange spend/view keys" color="purple" />
                    <FlowStep num="02" label="ECDH Secret" detail="Priv A × Pub B" desc="Derive shared secret (S)" color="purple" />
                    <FlowStep num="03" label="Derivation" detail="P = H(S)G + B" desc="Generate stealth address" color="purple" />
                    <FlowStep num="04" label="Transfer" detail="Unlinkable" desc="Anonymous on-chain tx" color="green" final />
                </div>
            </div>

            {/* AI Payment Flow */}
            <div className="border-l-4 border-red-500 pl-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AiChat02Icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">C. AI Payment</h4>
                        <p className="text-xs text-red-400 font-mono">x402 + ZK Groth16</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FlowStep num="01" label="402 Required" detail="HTTP 402" desc="API blocks access" color="red" />
                    <FlowStep num="02" label="Shielded Pay" detail="UTXO → API" desc="Private payment sent" color="red" />
                    <FlowStep num="03" label="Groth16 Proof" detail="ZK Verification" desc="Prove solvency privately" color="red" />
                    <FlowStep num="04" label="Resource Unlocked" detail="Access Granted" desc="API key / data returned" color="green" final />
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
