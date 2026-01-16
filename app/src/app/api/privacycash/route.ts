import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';

const PRIVACYCASH_PROGRAM_ID = 'ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS';

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();

    // Create a streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const { action, amount, recipient } = await request.json();

                // Get keypair from environment
                const keypairArray = JSON.parse(process.env.PRIVACYCASH_DEMO_KEYPAIR || '[]');
                if (keypairArray.length === 0) {
                    send({ type: 'error', error: 'Demo keypair not configured' });
                    controller.close();
                    return;
                }

                const demoKeypair = Keypair.fromSecretKey(new Uint8Array(keypairArray));

                // Dynamically import PrivacyCash SDK
                const { PrivacyCash } = await import('privacycash');

                const privacyCash = new PrivacyCash({
                    RPC_url: 'https://api.devnet.solana.com',
                    owner: new Uint8Array(keypairArray),
                    enableDebug: false, // We'll handle logging manually
                    programId: PRIVACYCASH_PROGRAM_ID,
                } as any);

                // Hook into logger for streaming updates
                privacyCash.setLogger((level: string, message: string) => {
                    if (level === 'info') {
                        send({ type: 'log', message });
                    } else if (level === 'error') {
                        send({ type: 'error', error: message });
                    }
                });

                if (action === 'shield') {
                    const lamports = Math.floor(amount * 1_000_000_000);
                    send({ type: 'log', message: `Initiating shield of ${(amount).toFixed(4)} SOL...` });

                    const result = await privacyCash.deposit({ lamports });

                    const signature = (result as { tx?: string; signature?: string })?.tx
                        || (result as { tx?: string; signature?: string })?.signature
                        || 'deposited';

                    send({
                        type: 'result',
                        signature,
                        publicKey: demoKeypair.publicKey.toBase58()
                    });
                } else if (action === 'unshield') {
                    const lamports = Math.floor(amount * 1_000_000_000);
                    send({ type: 'log', message: `Initiating unshield of ${(amount).toFixed(4)} SOL...` });

                    const result = await privacyCash.withdraw({
                        lamports,
                        recipientAddress: recipient,
                    });

                    const signature = (result as { tx?: string; signature?: string })?.tx
                        || (result as { tx?: string; signature?: string })?.signature
                        || 'withdrawn';

                    send({
                        type: 'result',
                        signature,
                        amount_in_lamports: (result as { amount_in_lamports?: number }).amount_in_lamports,
                        fee_in_lamports: (result as { fee_in_lamports?: number }).fee_in_lamports,
                    });
                } else if (action === 'balance') {
                    // For balance, we just fetch it, maybe log "fetching..."
                    send({ type: 'log', message: 'Syncing private balance...' });
                    const balance = await privacyCash.getPrivateBalance();
                    send({
                        type: 'result',
                        balance: balance.toString(),
                        publicKey: demoKeypair.publicKey.toBase58()
                    });
                } else {
                    send({ type: 'error', error: 'Invalid action' });
                }

            } catch (error) {
                console.error('PrivacyCash API error:', error);
                send({
                    type: 'error',
                    error: error instanceof Error ? error.message : 'Operation failed'
                });
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
