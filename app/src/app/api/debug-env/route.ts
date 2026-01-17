import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasAshbornRelay: !!process.env.ASHBORN_RELAY_KEYPAIR,
        hasPrivacyCash: !!process.env.PRIVACYCASH_DEMO_KEYPAIR,
        hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        ashbornLength: process.env.ASHBORN_RELAY_KEYPAIR?.length || 0,
        privacyCashLength: process.env.PRIVACYCASH_DEMO_KEYPAIR?.length || 0,
    });
}
