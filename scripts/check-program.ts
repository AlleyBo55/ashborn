
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const PROGRAM_ID = 'ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS';

async function main() {
    console.log(`🔗 Connecting to ${RPC_URL}...`);
    const connection = new Connection(RPC_URL, 'confirmed');

    console.log(`🔍 Checking for Program: ${PROGRAM_ID}...`);
    try {
        const info = await connection.getAccountInfo(new PublicKey(PROGRAM_ID));
        if (info) {
            console.log('✅ Program FOUND on Devnet!');
            console.log(`   Executable: ${info.executable}`);
        } else {
            console.error('❌ Program NOT FOUND on Devnet.');
        }
    } catch (err) {
        console.error('🚨 Error fetching program:', err);
    }
}

main();
