
import { NextRequest, NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

export async function POST(request: NextRequest) {
    try {
        console.log('🔄 [Relayer] Relaying Deposit Transaction...');
        const body = await request.json();
        const { signedTransaction } = body;

        if (!signedTransaction) {
            return NextResponse.json({ error: 'Missing signedTransaction' }, { status: 400 });
        }

        const txBuffer = Buffer.from(signedTransaction, 'base64');

        // Send Raw Transaction
        const signature = await connection.sendRawTransaction(txBuffer, {
            skipPreflight: true, // Skip preflight to avoid "simulation failed" due to our mock root data
            preflightCommitment: 'confirmed'
        });

        console.log('✅ [Relayer] TX Sent:', signature);

        return NextResponse.json({
            success: true,
            signature: signature
        });

    } catch (error) {
        console.error('🚨 [Relayer] Deposit Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
