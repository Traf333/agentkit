import { z } from "zod";

/**
 * Vaults details query schema
 */
export const VaultsDetailsSchema = z
  .object({
    chainId: z.number().describe("The chain ID of the network"),
  })
  .describe("Vaults details query schema");

/**
 * Input schema for Yelay Vault deposit action.
 */
export const YelayDepositSchema = z
  .object({
    assets: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Must be a valid integer or decimal value")
      .describe("The quantity of assets to deposit, in whole units"),
    receiver: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe(
        "The address that will own the position on the vault which will receive the shares",
      ),
    tokenAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address of the assets token to approve for deposit"),
    vaultAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address of the Yelay Vault to deposit to"),
  })
  .describe("Input schema for Yelay Vault deposit action");

/**
 * Input schema for Yelay Vault redeem action.
 */
export const YelayRedeemSchema = z
  .object({
    vaultAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address of the Yelay Vault to redeem from"),
    assets: z
      .string()
      .regex(/^\d+$/, "Must be a valid whole number")
      .describe("The amount of assets to redeem in atomic units e.g. 1"),
    receiver: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address to receive the shares"),
  })
  .strip()
  .describe("Input schema for Yelay Vault redeem action");

/**
 * Input schema for Yelay Vault claim action.
 */
export const YelayClaimSchema = z
  .object({
    vaultAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address of the Yelay Vault to claim yield from"),
    assets: z
      .string()
      .regex(/^\d+$/, "Must be a valid whole number")
      .describe("The amount of assets to claim in atomic units e.g. 1"),
    receiver: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
      .describe("The address to receive the yield"),
  })
  .strip()
  .describe("Input schema for Yelay Vault claim action");
