/**
 * Relayer Service - Submit transactions without linking sender wallet
 *
 * ZachXBT-proof: Users never submit their own transactions
 */

import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";

/** Relayer configuration */
export interface RelayerConfig {
  /** Relayer endpoint URL */
  endpoint: string;
  /** Optional API key */
  apiKey?: string;
  /** Network to use */
  network: "mainnet-beta" | "devnet";
}

/** Relay request */
export interface RelayRequest {
  /** Serialized unsigned transaction */
  transaction: string;
  /** Signatures from user (for their accounts only) */
  signatures: Array<{
    pubkey: string;
    signature: string;
  }>;
  /** Priority fee to add (relayer can add more) */
  priorityFee?: number;
}

/** Relay response */
export interface RelayResponse {
  /** Transaction signature */
  signature: string;
  /** Slot where transaction was included */
  slot: number;
  /** Estimated fee paid by relayer */
  relayerFee: number;
}

/**
 * Relayer client for privacy-preserving transaction submission
 */
export class RelayerClient {
  private config: RelayerConfig;

  constructor(config: RelayerConfig) {
    this.config = config;
  }

  /**
   * Submit a transaction through the relayer
   *
   * The relayer:
   * 1. Receives unsigned tx + user signatures
   * 2. Adds their signature as fee payer
   * 3. Submits to the network
   * 4. User's wallet never touches the network directly
   */
  async relay(request: RelayRequest): Promise<RelayResponse> {
    const response = await fetch(`${this.config.endpoint}/relay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey && { "X-API-Key": this.config.apiKey }),
      },
      body: JSON.stringify({
        network: this.config.network,
        transaction: request.transaction,
        signatures: request.signatures,
        priorityFee: request.priorityFee ?? 10000,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as { message?: string };
      throw new Error(`Relay failed: ${error.message}`);
    }

    return response.json() as Promise<RelayResponse>;
  }

  /**
   * Get relayer status and supported operations
   */
  async getStatus(): Promise<{
    online: boolean;
    supportedPrograms: string[];
    feeMultiplier: number;
    queueLength: number;
  }> {
    const response = await fetch(`${this.config.endpoint}/status`);
    return response.json() as Promise<{
      online: boolean;
      supportedPrograms: string[];
      feeMultiplier: number;
      queueLength: number;
    }>;
  }

  /**
   * Estimate relay fee for a transaction
   */
  async estimateFee(transaction: string): Promise<number> {
    const response = await fetch(`${this.config.endpoint}/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction }),
    });

    const data = (await response.json()) as { estimatedFee: number };
    return data.estimatedFee;
  }
}

/**
 * Create a transaction ready for relay
 *
 * User signs their parts, relayer signs as fee payer
 */
export async function prepareForRelay(
  transaction: Transaction,
  userSigners: Keypair[],
  connection: Connection,
): Promise<RelayRequest> {
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  // Set fee payer to placeholder (relayer will replace)
  // This is a well-known "relay" pubkey that indicates relay intent
  transaction.feePayer = new PublicKey(
    "Re1ay1111111111111111111111111111111111111",
  );

  // User signs their accounts
  for (const signer of userSigners) {
    transaction.partialSign(signer);
  }

  // Extract user signatures
  const signatures = transaction.signatures
    .filter((s) => s.signature !== null)
    .map((s) => ({
      pubkey: s.publicKey.toBase58(),
      signature: Buffer.from(s.signature!).toString("base64"),
    }));

  // Serialize (without fee payer signature)
  const serialized = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  return {
    transaction: serialized.toString("base64"),
    signatures,
  };
}

/**
 * Local relayer for development/testing
 *
 * In production, use a distributed relayer network
 */
export class LocalRelayer {
  private connection: Connection;
  private feePayerKeypair: Keypair;

  constructor(connection: Connection, feePayer: Keypair) {
    this.connection = connection;
    this.feePayerKeypair = feePayer;
  }

  async relay(
    serializedTx: string,
    userSignatures: Array<{ pubkey: string; signature: string }>,
  ): Promise<string> {
    // Deserialize
    const txBuffer = Buffer.from(serializedTx, "base64");
    const tx = Transaction.from(txBuffer);

    // Replace fee payer
    tx.feePayer = this.feePayerKeypair.publicKey;

    // Get fresh blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    // Re-apply user signatures
    for (const sig of userSignatures) {
      const sigBuffer = Buffer.from(sig.signature, "base64");
      tx.addSignature(new PublicKey(sig.pubkey), sigBuffer);
    }

    // Sign as fee payer
    tx.sign(this.feePayerKeypair);

    // Submit
    const signature = await this.connection.sendRawTransaction(tx.serialize());
    await this.connection.confirmTransaction(signature);

    return signature;
  }
}

/** Default relayer endpoints */
export const RELAYER_ENDPOINTS = {
  mainnet: "https://relay.ashborn.network",
  devnet: "https://relay-devnet.ashborn.network",
  local: "http://localhost:8080",
};

/**
 * Create relayer client with default config
 */
export function createRelayer(
  network: "mainnet-beta" | "devnet" = "devnet",
): RelayerClient {
  return new RelayerClient({
    endpoint:
      network === "mainnet-beta"
        ? RELAYER_ENDPOINTS.mainnet
        : RELAYER_ENDPOINTS.devnet,
    network,
  });
}
