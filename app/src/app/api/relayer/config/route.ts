import { NextResponse } from 'next/server';

export async function GET() {
    console.log('🔧 [Config] Endpoint called');
    const config = {
        withdraw_fee_rate: "0",
        withdraw_rent_fee: "0",
        relayer_fee: "0",
        min_withdrawal: "1000000",
        max_withdrawal: "10000000000"
    };
    
    console.log('📤 [Config] Returning:', config);
    
    return NextResponse.json(config, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
