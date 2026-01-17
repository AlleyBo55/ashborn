
import { NextRequest, NextResponse } from 'next/server';
import BN from 'bn.js';

export async function GET(request: NextRequest) {
    try {
        console.log('🔄 [Relayer] Mocking Merkle Root...');

        // Mock Data to unblock SDK
        // In a real scenario, we would read the actual on-chain account data.
        // For Devnet Demo: We provide a compatible format so the SDK proceeds to proof generation.

        // Root: 32 bytes hex string
        const root = new BN(0).toString(16).padStart(64, '0');

        // Next Index: Arbitrary number (e.g., 0 for fresh tree)
        const nextIndex = 0;

        return NextResponse.json({
            root: root,
            nextIndex: nextIndex
        });

    } catch (error) {
        console.error('🚨 [Relayer] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
