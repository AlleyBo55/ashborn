
import {
    Connection,
    Keypair,
    PublicKey,
    AddressLookupTableProgram,
    SystemProgram,
    ComputeBudgetProgram,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import * as path from 'path';
import * as fs from 'fs';

// Manually load .env.local
const envPath = path.resolve(process.cwd(), 'app/.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            process.env[match[1]] = match[2].trim();
        }
    });
} else {
    console.warn('⚠️ app/.env.local not found!');
}

const RPC_URL = 'https://api.devnet.solana.com';
const PRIVACYCASH_PROGRAM_ID = new PublicKey('ATZj4jZ4FFzkvAcvk27DW9GRkgSbFnHo49fKKPQXU7VS');
const FEE_RECIPIENT = new PublicKey('AWexibGxNFKTa1b5R5MN4PJr9HWnWRwf8EW9g8cLx3dM');

async function main() {
    console.log('🔗 Connecting to Devnet...');
    const connection = new Connection(RPC_URL, 'confirmed');

    // Load wallet
    const keypairStr = process.env.PRIVACYCASH_DEMO_KEYPAIR;
    if (!keypairStr) throw new Error('PRIVACYCASH_DEMO_KEYPAIR not found in app/.env.local');

    const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(keypairStr)));
    console.log(`💳 Wallet: ${keypair.publicKey.toBase58()}`);

    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`💰 Balance: ${balance / 1e9} SOL`);
    if (balance < 0.01 * 1e9) throw new Error('Insufficient SOL to create ALT. Please faucet.');

    // Derive Tree Account
    const [treeAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from('merkle_tree')],
        PRIVACYCASH_PROGRAM_ID
    );
    console.log(`🌳 Tree Account: ${treeAccount.toBase58()}`);

    // Create ALT
    console.log('🛠 Creating Address Lookup Table...');
    const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
        authority: keypair.publicKey,
        payer: keypair.publicKey,
        recentSlot: await connection.getSlot(),
    });

    console.log(`📝 new ALT Address: ${lookupTableAddress.toBase58()}`);

    // Send Create Tx
    let tx = new Transaction().add(lookupTableInst);
    await sendAndConfirmTransaction(connection, tx, [keypair]);
    console.log('✅ ALT Created!');

    // Extend ALT with addresses
    console.log('➕ Extending ALT with accounts...');
    const accountsToAdd = [
        SystemProgram.programId,
        ComputeBudgetProgram.programId,
        PRIVACYCASH_PROGRAM_ID,
        FEE_RECIPIENT,
        treeAccount,
        // Common System Sysvars if needed? Usually automatically handled but good to have if referenced
        // SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY
    ];

    const extendInst = AddressLookupTableProgram.extendLookupTable({
        payer: keypair.publicKey,
        authority: keypair.publicKey,
        lookupTable: lookupTableAddress,
        addresses: accountsToAdd,
    });

    tx = new Transaction().add(extendInst);
    await sendAndConfirmTransaction(connection, tx, [keypair]);

    console.log(`\n🎉 SUCCESS! Devnet ALT Ready:`);
    console.log(`NEXT_PUBLIC_ALT_ADDRESS=${lookupTableAddress.toBase58()}`);
    console.log(`\nPlease add this line to your app/.env.local file.`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
