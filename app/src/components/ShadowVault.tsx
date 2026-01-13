'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Sparkles, Wallet, Clock, Hash, Plus } from 'lucide-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface VaultData {
    initialized: boolean;
    shadowBalance: number;
    noteCount: number;
    lastActivity: Date | null;
}

export function ShadowVault() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [vault, setVault] = useState<VaultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);
    const [solBalance, setSolBalance] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            if (!publicKey) return;

            setLoading(true);
            try {
                // Fetch SOL balance
                const balance = await connection.getBalance(publicKey);
                setSolBalance(balance / LAMPORTS_PER_SOL);

                // Check if vault exists (demo: simulate uninitialized)
                // In production, fetch from program
                setVault({
                    initialized: false,
                    shadowBalance: 0,
                    noteCount: 0,
                    lastActivity: null,
                });
            } catch (error) {
                console.error('Error fetching vault:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [connection, publicKey]);

    const initializeVault = async () => {
        if (!publicKey) return;

        setInitializing(true);
        try {
            // Demo: simulate vault initialization
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setVault({
                initialized: true,
                shadowBalance: 0,
                noteCount: 0,
                lastActivity: new Date(),
            });
        } catch (error) {
            console.error('Error initializing vault:', error);
        } finally {
            setInitializing(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-8">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-shadow-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-shadow-300">Loading vault...</span>
                </div>
            </div>
        );
    }

    if (!vault?.initialized) {
        return (
            <motion.div
                className="glass-card p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center mx-auto mb-6 shadow-shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">Awaken Your Shadow Vault</h2>
                <p className="text-shadow-400 mb-6 max-w-md mx-auto">
                    Initialize your personal privacy fortress. All shielded assets and private transactions flow through your vault.
                </p>

                <div className="glass-card p-4 mb-6 inline-block">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-shadow-400" />
                        <span className="text-shadow-300">Wallet Balance:</span>
                        <span className="text-white font-semibold">{solBalance.toFixed(4)} SOL</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={initializeVault}
                        disabled={initializing}
                        className="shadow-btn flex items-center gap-2 mx-auto"
                    >
                        {initializing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Awakening...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Initialize Vault
                            </>
                        )}
                    </button>
                </div>

                <p className="text-shadow-600 text-xs mt-4">
                    Costs ~0.003 SOL for account rent
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Vault overview */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-shadow-600 to-shadow-800 flex items-center justify-center shadow-shadow-md shadow-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Shadow Vault</h2>
                        <p className="text-shadow-400 text-sm">Your privacy fortress is active</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Wallet}
                        label="Shielded Balance"
                        value={`${(vault.shadowBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`}
                        subtext="Hidden from public view"
                    />
                    <StatCard
                        icon={Hash}
                        label="Shielded Notes"
                        value={vault.noteCount.toString()}
                        subtext="Active UTXOs"
                    />
                    <StatCard
                        icon={Clock}
                        label="Last Activity"
                        value={vault.lastActivity ? formatTimeAgo(vault.lastActivity) : 'Never'}
                        subtext="Most recent action"
                    />
                </div>
            </div>

            {/* Public balance */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Public Wallet</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-shadow-400" />
                        <span className="text-shadow-300">Available to Shield</span>
                    </div>
                    <span className="text-white font-semibold">{solBalance.toFixed(4)} SOL</span>
                </div>
                <p className="text-shadow-500 text-sm mt-2">
                    These funds are visible on-chain. Shield them to make them private.
                </p>
            </div>

            {/* Quick actions */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <QuickAction label="Shield SOL" emoji="🛡️" />
                    <QuickAction label="Send Private" emoji="👻" />
                    <QuickAction label="Prove Balance" emoji="✅" />
                    <QuickAction label="Unshield" emoji="🌟" />
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    subtext,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    subtext: string;
}) {
    return (
        <div className="bg-void-light rounded-xl p-4 border border-shadow-900/30">
            <div className="flex items-center gap-2 text-shadow-400 text-sm mb-2">
                <Icon className="w-4 h-4" />
                {label}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-shadow-500 text-xs">{subtext}</div>
        </div>
    );
}

function QuickAction({ label, emoji }: { label: string; emoji: string }) {
    return (
        <button className="bg-void-light hover:bg-shadow-900/50 border border-shadow-900/30 hover:border-shadow-700 rounded-xl p-4 text-center transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{emoji}</div>
            <div className="text-shadow-300 text-sm font-medium">{label}</div>
        </button>
    );
}

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
