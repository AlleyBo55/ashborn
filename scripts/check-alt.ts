
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const ALT_ADDRESS = 'FA8AfRJYQPuEtVmVpi3vBb1A7ziRCaBYkkEiRnqP7cDd';

async function main() {
    console.log(`🔗 Connecting to ${RPC_URL}...`);
    const connection = new Connection(RPC_URL, 'confirmed');

    console.log(`🔍 Checking for ALT: ${ALT_ADDRESS}...`);
    try {
        const info = await connection.getAccountInfo(new PublicKey(ALT_ADDRESS));
        if (info) {
            console.log('✅ Account FOUND!');
            console.log(`   Owner: ${info.owner.toBase58()}`);
            console.log(`   Lamports: ${info.lamports}`);
            console.log(`   Data Length: ${info.data.length} bytes`);
        } else {
            console.error('❌ Account NOT FOUND (null)');
        }
    } catch (err) {
        console.error('🚨 Error fetching account:', err);
    }
}

main();
