'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';

// Types only - these don't bloat the bundle
type Ashborn = any;
type ShadowWire = any;
type RangeCompliance = any;
type PrivacyCashOfficial = any;

interface AshbornContextType {
    ashborn: Ashborn | null;
    shadowWire: ShadowWire | null;
    rangeCompliance: RangeCompliance | null;
    privacyCash: PrivacyCashOfficial | null;
    isReady: boolean;
    isLoading: boolean;
}

const AshbornContext = createContext<AshbornContextType>({
    ashborn: null,
    shadowWire: null,
    rangeCompliance: null,
    privacyCash: null,
    isReady: false,
    isLoading: false,
});

export function AshbornProvider({ children }: { children: ReactNode }) {
    const { connection } = useConnection();
    // We only need basic wallet info to init the SDK. 
    // If signTransaction/publicKey change, we might want to re-init OR just let the SDK hold the reference if it's dynamic.
    // The current SDK seems to take 'wallet' object.
    const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();

    const [ashborn, setAshborn] = useState<Ashborn | null>(null);
    const [shadowWire, setShadowWire] = useState<ShadowWire | null>(null);
    const [rangeCompliance, setRangeCompliance] = useState<RangeCompliance | null>(null);
    const [privacyCash, setPrivacyCash] = useState<PrivacyCashOfficial | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If not connected, we can't fully init SDK (needs wallet).
        // OR we could init read-only parts?
        // Current logic: clear if not connected.
        if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
            setAshborn(null);
            setShadowWire(null);
            setRangeCompliance(null);
            setPrivacyCash(null);
            return;
        }

        let cancelled = false;

        // Optimize: If we already have SDK and wallet/connection haven't changed meaningfully, skip.
        // But wallet adapter object refs might change.
        // For now, simpler is safer: re-create if wallet/connection changes.
        // Since this is in Provider (Layout level), it won't unmount on page nav.
        // It ONLY re-runs if wallet disconnects/reconnects or changes account.

        setIsLoading(true);

        // Prepare wallet adapter interface
        const walletAdapter = {
            publicKey,
            signTransaction,
            signAllTransactions,
            // This is just a dummy payer for the Wallet Adapter interface required by the SDK.
            // It is NOT used for Stealth Address keys (which use ed25519/ECDH).
            payer: Keypair.generate(),
        };

        // 1. Load Core (Priority 1)
        import('@alleyboss/ashborn-sdk').then((Core) => {
            if (cancelled) return;
            try {
                const instance = new Core.Ashborn(connection, walletAdapter, {});
                setAshborn(instance);
            } catch (e) {
                console.error('Failed to init Core SDK', e);
            } finally {
                // We consider "loading" done when Core is ready for basic interactions
                setIsLoading(false);
            }
        });

        // 2. Load Stealth (Priority 1 - Parallel)
        import('@alleyboss/ashborn-sdk/stealth').then((Stealth) => {
            if (cancelled) return;
            try {
                const instance = new Stealth.ShadowWire(connection, walletAdapter);
                setShadowWire(instance);
            } catch (e) {
                console.error('Failed to init Stealth SDK', e);
            }
        });

        // 3. Load ZK (Priority 2 - Background)
        import('@alleyboss/ashborn-sdk/zk').then((ZK) => {
            if (cancelled) return;
            try {
                const instance = ZK.createRangeCompliance(connection, { publicKey });
                setRangeCompliance(instance);
            } catch (e) {
                console.error('Failed to init ZK SDK', e);
            }
        });

        // 4. Load Integrations (Priority 2 - Background)
        import('@alleyboss/ashborn-sdk/integrations').then((Integrations) => {
            if (cancelled) return;
            try {
                const instance = new Integrations.PrivacyCashOfficial({
                    rpcUrl: connection.rpcEndpoint,
                    owner: Keypair.generate(),
                });
                setPrivacyCash(instance);
            } catch (e) {
                console.error('Failed to init Integrations SDK', e);
            }
        });

        return () => { cancelled = true; };
    }, [connection, publicKey, signTransaction, signAllTransactions, connected]);

    return (
        <AshbornContext.Provider value={{
            ashborn,
            shadowWire,
            rangeCompliance,
            privacyCash,
            isReady: connected && !!ashborn && !isLoading,
            isLoading
        }}>
            {children}
        </AshbornContext.Provider>
    );
}

export function useAshbornContext() {
    return useContext(AshbornContext);
}
