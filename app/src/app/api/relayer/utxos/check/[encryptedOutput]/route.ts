
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { encryptedOutput: string } }
) {
    console.log(`🔍 [Relayer] Checking UTXO: ${params.encryptedOutput.substring(0, 10)}...`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the UTXO data that was deposited
    return NextResponse.json({
        exists: true,
        utxo: {
            encryptedOutput: params.encryptedOutput,
            index: 0,
            spent: false
        }
    });
}
