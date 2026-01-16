'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';

const generateTx = () => ({
    id: Math.random().toString(36).substr(2, 9),
    amount: (Math.random() * 1000).toFixed(2),
    time: "JUST NOW"
});

export default function ProtectionFeed() {
    const [txs, setTxs] = useState([generateTx()]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTxs(prev => [generateTx(), ...prev.slice(0, 2)]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-4 left-4 md:left-8 z-50 pointer-events-none">
            <div className="flex flex-col gap-2">
                <div className="text-[10px] font-mono text-purple-400 tracking-widest mb-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    LIVE_PROTECTION_FEED
                </div>
                <AnimatePresence>
                    {txs.map((tx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-black/60 backdrop-blur-md border-l-2 border-green-500 pl-3 py-1 w-64"
                        >
                            <div className="flex justify-between items-center text-xs font-mono text-white">
                                <span className="text-gray-400">SHIELDED</span>
                                <span className="font-bold text-green-400">{tx.amount} SOL</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                                <span>TX: {tx.id}***</span>
                                <span>{tx.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
