import { NextRequest, NextResponse } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';
import OpenAI from 'openai';
import { Connection, PublicKey } from '@solana/web3.js';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configure Paywall
const { middleware } = createX402Middleware({
    price: 1000000, // 0.001 SOL (in lamports)
    wallet: new PublicKey("Hj6iK4v9xP9y9z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5"), // Demo Wallet
    rpcUrl: "https://api.devnet.solana.com",
    network: 'devnet',
    serviceName: "Ashborn AI Agent",
});

export const POST = middleware(async (req: NextRequest) => {
    try {
        const { message } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are Ashborn AI, a privacy-focused assistant for the Solana blockchain.
                    Your goal is to parse natural language intentions into specific JSON commands for the Ashborn SDK.

                    Supported Actions:
                    - ASHBORN_SHIELD: Deposit SOL into private pool. Params: amount, mint.
                    - ASHBORN_SEND: Private transfer. Params: amount, recipient (Solana address or .sol domain), private (boolean).
                    - ASHBORN_PROVE_RANGE: Generate ZK proof. Params: max (limit).
                    - ASHBORN_BALANCE: Check private balance. Params: none.
                    - ASHBORN_UNSHIELD: Withdraw. Params: amount.

                    Response Format (JSON only):
                    {
                        "action": "ACTION_NAME",
                        "params": { "key": "value" },
                        "confidence": 0.0-1.0,
                        "reply": "Friendly text response explaining what will happen."
                    }`
                },
                { role: "user", content: message }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));

    } catch (error) {
        console.error("AI Agent Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
});
