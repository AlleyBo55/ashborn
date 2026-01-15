'use client';

/**
 * useAshborn Hook - Shared SDK initialization for demo pages
 * 
 * Provides initialized Ashborn, ShadowWire, and RangeCompliance instances
 * connected to the user's wallet on Solana devnet.
 */

import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import {
    Ashborn,
    ShadowWire,
    RangeCompliance,
    PrivacyCashOfficial,
    createRangeCompliance,
} from '@alleyboss/ashborn-sdk';

interface UseAshbornResult {
    ashborn: Ashborn | null;
    shadowWire: ShadowWire | null;
    rangeCompliance: RangeCompliance | null;
    privacyCash: PrivacyCashOfficial | null;
    isReady: boolean;
}

/**
 * Custom hook for Ashborn SDK initialization
 * 
 * Usage:
 * ```tsx
 * const { ashborn, shadowWire, rangeCompliance, privacyCash, isReady } = useAshborn();
 * 
 * if (isReady && ashborn) {
 *   await ashborn.shield({ amount: 1_000_000_000n, mint: SOL_MINT });
 * }
 * ```
 */
export function useAshborn(): UseAshbornResult {
    const { connection } = useConnection();
    const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();

    const { ashborn, shadowWire, rangeCompliance, privacyCash } = useMemo(() => {
        if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
            return { ashborn: null, shadowWire: null, rangeCompliance: null, privacyCash: null };
        }

        // Create a wallet adapter compatible with Anchor's Wallet interface
        const wallet: Wallet = {
            publicKey,
            signTransaction,
            signAllTransactions,
            payer: Keypair.generate(), // Placeholder - not used for signing
        };

        try {
            const ashbornInstance = new Ashborn(connection, wallet, {
                programId: new PublicKey('ASHByNYwKq8NJFgLbQPePnM4hmg57rPyMY1cFk44bpW8'), // Devnet program
            });

            const shadowWireInstance = new ShadowWire(connection, wallet);
            const rangeComplianceInstance = createRangeCompliance(connection, {
                publicKey,
            });

            // Initialize PrivacyCashOfficial adapter
            const privacyCashInstance = new PrivacyCashOfficial({
                rpcUrl: connection.rpcEndpoint,
                owner: Keypair.generate() // PrivacyCash usually requires a keypair for owner, but we use adapter for public methods
            });

            return {
                ashborn: ashbornInstance,
                shadowWire: shadowWireInstance,
                rangeCompliance: rangeComplianceInstance,
                privacyCash: privacyCashInstance,
            };
        } catch (error) {
            console.error('Failed to initialize Ashborn SDK:', error);
            return { ashborn: null, shadowWire: null, rangeCompliance: null, privacyCash: null };
        }
    }, [connection, publicKey, signTransaction, signAllTransactions, connected]);

    return {
        ashborn,
        shadowWire,
        rangeCompliance,
        privacyCash,
        isReady: connected && !!ashborn,
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
