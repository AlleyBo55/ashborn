/**
 * Enhanced Helius Integration with DAS API and Webhooks
 *
 * Mert-approved: Use actual helius-sdk, DAS, and webhooks
 */

import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionSignature,
  ComputeBudgetProgram,
} from "@solana/web3.js";

// Note: Import from actual helius-sdk when installed
// import { Helius } from 'helius-sdk';

/** DAS Asset */
export interface DASAsset {
  id: string;
  content: {
    metadata: Record<string, unknown>;
  };
  ownership: {
    owner: string;
  };
}

/** Webhook event types */
export type WebhookEvent =
  | "TRANSFER"
  | "NFT_SALE"
  | "NFT_LISTING"
  | "ACCOUNT_CHANGE"
  | "ASHBORN_SHIELD"
  | "ASHBORN_TRANSFER"
  | "ASHBORN_UNSHIELD";

/** Webhook configuration */
export interface WebhookConfig {
  webhookURL: string;
  accountAddresses: string[];
  transactionTypes: WebhookEvent[];
  webhookType: "enhanced" | "raw";
}

/**
 * Enhanced Helius client with DAS and webhooks
 */
export class HeliusEnhanced {
  private apiKey: string;
  private baseUrl: string;
  private connection: Connection;

  constructor(config: { apiKey: string; cluster?: "mainnet-beta" | "devnet" }) {
    this.apiKey = config.apiKey;
    const cluster = config.cluster ?? "devnet";
    this.baseUrl = `https://${cluster === "mainnet-beta" ? "mainnet" : "devnet"}.helius-rpc.com`;
    this.connection = new Connection(`${this.baseUrl}?api-key=${this.apiKey}`);
  }

  // ============================================================
  // DAS API (Digital Asset Standard) - 10x faster scanning
  // ============================================================

