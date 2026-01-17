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
 * │  (Anonymous)    │      │  (Omnibus ID)   │      │   Recipient     │
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
// RELAY KEYPAIRS
// Two separate keypairs for clear architectural separation:
// 1. ASHBORN_RELAY_KEYPAIR: Receives user funds, acts as privacy layer
// 2. PRIVACYCASH_DEMO_KEYPAIR: Interacts with PrivacyCash protocol
// ============================================================================

function getAshbornRelayKeypair(): Keypair {
    const keypairArray = JSON.parse(process.env.ASHBORN_RELAY_KEYPAIR || '[]');
    if (keypairArray.length === 0) {
        throw new Error('Ashborn relay keypair not configured. Set ASHBORN_RELAY_KEYPAIR.');
    }
    return Keypair.fromSecretKey(new Uint8Array(keypairArray));
}

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
            case 'relay-address': {
                // Return Ashborn Relay address for user deposits
                const ashbornRelay = getAshbornRelayKeypair();
                return NextResponse.json({
                    success: true,
                    relayAddress: ashbornRelay.publicKey.toBase58(),
                    relay: { version: ASHBORN_RELAY_VERSION }
                }, { headers });
            }

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
                // Direct SOL transfer for Ashborn-only mode (no PrivacyCash)
                const { amount, recipient } = envelope.params as { amount?: number; recipient?: string };
                if (!recipient) {
                    return NextResponse.json({ success: false, error: 'Recipient address required' }, { headers, status: 400 });
                }

                const transferAmount = amount || 0.01;
                const lamports = Math.floor(transferAmount * LAMPORTS_PER_SOL);
                const ashbornRelay = getAshbornRelayKeypair();

                // Check relay balance
                const relayBalance = await connection.getBalance(ashbornRelay.publicKey);
                if (relayBalance < lamports + 5000) { // 5000 lamports for fees
                    return NextResponse.json({
                        success: false,
                        error: `Insufficient relay balance: ${relayBalance / LAMPORTS_PER_SOL} SOL`,
                        simulated: true
                    }, { headers });
                }

                // Import necessary modules for transfer
                const { Transaction, SystemProgram, PublicKey } = await import('@solana/web3.js');

                // Create transfer transaction
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: ashbornRelay.publicKey,
                        toPubkey: new PublicKey(recipient),
                        lamports
                    })
                );

                const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = ashbornRelay.publicKey;

                // Sign and send
                transaction.sign(ashbornRelay);
                const signature = await connection.sendRawTransaction(transaction.serialize());
                await connection.confirmTransaction(signature, 'confirmed');

                return NextResponse.json({
                    success: true,
                    signature,
                    amount: transferAmount,
                    from: ashbornRelay.publicKey.toBase58(),
                    to: recipient,
                    relay: { version: ASHBORN_RELAY_VERSION }
                }, { headers });
            }

            case 'balance': {
                const ashbornRelay = getAshbornRelayKeypair();
                const privacyCashWallet = getRelayKeypair();
                const relayBalance = await connection.getBalance(ashbornRelay.publicKey);
                const privacyCashBalance = await connection.getBalance(privacyCashWallet.publicKey);
                return NextResponse.json({
                    success: true,
                    relay: {
                        address: ashbornRelay.publicKey.toBase58(),
                        balance: relayBalance / LAMPORTS_PER_SOL,
                        balance_lamports: relayBalance
                    },
                    privacyCash: {
                        address: privacyCashWallet.publicKey.toBase58(),
                        balance: privacyCashBalance / LAMPORTS_PER_SOL,
                        balance_lamports: privacyCashBalance
                    },
                    version: ASHBORN_RELAY_VERSION
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
