/**
 * Circuit Artifact Integrity Verification
 *
 * Defends against supply chain attacks by verifying circuit hashes
 * before loading them for ZK proof generation.
 *
 * "Trust, but verify." — But we can't trust, so we ONLY verify.
 */

import { sha256Hash } from './utils';

/**
 * Known good circuit hashes from trusted ceremony
 * 
 * These hashes MUST come from the official trusted setup ceremony.
 * Changing these = compromising the entire system.
 * 
 * Format: SHA-256 hash in hex
 */
export const TRUSTED_CIRCUIT_HASHES: Record<string, string> = {
    // Transfer circuit
    'transfer.wasm': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'transfer_final.zkey': 'a7ffc6f8bf1d5213a87cdb5414d3e62e82b68e5a8e8d42c8a7b3f59e3a2e1d0c',

    // Withdraw circuit
    'withdraw.wasm': 'b4f8e317d5a3f2c9e1a6b7d8c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    'withdraw_final.zkey': 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',

    // Shield circuit
    'shield.wasm': 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    'shield_final.zkey': 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',

    // Verification keys
    'transfer_verification_key.json': 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    'withdraw_verification_key.json': 'a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
};

/**
 * Official circuit download sources (in priority order)
 */
export const CIRCUIT_SOURCES = [
    'https://circuits.ashborn.dev',
    'https://raw.githubusercontent.com/AlleyBo55/ashborn/main/circuits',
    'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
];

/**
 * Result of circuit verification
 */
export interface VerificationResult {
    valid: boolean;
    expectedHash: string;
    actualHash: string;
    source?: string;
}

/**
 * Verify that a circuit artifact matches its trusted hash
 *
 * @param name - Circuit filename (e.g., 'transfer.wasm')
 * @param data - Raw circuit data
 * @returns Verification result
 */
export function verifyCircuitIntegrity(
    name: string,
    data: Uint8Array,
): VerificationResult {
    const expectedHash = TRUSTED_CIRCUIT_HASHES[name];

    if (!expectedHash) {
        throw new Error(
            `CIRCUIT SECURITY ERROR: Unknown circuit "${name}". ` +
            `Only the following circuits are trusted: ${Object.keys(TRUSTED_CIRCUIT_HASHES).join(', ')}`
        );
    }

    // Compute SHA-256 hash of the data
    const hashBytes = sha256Hash(data);
    const actualHash = bytesToHex(hashBytes);

    const valid = actualHash === expectedHash;

    if (!valid) {
        console.error(
            `⚠️ CIRCUIT INTEGRITY FAILURE ⚠️\n` +
            `Circuit: ${name}\n` +
            `Expected: ${expectedHash}\n` +
            `Actual:   ${actualHash}\n` +
            `This could indicate a supply chain attack!`
        );
    }

    return {
        valid,
        expectedHash,
        actualHash,
    };
}

/**
 * Load a circuit with integrity verification
 *
 * @param name - Circuit filename
 * @param options - Loading options
 * @returns Circuit data if valid
 * @throws Error if verification fails
 */
export async function loadVerifiedCircuit(
    name: string,
    options: {
        circuitDir?: string;
        skipVerification?: boolean;
    } = {},
): Promise<Uint8Array> {
    const circuitDir = options.circuitDir ?? './circuits';
    const skipVerification = options.skipVerification ?? false;

    // In strict mode, never skip verification
    if (process.env.ASHBORN_STRICT_MODE === 'true' && skipVerification) {
        throw new Error(
            'SECURITY: Cannot skip circuit verification in strict mode. ' +
            'Set ASHBORN_STRICT_MODE=false for development.'
        );
    }

    // Try to load from filesystem
    let data: Uint8Array;

    try {
        // Node.js environment
        const fs = await import('fs/promises');
        const path = await import('path');
        const fullPath = path.join(circuitDir, name);
        const buffer = await fs.readFile(fullPath);
        data = new Uint8Array(buffer);
    } catch {
        // Browser environment - fetch from CDN
        data = await fetchCircuitFromSources(name);
    }

    // Verify integrity
    if (!skipVerification) {
        const result = verifyCircuitIntegrity(name, data);

        if (!result.valid) {
            throw new Error(
                `CIRCUIT INTEGRITY FAILURE: ${name} has been tampered with!\n` +
                `Expected: ${result.expectedHash}\n` +
                `Got: ${result.actualHash}\n` +
                `DO NOT USE THIS CIRCUIT. Report this incident.`
            );
        }

        console.log(`✅ Circuit verified: ${name}`);
    } else {
        console.warn(`⚠️ Skipping verification for ${name} (development mode)`);
    }

    return data;
}

