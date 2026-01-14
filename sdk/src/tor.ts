/**
 * Tor Integration for IP Anonymization
 *
 * Provides Tor-proxied connections to hide user IP addresses.
 * Defends against metadata correlation attacks.
 */

import { Connection, Transaction } from '@solana/web3.js';

/**
 * Tor connection configuration
 */
export interface TorConfig {
    // SOCKS5 proxy (default: Tor Browser's proxy)
    proxyHost: string;
    proxyPort: number;

    // Connection timeout in ms
    timeout?: number;

    // Request new circuit for each connection
    newCircuitPerConnection?: boolean;
}

/**
 * Default Tor configurations
 */
export const TOR_DEFAULTS: TorConfig = {
    proxyHost: '127.0.0.1',
    proxyPort: 9050, // Tor SOCKS5 default
    timeout: 30000,
    newCircuitPerConnection: false,
};

/**
 * Tor Browser Bundle default
 */
export const TOR_BROWSER_CONFIG: TorConfig = {
    proxyHost: '127.0.0.1',
    proxyPort: 9150, // Tor Browser uses different port
    timeout: 30000,
    newCircuitPerConnection: false,
};

// Helper to check if running in browser
const isBrowser = typeof globalThis !== 'undefined' &&
    typeof (globalThis as Record<string, unknown>).window !== 'undefined';

/**
 * Check if Tor is available and running
 *
 * @param config - Tor configuration
 * @returns True if Tor is accessible
 */
export async function isTorAvailable(
    config: Partial<TorConfig> = {},
): Promise<boolean> {
    const cfg = { ...TOR_DEFAULTS, ...config };

    try {
        // Try to connect through Tor to check.torproject.org
        const response = await fetchViaTor(
            'https://check.torproject.org/api/ip',
            cfg
        );

        const data = (await response.json()) as { IsTor?: boolean };
        return data.IsTor === true;
    } catch {
        return false;
    }
}

/**
 * Get current Tor exit node IP
 */
export async function getTorExitIP(
    config: Partial<TorConfig> = {},
): Promise<string | null> {
    const cfg = { ...TOR_DEFAULTS, ...config };

    try {
        const response = await fetchViaTor(
            'https://check.torproject.org/api/ip',
            cfg
        );
        const data = (await response.json()) as { IP?: string };
        return data.IP ?? null;
    } catch {
        return null;
    }
}

/**
 * Create a Tor-proxied Solana connection
 *
 * IMPORTANT: This requires a SOCKS5 proxy support in your environment.
 * Node.js: Use 'socks-proxy-agent'
 * Browser: Requires Tor Browser or similar
 *
 * @param rpcUrl - Solana RPC URL
 * @param config - Tor configuration
 * @returns Proxied Connection
 */
export function createTorConnection(
    rpcUrl: string,
    config: Partial<TorConfig> = {},
): Connection {
    const cfg = { ...TOR_DEFAULTS, ...config };

    // In browser, we can't directly use SOCKS5 proxy
    // The user must be using Tor Browser
    if (isBrowser) {
        console.warn(
            '⚠️ Browser detected. For Tor anonymity, use Tor Browser.\n' +
            'Regular browsers cannot proxy through Tor directly.'
        );
        return new Connection(rpcUrl, 'confirmed');
    }

    // Node.js: Use socks-proxy-agent
    try {
        // Dynamic import to avoid bundling issues
        const createConnection = createNodeTorConnection(rpcUrl, cfg);
        return createConnection;
    } catch (error) {
        console.error(
            'Failed to create Tor connection. Install socks-proxy-agent:\n' +
            'npm install socks-proxy-agent'
        );
        throw error;
    }
}

/**
 * Fetch via Tor (for testing and utility)
 */
async function fetchViaTor(
    url: string,
    config: TorConfig,
): Promise<Response> {
    // In browser, assume Tor Browser handles proxying
    if (isBrowser) {
        return fetch(url);
    }

    // Node.js: Use socks-proxy-agent
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { SocksProxyAgent } = require('socks-proxy-agent');
        const agent = new SocksProxyAgent(
            `socks5://${config.proxyHost}:${config.proxyPort}`
        );

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodeFetch = require('node-fetch');
        return nodeFetch(url, { agent, timeout: config.timeout }) as Promise<Response>;
    } catch {
        throw new Error(
            'Tor fetch failed. Ensure Tor is running and socks-proxy-agent is installed.'
        );
    }
}

/**
 * Create a Tor-proxied connection for Node.js
 */
function createNodeTorConnection(
    rpcUrl: string,
    config: TorConfig,
): Connection {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { SocksProxyAgent } = require('socks-proxy-agent');
        const agent = new SocksProxyAgent(
            `socks5://${config.proxyHost}:${config.proxyPort}`
        );

        // Create connection with custom fetch
        // Note: Using 'any' cast to work around Solana's fetch typing issues
        return new Connection(rpcUrl, {
            commitment: 'confirmed',
            fetch: (async (urlInput: unknown, options?: RequestInit): Promise<Response> => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const nodeFetch = require('node-fetch');
                const urlStr = typeof urlInput === 'string' ? urlInput : String(urlInput);
                return nodeFetch(urlStr, { ...options, agent }) as Promise<Response>;
            }) as typeof fetch,
        });
    } catch {
        throw new Error(
            'Failed to create Tor connection. Install required packages:\n' +
            'npm install socks-proxy-agent node-fetch'
        );
    }
}

/**
 * Request a new Tor circuit (new identity)
 *
 * This requires ControlPort access to Tor (not available in Tor Browser)
 */
