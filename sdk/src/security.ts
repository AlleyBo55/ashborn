/**
 * Ashborn SDK - Security & Privacy Infrastructure
 * 
 * Import this module for keystore encryption, Tor anonymity, circuit integrity, and relayers.
 * 
 * @example
 * ```typescript
 * import { encryptViewKey, createTorConnection, createRelayer } from '@alleyboss/ashborn-sdk/security';
 * 
 * const keystore = await encryptViewKey(viewKey, password);
 * const torConn = createTorConnection(rpcUrl);
 * const relayer = createRelayer('mainnet-beta');
 * ```
 */

// Encrypted Keystore (View Key Protection)
export {
    encryptViewKey,
    decryptViewKey,
    lockKeystore,
    lockAllKeystores,
    isKeystoreUnlocked,
    changePassword,
    exportKeystore,
    importKeystore,
} from "./keystore";
export type { EncryptedKeystore, KeystoreConfig } from "./keystore";

// Circuit Integrity (Supply Chain Protection)
export {
    verifyCircuitIntegrity,
    loadVerifiedCircuit,
    downloadAllCircuits,
    verifyLocalCircuits,
    TRUSTED_CIRCUIT_HASHES,
    CIRCUIT_SOURCES,
} from "./circuits";

// Tor/Anonymity (IP Protection)
export {
    isTorAvailable,
    getTorExitIP,
    createTorConnection,
    requestNewCircuit,
    submitAnonymously,
    calculatePrivacyScore,
    TOR_DEFAULTS,
    TOR_BROWSER_CONFIG,
    DEFAULT_ANONYMITY_CONFIG,
    MAX_ANONYMITY_CONFIG,
} from "./tor";
export type { TorConfig, AnonymityConfig } from "./tor";

// Relayer (sender unlinkability)
export {
    RelayerClient,
    LocalRelayer,
    createRelayer,
    prepareForRelay,
    RELAYER_ENDPOINTS,
} from "./relayer";
