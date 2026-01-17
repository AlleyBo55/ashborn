import { NextRequest, NextResponse } from 'next/server';
import { createPayingAgent } from '@alleyboss/micropay-solana-x402-paywall/agent';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Helper to get Relay Keypair (Acts as the "Architect's Wallet")
function getArchitectKeypair(): Keypair {
    const keypairEnv = process.env.ASHBORN_RELAY_KEYPAIR;
    if (!keypairEnv) {
        throw new Error('ASHBORN_RELAY_KEYPAIR not configured in environment');
    }
    const secretKey = new Uint8Array(JSON.parse(keypairEnv));
    return Keypair.fromSecretKey(secretKey);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, context } = body;

        console.log('[ShadowArchitect] Received request to fetch wisdom');

        // 1. Initialize the Paying Agent (The "Architect")
        const keypair = getArchitectKeypair();
        const privateKey = bs58.encode(keypair.secretKey);

        const agent = createPayingAgent(privateKey, {
            network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
            maxPaymentPerRequest: BigInt(50_000_000), // 0.05 SOL limit (Cost is ~0.025)
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
        });

        console.log(`[ShadowArchitect] Agent initialized: ${agent.publicKey}`);

        // 2. Prepare the target URL (The "Tower" Oracle)
        // Resolve host dynamically to ensure server-to-server communication works
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
        const TARGET_URL = `${protocol}://${host}/api/agent`;

        console.log(`[ShadowArchitect] Target URL: ${TARGET_URL}`);

        // 3. Make the Paid Request
        // We're asking the Tower for the final wisdom.
        // We pass 'requirePayment: true' to trigger the 402 middleware on the target.
        const payload = {
            message: message || "Analyze the nature of consciousness.",
            systemPrompt: `You are Tower of Trials. The Architect has paid. Deliver the final wisdom.
            Context: ${context || 'No context provided.'}
            
            Return strictly JSON: { "reply": "your detailed markdown response" }`,
            temperature: 0.9,
            requirePayment: true // This triggers the 402 on the other side
        };

        console.log('[ShadowArchitect] Sending request to Tower...');

        // The agent.post() method automatically handles:
        // - Sending request
        // - Catching 402 Payment Required
        // - constructing payment transaction
        // - signing and sending
        // - retrying original request with headers
        const response = await agent.post(TARGET_URL, payload);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[ShadowArchitect] Request failed: ${response.status} ${errorText}`);
            return NextResponse.json({ error: `Tower refused connection: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        console.log('[ShadowArchitect] Wisdom received successfully');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('[ShadowArchitect] Execution failed:', error);
        return NextResponse.json({ 
            error: error.message || 'Internal Agent Error',
            details: error.toString()
        }, { status: 500 });
    }
}
