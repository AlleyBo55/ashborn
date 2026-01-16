import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';

const PRIVACYCASH_PROGRAM_ID = 'ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS';

export async function POST(request: NextRequest) {
    try {
        const { action, amount, recipient } = await request.json();

        // Get keypair from environment (server-side only - never exposed to client)
        const keypairArray = JSON.parse(process.env.PRIVACYCASH_DEMO_KEYPAIR || '[]');
        if (keypairArray.length === 0) {
            return NextResponse.json({ error: 'Demo keypair not configured' }, { status: 500 });
        }

        const demoKeypair = Keypair.fromSecretKey(new Uint8Array(keypairArray));

        // Dynamically import PrivacyCash SDK (server-side only)
        const { PrivacyCash } = await import('privacycash');

        // Use type assertion to pass programId (SDK supports it at runtime)
        const privacyCash = new PrivacyCash({
            RPC_url: 'https://api.devnet.solana.com',
            owner: demoKeypair,
            enableDebug: false,
            programId: PRIVACYCASH_PROGRAM_ID,
        } as any);

        if (action === 'shield') {
            const lamports = Math.floor(amount * 1_000_000_000);
            const result = await privacyCash.deposit({ lamports });
            // SDK returns { tx: string } or similar - extract whatever transaction ID is available
            const signature = (result as { tx?: string; signature?: string })?.tx
                || (result as { tx?: string; signature?: string })?.signature
                || 'deposited';
            return NextResponse.json({
                success: true,
                signature,
                publicKey: demoKeypair.publicKey.toBase58()
            });
        }

        if (action === 'unshield') {
            const lamports = Math.floor(amount * 1_000_000_000);
            const result = await privacyCash.withdraw({
                lamports,
                recipientAddress: recipient,
            });
            const signature = (result as { tx?: string; signature?: string })?.tx
                || (result as { tx?: string; signature?: string })?.signature
                || 'withdrawn';
            return NextResponse.json({
                success: true,
                signature,
                amount_in_lamports: (result as { amount_in_lamports?: number }).amount_in_lamports,
                fee_in_lamports: (result as { fee_in_lamports?: number }).fee_in_lamports,
            });
        }

        if (action === 'balance') {
            const balance = await privacyCash.getPrivateBalance();
            return NextResponse.json({
                success: true,
                balance: balance.toString(),
                publicKey: demoKeypair.publicKey.toBase58()
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('PrivacyCash API error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Operation failed'
        }, { status: 500 });
    }
}
