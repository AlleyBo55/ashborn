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

        let data;
        const contentType = response.headers.get('content-type');

        // Handle SSE Stream (Real API Mode)
        if (contentType && contentType.includes('text/event-stream')) {
            console.log('[ShadowArchitect] Upstream returned stream, parsing...');
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n\n');
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('data: ')) {
                            const d = trimmed.slice(6);
                            if (d === '[DONE]') break;
                            try {
                                const j = JSON.parse(d);
                                if (j.text) fullText += j.text;
                            } catch { }
                        }
                    }
                }
            }

            // Extract thinking and reply
            let thought = '';
            let reply = fullText;
            const thinkMatch = fullText.match(/<thinking>([\s\S]*?)<\/thinking>/);
            if (thinkMatch) {
                thought = thinkMatch[1].trim();
                reply = fullText.replace(thinkMatch[0], '').trim();
            }

            try {
                // Try to find JSON in reply
                const jsonMatch = reply.match(/(\{[\s\S]*\})/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[1]);
                } else {
                    data = JSON.parse(reply);
                }
                // Merge thinking back if needed
                if (thought) data.thought = thought;
            } catch {
                data = { reply: reply, thought };
            }
        } else {
            // Handle regular JSON (Mock Mode)
            data = await response.json();
        }

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