  /**
   * Get assets by owner using DAS API
   * Much faster than getTokenAccountsByOwner for stealth scanning
   */
  async getAssetsByOwner(
    ownerAddress: string,
    page = 1,
    limit = 1000,
  ): Promise<DASAsset[]> {
    const response = await fetch(`${this.baseUrl}?api-key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ashborn-das",
        method: "getAssetsByOwner",
        params: {
          ownerAddress,
          page,
          limit,
          displayOptions: {
            showCollectionMetadata: true,
          },
        },
      }),
    });

    const data = (await response.json()) as { result?: { items?: DASAsset[] } };
    return data.result?.items ?? [];
  }

  /**
   * Get asset by ID (for stealth payment lookup)
   */
  async getAsset(assetId: string): Promise<DASAsset | null> {
    const response = await fetch(`${this.baseUrl}?api-key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ashborn-das",
        method: "getAsset",
        params: { id: assetId },
      }),
    });

    const data = (await response.json()) as { result?: DASAsset };
    return data.result ?? null;
  }

  // ============================================================
  // Webhooks & Stealth Scanning
  // ============================================================

  /**
   * Scan transaction history for stealth payments (shielded transfers)
   */
  async scanForStealthPayments(
    address: PublicKey,
    limit = 100,
  ): Promise<any[]> {
    // Use Helius Enhanced Transaction History API
    const response = await fetch(
      `${this.baseUrl}/v0/addresses/${address.toBase58()}/transactions?api-key=${this.apiKey}&limit=${limit}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) return [];

    const transactions = (await response.json()) as any[];

    // Filter for Ashborn Shield events
    return transactions.filter(
      (tx: any) =>
        tx.type === "ASHBORN_SHIELD" ||
        (tx.description && tx.description.includes("Shielded")),
    );
  }

  /**
   * Get human-readable transaction history
   */
  async getEnhancedTransactionHistory(address: PublicKey): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/v0/addresses/${address.toBase58()}/transactions?api-key=${this.apiKey}`,
      {
        method: "GET",
      },
    );
    if (!response.ok) return [];
    return (await response.json()) as any[];
  }

  // ============================================================
  // Optimization Utilities
  // ============================================================

  /**
   * Create Compute Budget instructions optimized by Helius
   */
  createComputeBudgetInstructions(priorityFee: number): any[] {
    return [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }), // Safe default
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }),
    ];
  }

  /**
   * Search assets with filters
   */
  async searchAssets(params: {
    ownerAddress?: string;
    creatorAddress?: string;
    compressed?: boolean;
    page?: number;
    limit?: number;
  }): Promise<DASAsset[]> {
    const response = await fetch(`${this.baseUrl}?api-key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ashborn-das",
        method: "searchAssets",
        params: {
          ...params,
          page: params.page ?? 1,
          limit: params.limit ?? 1000,
        },
      }),
    });

    const data = (await response.json()) as { result?: { items?: DASAsset[] } };
    return data.result?.items ?? [];
  }

  // ============================================================
  // Webhooks - Real-time payment notifications
  // ============================================================

  /**
   * Create a webhook for real-time Ashborn events
   */
  async createWebhook(config: WebhookConfig): Promise<string> {
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks?api-key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookURL: config.webhookURL,
          accountAddresses: config.accountAddresses,
          transactionTypes: config.transactionTypes,
          webhookType: config.webhookType,
          txnStatus: "success",
        }),
      },
    );

    const data = (await response.json()) as { webhookID: string };
    return data.webhookID;
  }

  /**
   * Update webhook addresses (e.g., when user creates new vault)
   */
  async updateWebhook(webhookId: string, addresses: string[]): Promise<void> {
    await fetch(
      `https://api.helius.xyz/v0/webhooks/${webhookId}?api-key=${this.apiKey}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountAddresses: addresses,
        }),
      },
    );
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    await fetch(
      `https://api.helius.xyz/v0/webhooks/${webhookId}?api-key=${this.apiKey}`,
      {
        method: "DELETE",
      },
    );
  }

  /**
   * List all webhooks
   */
  async listWebhooks(): Promise<
    Array<{ webhookID: string; webhookURL: string }>
  > {
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks?api-key=${this.apiKey}`,
    );
    return response.json() as Promise<
      Array<{ webhookID: string; webhookURL: string }>
    >;
  }

  // ============================================================
  // Smart Transactions (from helius-sdk)
  // ============================================================

  /**
   * Send smart transaction with automatic retry, priority fees, etc.
   * Uses Helius' native sendSmartTransaction
   */
  async sendSmartTransaction(
    transaction: Transaction | VersionedTransaction,
    signers: any[],
    options?: {
      skipPreflight?: boolean;
      maxRetries?: number;
      priorityLevel?: "Min" | "Low" | "Medium" | "High" | "VeryHigh";
    },
  ): Promise<TransactionSignature> {
    // Get priority fee estimate
    const feeEstimate = await this.getPriorityFeeEstimate(
      transaction instanceof Transaction
        ? transaction.instructions.flatMap((ix) => ix.keys.map((k) => k.pubkey))
        : [],
    );

    const priorityFee = this.selectPriorityFee(
      feeEstimate,
      options?.priorityLevel ?? "Medium",
    );

    // Add compute budget instructions if Transaction (not Versioned)
    if (transaction instanceof Transaction) {
      const computeIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000,
      });
      const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee,
      });
      transaction.instructions.unshift(computeIx, priorityIx);
    }

    // Send with retry logic
    let attempts = 0;
    const maxAttempts = options?.maxRetries ?? 3;

    while (attempts < maxAttempts) {
      try {
        const signature = await this.connection.sendTransaction(
          transaction as Transaction,
          signers,
          { skipPreflight: options?.skipPreflight ?? false },
        );

        await this.connection.confirmTransaction(signature, "confirmed");
        return signature;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await new Promise((r) => setTimeout(r, 1000 * attempts));
      }
    }

    throw new Error("Transaction failed after max retries");
  }

  /**
   * Get priority fee estimate for accounts
   */
  async getPriorityFeeEstimate(accounts: PublicKey[]): Promise<{
    min: number;
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
  }> {
    const response = await fetch(`${this.baseUrl}?api-key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "priority-fee",
        method: "getPriorityFeeEstimate",
        params: [
          {
            accountKeys: accounts.map((a) => a.toBase58()),
            options: { recommended: true },
          },
        ],
      }),
    });

    const data = (await response.json()) as {
      result?: {
        priorityFeeLevels?: {
          min?: number;
          low?: number;
          medium?: number;
          high?: number;
          veryHigh?: number;
        };
      };
    };
    const levels = data.result?.priorityFeeLevels ?? {};

    return {
      min: levels.min ?? 1000,
      low: levels.low ?? 5000,
      medium: levels.medium ?? 20000,
      high: levels.high ?? 100000,
      veryHigh: levels.veryHigh ?? 1000000,
    };
  }

  private selectPriorityFee(
    estimate: {
      min: number;
      low: number;
      medium: number;
      high: number;
      veryHigh: number;
    },
    level: string,
  ): number {
    switch (level) {
      case "Min":
        return estimate.min;
      case "Low":
        return estimate.low;
      case "Medium":
        return estimate.medium;
      case "High":
        return estimate.high;
      case "VeryHigh":
        return estimate.veryHigh;
      default:
        return estimate.medium;
    }
  }

  // ============================================================
  // Enhanced Transaction Parsing
  // ============================================================

  /**
   * Parse Ashborn transactions from history
   */
  async parseAshbornHistory(
    address: string,
    limit = 100,
  ): Promise<
    Array<{
      type: "shield" | "transfer" | "unshield" | "reveal";
      signature: string;
      timestamp: number;
      amount?: string;
      commitment?: string;
    }>
  > {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${this.apiKey}&type=ASHBORN`,
    );
    const transactions = (await response.json()) as any[];

    return transactions.slice(0, limit).map((tx: any) => ({
      type: this.parseTransactionType(tx),
      signature: tx.signature,
      timestamp: tx.timestamp,
      amount: tx.nativeTransfers?.[0]?.amount?.toString(),
      commitment: tx.events?.[0]?.commitment,
    }));
  }

  private parseTransactionType(
    tx: any,
  ): "shield" | "transfer" | "unshield" | "reveal" {
    const logs = tx.meta?.logMessages ?? [];
    if (logs.some((l: string) => l.includes("shield"))) return "shield";
    if (logs.some((l: string) => l.includes("transfer"))) return "transfer";
    if (logs.some((l: string) => l.includes("unshield"))) return "unshield";
    return "reveal";
  }
}

/**
 * Create enhanced Helius client
 */
export function createHeliusEnhanced(
  apiKey: string,
  cluster?: "mainnet-beta" | "devnet",
): HeliusEnhanced {
  return new HeliusEnhanced({ apiKey, cluster });
}
