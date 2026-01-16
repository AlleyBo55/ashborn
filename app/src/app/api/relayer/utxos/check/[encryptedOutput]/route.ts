
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { encryptedOutput: string } }
) {
    // Mock Indexing Check
    // In a real system, we'd query the DB to see if the UTXO is indexed.
    // For this Devnet Relayer, we optimistically assume the transaction succeeded.
    // We add a small delay to simulate indexing latency.

    console.log(`🔍 [Relayer] Checking UTXO: ${params.encryptedOutput.substring(0, 10)}...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
        exists: true
    });
}
