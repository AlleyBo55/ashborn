'use client';

/**
 * useAshborn Hook - Shared SDK initialization for demo pages
 * 
 * Uses DYNAMIC IMPORTS from SDK sub-packages for optimal bundle splitting.
 * The SDK only loads when wallet connects.
 */

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';

// Types only - these don't bloat the bundle
type Ashborn = any;
type ShadowWire = any;
type RangeCompliance = any;
type PrivacyCashOfficial = any;

interface UseAshbornResult {
    ashborn: Ashborn | null;
    shadowWire: ShadowWire | null;
    rangeCompliance: RangeCompliance | null;
    privacyCash: PrivacyCashOfficial | null;
    isReady: boolean;
    isLoading: boolean;
}

/**
 * Custom hook for Ashborn SDK initialization with LAZY LOADING
 * 
 * Imports from SDK sub-packages for optimal tree-shaking:
 * - Core: @alleyboss/ashborn-sdk (14KB)
 * - Stealth: @alleyboss/ashborn-sdk/stealth (2.7KB)
 * - ZK: @alleyboss/ashborn-sdk/zk (5KB)
 * - Integrations: @alleyboss/ashborn-sdk/integrations (31KB)
 */
export function useAshborn(): UseAshbornResult {
    const { connection } = useConnection();
    const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();

    const [ashborn, setAshborn] = useState<Ashborn | null>(null);
    const [shadowWire, setShadowWire] = useState<ShadowWire | null>(null);
    const [rangeCompliance, setRangeCompliance] = useState<RangeCompliance | null>(null);
    const [privacyCash, setPrivacyCash] = useState<PrivacyCashOfficial | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
            setAshborn(null);
            setShadowWire(null);
            setRangeCompliance(null);
            setPrivacyCash(null);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        // Dynamic imports from sub-packages for optimal bundle splitting
        Promise.all([
            import('@alleyboss/ashborn-sdk'),
            import('@alleyboss/ashborn-sdk/stealth'),
            import('@alleyboss/ashborn-sdk/zk'),
            import('@alleyboss/ashborn-sdk/integrations'),
        ]).then(([Core, Stealth, ZK, Integrations]) => {
            if (cancelled) return;

            try {
                const wallet = {
                    publicKey,
                    signTransaction,
                    signAllTransactions,
                    payer: Keypair.generate(),
                };

                const ashbornInstance = new Core.Ashborn(connection, wallet, {});
                const shadowWireInstance = new Stealth.ShadowWire(connection, wallet);
                const rangeComplianceInstance = ZK.createRangeCompliance(connection, { publicKey });
                const privacyCashInstance = new Integrations.PrivacyCashOfficial({
                    rpcUrl: connection.rpcEndpoint,
                    owner: Keypair.generate(),
                });

                setAshborn(ashbornInstance);
                setShadowWire(shadowWireInstance);
                setRangeCompliance(rangeComplianceInstance);
                setPrivacyCash(privacyCashInstance);
            } catch (error) {
                console.error('Failed to initialize Ashborn SDK:', error);
            } finally {
                setIsLoading(false);
            }
        }).catch((error) => {
            console.error('Failed to load Ashborn SDK:', error);
            setIsLoading(false);
        });

        return () => { cancelled = true; };
    }, [connection, publicKey, signTransaction, signAllTransactions, connected]);

    return {
        ashborn,
        shadowWire,
        rangeCompliance,
        privacyCash,
        isReady: connected && !!ashborn && !isLoading,
        isLoading,
    };
}

/**
 * Solscan devnet explorer URL helper
 */
export function getSolscanUrl(signature: string): string {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
}

/**
 * SOL Native Mint constant
 */
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
