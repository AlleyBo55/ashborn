import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    console.log(`🔄 [Relayer] Mocking UTXO range ${start}-${end}...`);

    // Mock empty UTXO set for devnet demo
    return NextResponse.json([]);
}
