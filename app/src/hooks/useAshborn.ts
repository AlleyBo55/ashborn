'use client';

/**
 * useAshborn Hook - Shared SDK initialization for demo pages
 * 
 * Uses DYNAMIC IMPORTS from SDK sub-packages via AshbornContext.
 * The SDK is initialized globally in AshbornProvider to prevent re-loading on navigation.
 */

import { useAshbornContext } from '@/context/AshbornContext';

/**
 * useAshborn Hook - Consumes the Global Ashborn Context
 * 
 * The heavy lifting of dynamic imports is now done in AshbornProvider (layout level).
 * This hook is now lightweight and won't trigger re-imports on navigation.
 */
export function useAshborn() {
    return useAshbornContext();
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
