/**
 * PrivacyCash Official SDK Adapter
 *
 * Wraps the official Privacy Cash SDK for use within Ashborn.
 * This enables the "PrivacyCash Mode" for shielding/unshielding,
 * while Ashborn provides Stealth Transfers and Compliance Proofs.
 *
 * @see https://github.com/Privacy-Cash/privacy-cash-sdk
 */

import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
// @ts-ignore - SDK is installed from GitHub, types may not be perfect
import { PrivacyCash } from "privacycash";

export interface PrivacyCashConfig {
    rpcUrl: string;
    owner: Keypair | Uint8Array | string;
    enableDebug?: boolean;
}

export interface DepositResult {
    success: boolean;
    signature?: string;
    error?: string;
}

export interface WithdrawResult {
    success: boolean;
    amount_in_lamports?: number;
    fee_in_lamports?: number;
    signature?: string;
    error?: string;
}

/**
 * Adapter for the official PrivacyCash SDK
 *
 * "Two kings can make an alliance..." — Shadow Monarch
 */
export class PrivacyCashOfficial {
    private client: PrivacyCash;
    private _publicKey: PublicKey;

    constructor(config: PrivacyCashConfig) {
        this.client = new PrivacyCash({
            RPC_url: config.rpcUrl,
            owner: config.owner,
            enableDebug: config.enableDebug ?? false,
        });
        this._publicKey = this.client.publicKey;
    }

    get publicKey(): PublicKey {
        return this._publicKey;
    }

    /**
     * Shield SOL into PrivacyCash pool
     * @param solAmount - Amount in SOL (e.g., 0.1 for 0.1 SOL)
     */
    async shieldSOL(solAmount: number): Promise<DepositResult> {
        try {
            const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
            const result = await this.client.deposit({ lamports });
            return {
                success: true,
                signature: result?.signature || "deposited",
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Deposit failed",
            };
        }
    }

    /**
     * Unshield SOL from PrivacyCash pool
     * @param solAmount - Amount in SOL (e.g., 0.1 for 0.1 SOL)
     * @param recipient - Optional recipient address (defaults to owner)
     */
    async unshieldSOL(solAmount: number, recipient?: string): Promise<WithdrawResult> {
        try {
            const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
            const result = await this.client.withdraw({
                lamports,
                recipientAddress: recipient,
            });
            return {
                success: true,
                amount_in_lamports: result.amount_in_lamports,
                fee_in_lamports: result.fee_in_lamports,
                signature: result?.signature || "withdrawn",
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Withdraw failed",
            };
        }
    }

    /**
     * Get private SOL balance in the PrivacyCash pool
     * @returns Balance in lamports
     */
    async getPrivateBalanceSOL(): Promise<bigint> {
        try {
            const balance = await this.client.getPrivateBalance();
            return BigInt(balance);
        } catch {
            return 0n;
        }
    }

    /**
     * Shield USDC into PrivacyCash pool
     * @param usdcAmount - Amount in USDC (e.g., 10 for 10 USDC)
     */
    async shieldUSDC(usdcAmount: number): Promise<DepositResult> {
        try {
            const baseUnits = Math.floor(usdcAmount * 1_000_000); // USDC has 6 decimals
            const result = await this.client.depositUSDC({ base_units: baseUnits });
            return {
                success: true,
                signature: result?.signature || "deposited",
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Deposit failed",
            };
        }
    }

    /**
     * Unshield USDC from PrivacyCash pool
     * @param usdcAmount - Amount in USDC (e.g., 10 for 10 USDC)
     * @param recipient - Optional recipient address (defaults to owner)
     */
    async unshieldUSDC(usdcAmount: number, recipient?: string): Promise<WithdrawResult> {
        try {
            const baseUnits = Math.floor(usdcAmount * 1_000_000);
            const result = await this.client.withdrawUSDC({
                base_units: baseUnits,
                recipientAddress: recipient,
            });
            return {
                success: true,
                amount_in_lamports: baseUnits, // Actually base units, but keeping interface consistent
                signature: result?.signature || "withdrawn",
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Withdraw failed",
            };
        }
    }

    /**
     * Get private USDC balance in the PrivacyCash pool
     * @returns Balance in base units (divide by 1_000_000 for USDC)
     */
    async getPrivateBalanceUSDC(): Promise<bigint> {
        try {
            const balance = await this.client.getPrivateBalanceUSDC();
            return BigInt(balance);
        } catch {
            return 0n;
        }
    }

    /**
     * Clear local UTXO cache
     */
    async clearCache(): Promise<void> {
        await this.client.clearCache();
    }
}

// Re-export for convenience
export { PrivacyCash };