export async function requestNewCircuit(
    controlPort = 9051,
    password = '',
): Promise<boolean> {
    if (isBrowser) {
        console.warn('New circuit request not available in browser.');
        return false;
    }

    try {
        // Connect to Tor control port
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const net = require('net');

        return new Promise((resolve, reject) => {
            const socket = net.createConnection(controlPort, '127.0.0.1');
            let authenticated = false;

            socket.on('connect', () => {
                // Authenticate
                socket.write(`AUTHENTICATE "${password}"\r\n`);
            });

            socket.on('data', (data: Buffer) => {
                const response = data.toString();

                if (response.includes('250 OK') && !authenticated) {
                    authenticated = true;
                    // Request new circuit
                    socket.write('SIGNAL NEWNYM\r\n');
                } else if (response.includes('250 OK') && authenticated) {
                    socket.end();
                    console.log('✅ New Tor circuit requested');
                    resolve(true);
                } else if (response.includes('515')) {
                    socket.end();
                    reject(new Error('Tor authentication failed'));
                }
            });

            socket.on('error', (err: Error) => {
                reject(new Error(`Tor control connection failed: ${err.message}`));
            });

            socket.setTimeout(5000, () => {
                socket.destroy();
                reject(new Error('Tor control connection timeout'));
            });
        });
    } catch (error) {
        console.error('Failed to request new circuit:', error);
        return false;
    }
}

/**
 * Anonymity configuration for transactions
 */
export interface AnonymityConfig {
    // Use Tor for RPC calls
    useTor: boolean;
    torConfig?: Partial<TorConfig>;

    // Use relayer for transaction submission
    useRelayer: boolean;
    relayerUrl?: string;

    // Random delay before submission (anti-timing analysis)
    addRandomDelay: boolean;
    minDelayMs?: number;
    maxDelayMs?: number;

    // Request new circuit before sensitive operations
    newCircuitBeforeTx: boolean;
}

/**
 * Default anonymity configuration
 */
export const DEFAULT_ANONYMITY_CONFIG: AnonymityConfig = {
    useTor: false,
    useRelayer: true,
    relayerUrl: 'https://relayer.ashborn.dev',
    addRandomDelay: true,
    minDelayMs: 1000,
    maxDelayMs: 10000,
    newCircuitBeforeTx: false,
};

/**
 * Maximum anonymity configuration
 */
export const MAX_ANONYMITY_CONFIG: AnonymityConfig = {
    useTor: true,
    torConfig: TOR_DEFAULTS,
    useRelayer: true,
    relayerUrl: 'https://relayer.ashborn.dev',
    addRandomDelay: true,
    minDelayMs: 5000,
    maxDelayMs: 60000, // Up to 1 minute random delay
    newCircuitBeforeTx: true,
};

/**
 * Submit a transaction with anonymity protections
 */
export async function submitAnonymously(
    tx: Transaction,
    connection: Connection,
    config: Partial<AnonymityConfig> = {},
): Promise<string> {
    const cfg = { ...DEFAULT_ANONYMITY_CONFIG, ...config };

    // 1. Request new circuit if configured
    if (cfg.newCircuitBeforeTx && cfg.useTor) {
        try {
            await requestNewCircuit();
        } catch {
            console.warn('Could not request new Tor circuit');
        }
    }

    // 2. Add random delay
    if (cfg.addRandomDelay) {
        const minDelay = cfg.minDelayMs ?? 1000;
        const maxDelay = cfg.maxDelayMs ?? 10000;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);

        console.log(`⏳ Adding ${Math.round(delay / 1000)}s anonymity delay...`);
        await sleep(delay);
    }

    // 3. Submit via relayer if configured
    if (cfg.useRelayer && cfg.relayerUrl) {
        return submitViaRelayer(tx, cfg.relayerUrl);
    }

    // 4. Direct submission (with or without Tor)
    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
}

/**
 * Submit transaction via relayer
 */
async function submitViaRelayer(
    tx: Transaction,
    relayerUrl: string,
): Promise<string> {
    const serialized = tx.serialize();
    const base64Tx = Buffer.from(serialized).toString('base64');

    const response = await fetch(`${relayerUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: base64Tx }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Relayer submission failed: ${error}`);
    }

    const result = (await response.json()) as { signature: string };
    return result.signature;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Privacy score calculator
 */
export function calculatePrivacyScore(config: AnonymityConfig): {
    score: number;
    maxScore: number;
    breakdown: Record<string, number>;
} {
    const breakdown: Record<string, number> = {};
    let score = 0;
    const maxScore = 100;

    // Tor usage (30 points)
    if (config.useTor) {
        score += 30;
        breakdown['Tor proxy'] = 30;
    }

    // Relayer usage (25 points)
    if (config.useRelayer) {
        score += 25;
        breakdown['Relayer'] = 25;
    }

    // Random delay (20 points)
    if (config.addRandomDelay) {
        const delayRange = (config.maxDelayMs ?? 10000) - (config.minDelayMs ?? 1000);
        const delayScore = Math.min(20, Math.floor(delayRange / 3000) * 5);
        score += delayScore;
        breakdown['Random delay'] = delayScore;
    }

    // New circuit per tx (15 points)
    if (config.newCircuitBeforeTx) {
        score += 15;
        breakdown['New circuit'] = 15;
    }

    // Using Tor Browser would add 10 more, but we can't detect that
    breakdown['Base anonymity'] = 10;
    score += 10;

    return { score, maxScore, breakdown };
}
