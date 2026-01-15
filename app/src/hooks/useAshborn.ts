'use client';

/**
 * useAshborn Hook - Shared SDK initialization for demo pages
 * 
 * Uses DYNAMIC IMPORTS to lazy-load the heavy SDK only when wallet connects.
 * This dramatically reduces initial bundle size and improves navigation speed.
 */

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';

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
 * The SDK is only loaded when the wallet connects, reducing initial bundle by ~500KB+
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
        // Only load SDK when wallet is connected
        if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
            setAshborn(null);
            setShadowWire(null);
            setRangeCompliance(null);
            setPrivacyCash(null);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        // Dynamic import - SDK loads only now!
        import('@alleyboss/ashborn-sdk').then((SDK) => {
            if (cancelled) return;

            try {
                const wallet = {
                    publicKey,
                    signTransaction,
                    signAllTransactions,
                    payer: Keypair.generate(),
                };

                const ashbornInstance = new SDK.Ashborn(connection, wallet, {});
                const shadowWireInstance = new SDK.ShadowWire(connection, wallet);
                const rangeComplianceInstance = SDK.createRangeCompliance(connection, { publicKey });
                const privacyCashInstance = new SDK.PrivacyCashOfficial({
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

        return () => {
            cancelled = true;
        };
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
