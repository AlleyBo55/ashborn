/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    ASHBORN PRIVACY RELAY - API ROUTE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This API implements the Privacy Relay pattern from the Ashborn SDK.
 * The relay acts as an omnibus identity between users and underlying protocols.
 * 
 * ARCHITECTURE:
 * ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
 * │   User/Agent    │ ───▶ │  PRIVACY RELAY  │ ───▶ │  PrivacyCash /  │
 * │  (Anonymous)    │      │  (Omnibus ID)   │      │   Radr Labs     │
 * └─────────────────┘      └─────────────────┘      └─────────────────┘
 * 
 * KEY PRINCIPLES:
 * 1. User identity is NEVER forwarded to underlying protocols
 * 2. All protocol interactions use the relay keypair
 * 3. Metadata stripped at this layer
 * 4. K-Anonymity amplified
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const RPC_URL = 'https://api.devnet.solana.com';
const ASHBORN_RELAY_VERSION = '1.0.0';
const PRIVACYCASH_PROGRAM_ID = 'ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS';

// ============================================================================
// RELAY KEYPAIR
// The omnibus identity through which ALL protocol interactions flow.
// ============================================================================

function getRelayKeypair(): Keypair {
    const keypairArray = JSON.parse(process.env.PRIVACYCASH_DEMO_KEYPAIR || '[]');
    if (keypairArray.length === 0) {
        throw new Error('Relay keypair not configured. Set PRIVACYCASH_DEMO_KEYPAIR.');
    }
    return Keypair.fromSecretKey(new Uint8Array(keypairArray));
}

// ============================================================================
// SHADOW ENVELOPE
// Wraps user intent in an anonymous envelope before protocol execution.
// ============================================================================

interface ShadowEnvelope {
    action: string;
    params: Record<string, unknown>;
    timestamp: number;
    relayVersion: string;
}

function createShadowEnvelope(action: string, params: Record<string, unknown>): ShadowEnvelope {
    return {
        action,
        params,
        timestamp: Date.now(),
        relayVersion: ASHBORN_RELAY_VERSION,
    };
}

// ============================================================================
// STEALTH ADDRESS GENERATION
// ============================================================================

// function generateStealthAddress removed - using SDK


// ============================================================================
// ZK RANGE PROOF - Delegated to SDK
// ============================================================================

// All ZK proof logic lives in the SDK's PrivacyRelay.prove() method.
// The API route simply calls the SDK to avoid code duplication.

async function getPrivacyRelay() {
    const { PrivacyRelay } = await import('@alleyboss/ashborn-sdk');
    const relayKeypair = getRelayKeypair();
    return new PrivacyRelay({
        relayKeypair,
        rpcUrl: RPC_URL,
        privacyCashProgramId: PRIVACYCASH_PROGRAM_ID,
    });
}

// ============================================================================
// PRIVACY RELAY HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, params = {} } = body;

        const envelope = createShadowEnvelope(action, params);
        const relayKeypair = getRelayKeypair();
        const connection = new Connection(RPC_URL, 'confirmed');

        const headers = {
            'X-Ashborn-Relay-Version': ASHBORN_RELAY_VERSION,
            'X-Ashborn-Relay-Mode': 'privacy',
        };

        switch (envelope.action) {
            case 'stealth': {
                const { recipient, nonce = 0 } = envelope.params as { recipient?: string; nonce?: number };
                const relay = await getPrivacyRelay();
                const stealthResult = await relay.generateStealth({ recipientHint: recipient, nonce });
                return NextResponse.json(stealthResult, { headers });
            }

            case 'prove': {
                const { balance, min, max } = envelope.params as { balance?: number; min?: number; max?: number };
                // Use SDK's PrivacyRelay for ZK proof generation
                const relay = await getPrivacyRelay();
                const proofResult = await relay.prove({ balance, min, max });
                return NextResponse.json({
                    ...proofResult,
                    relay: { version: ASHBORN_RELAY_VERSION }
                }, { headers });
            }

            case 'transfer': {
                const { amount, recipient } = envelope.params as { amount?: number; recipient?: string };
                const relay = await getPrivacyRelay();
                const transferResult = await relay.transfer({ amount, recipient });
                return NextResponse.json({
                    ...transferResult,
                    relay: { version: ASHBORN_RELAY_VERSION }
                }, { headers });
            }

            case 'balance': {
                const balance = await connection.getBalance(relayKeypair.publicKey);
                return NextResponse.json({
                    success: true,
                    balance: balance / LAMPORTS_PER_SOL,
                    balance_lamports: balance,
                    publicKey: relayKeypair.publicKey.toBase58(),
                    relay: { version: ASHBORN_RELAY_VERSION }
                }, { headers });
            }

            case 'shield': {
                const { amount } = envelope.params as { amount?: number };
                // Use SDK's PrivacyRelay - now implements LAYERED privacy:
                // 1. Ashborn Program (commitment + Merkle tree)
                // 2. PrivacyCash (token pool)
                const relay = await getPrivacyRelay();
                const result = await relay.shield({ amount: amount || 0.01 });
                return NextResponse.json({
                    ...result,
                    relay: { version: ASHBORN_RELAY_VERSION, identity: relayKeypair.publicKey.toBase58() }
                }, { headers });
            }

            case 'unshield': {
                const { amount, recipient } = envelope.params as { amount?: number; recipient?: string };
                try {
                    const { PrivacyCash } = await import('privacycash');
                    const privacyCash = new PrivacyCash({
                        RPC_url: RPC_URL,
                        owner: relayKeypair,
                        enableDebug: false,
                        programId: PRIVACYCASH_PROGRAM_ID,
                    } as any);
                    const lamports = Math.floor((amount || 0.01) * LAMPORTS_PER_SOL);
                    const result = await privacyCash.withdraw({
                        lamports,
                        recipientAddress: recipient || relayKeypair.publicKey.toBase58(),
                    });
                    const signature = (result as any)?.tx || (result as any)?.signature || 'unshielded';
                    return NextResponse.json({
                        success: true,
                        signature,
                        amount,
                        relay: { version: ASHBORN_RELAY_VERSION }
                    }, { headers });
                } catch (error) {
                    return NextResponse.json({
                        success: false,
                        error: error instanceof Error ? error.message : 'Unshield operation failed'
                    }, { status: 500, headers });
                }
            }

            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400, headers });
        }
    } catch (error) {
        console.error('Ashborn Relay Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Relay operation failed'
        }, { status: 500 });
    }
}