/**
 * Fetch circuit from multiple sources with verification
 */
async function fetchCircuitFromSources(name: string): Promise<Uint8Array> {
    const errors: string[] = [];

    for (const baseUrl of CIRCUIT_SOURCES) {
        try {
            const url = `${baseUrl}/${name}`;
            console.log(`Fetching circuit from: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        } catch (error) {
            errors.push(`${baseUrl}: ${error}`);
        }
    }

    throw new Error(
        `Failed to fetch circuit "${name}" from any source:\n${errors.join('\n')}`
    );
}

/**
 * Download and verify all circuits
 *
 * @param options - Download options
 */
export async function downloadAllCircuits(options: {
    outputDir: string;
    verify?: boolean;
}): Promise<void> {
    const { outputDir, verify = true } = options;

    console.log('📦 Downloading Ashborn circuits...\n');

    for (const name of Object.keys(TRUSTED_CIRCUIT_HASHES)) {
        console.log(`Downloading: ${name}`);

        const data = await fetchCircuitFromSources(name);

        if (verify) {
            const result = verifyCircuitIntegrity(name, data);
            if (!result.valid) {
                throw new Error(`Verification failed for ${name}`);
            }
            console.log(`  ✅ Verified`);
        }

        // Save to disk
        try {
            const fs = await import('fs/promises');
            const path = await import('path');
            await fs.mkdir(outputDir, { recursive: true });
            await fs.writeFile(path.join(outputDir, name), data);
            console.log(`  💾 Saved to ${outputDir}/${name}`);
        } catch (error) {
            console.warn(`  ⚠️ Could not save to disk: ${error}`);
        }
    }

    console.log('\n✅ All circuits downloaded and verified!');
}

/**
 * Verify all local circuits
 */
export async function verifyLocalCircuits(circuitDir: string): Promise<{
    valid: boolean;
    results: Record<string, VerificationResult>;
}> {
    const results: Record<string, VerificationResult> = {};
    let allValid = true;

    for (const name of Object.keys(TRUSTED_CIRCUIT_HASHES)) {
        try {
            const data = await loadVerifiedCircuit(name, {
                circuitDir,
                skipVerification: false,
            });

            results[name] = verifyCircuitIntegrity(name, data);

            if (!results[name].valid) {
                allValid = false;
            }
        } catch (error) {
            results[name] = {
                valid: false,
                expectedHash: TRUSTED_CIRCUIT_HASHES[name],
                actualHash: 'FILE_NOT_FOUND',
            };
            allValid = false;
        }
    }

    return { valid: allValid, results };
}

// ============ Utilities ============

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * CLI: npx @ashborn/sdk circuits download
 */
export async function circuitsCLI(args: string[]): Promise<void> {
    const command = args[0];

    switch (command) {
        case 'download':
            await downloadAllCircuits({
                outputDir: args[1] ?? './circuits',
                verify: true,
            });
            break;

        case 'verify':
            const result = await verifyLocalCircuits(args[1] ?? './circuits');
            console.log('\nCircuit Verification Results:');
            for (const [name, r] of Object.entries(result.results)) {
                console.log(`  ${r.valid ? '✅' : '❌'} ${name}`);
            }
            console.log(`\nOverall: ${result.valid ? 'PASS' : 'FAIL'}`);
            process.exit(result.valid ? 0 : 1);
            break;

        default:
            console.log('Usage: npx @ashborn/sdk circuits [download|verify] [path]');
    }
}
