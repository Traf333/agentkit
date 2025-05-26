/**
 * Yelay Action Provider
 *
 * This file contains the implementation of the YelayActionProvider,
 * which provides actions for yelay operations.
 *
 * @module yelay
 */

import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CreateAction } from "../actionDecorator";
import { EvmWalletProvider } from "../../wallet-providers";
import {
  YelayClaimSchema,
  YelayDepositSchema,
  YelayRedeemSchema,
  VaultsDetailsSchema,
} from "./schemas";
import { APYResponse, VaultsDetailsResponse } from "./types";
import { YELAY_API_URL, YELAY_VAULT_ABI, YIELD_EXTRACTOR_ABI } from "./constants";
import { Hex, parseUnits, encodeFunctionData } from "viem";
import { abi } from "../erc20/constants";

const SUPPORTED_NETWORKS = ["1", "146", "8453"]; // Mainnet, Sonic, Base

/**
 * YelayActionProvider provides actions for yelay operations.
 *
 * @description
 * This provider is designed to work with EvmWalletProvider for blockchain interactions.
 * It supports all evm networks.
 */
export class YelayActionProvider extends ActionProvider<EvmWalletProvider> {
  /**
   * Constructor for the YelayActionProvider.
   */
  constructor() {
    super("yelay", []);
  }

  /**
   * Gets the details of the Yelay vaults with their last week APY.
   *
   * @param args - The input arguments for the action
   * @returns A formatted string containing the list of vaults with their APY.
   */
  @CreateAction({
    name: "get_vaults",
    description: `
   Getting Yelay vaults for the base network.

    This action demonstrates the basic structure of an action implementation.
    Replace this description with your actual action's purpose and behavior.

    Include:
    - What the action does
    - Required inputs and their format
    - Expected outputs
    - Any important considerations or limitations
  `,
    schema: VaultsDetailsSchema,
  })
  async getVaults(args: z.infer<typeof VaultsDetailsSchema>): Promise<string[]> {
    const [vaultsResponse, vaultAPYsResponse] = await Promise.all([
      fetch(`${YELAY_API_URL}/v2/vaults?chainId=${args.chainId}`),
      fetch(`${YELAY_API_URL}/v2/interest/vaults?chainId=${args.chainId}`),
    ]);
    const vaults = (await vaultsResponse.json()) as VaultsDetailsResponse[];
    const vaultAPYs = (await vaultAPYsResponse.json()) as APYResponse[];
    const vaultsDetails = vaults.map(vault => ({
      ...vault,
      apy: vaultAPYs.find(apy => apy.vault === vault.address)?.apy,
    }));
    return vaultsDetails.map(vault => `${vault.address}: ${vault.apy}`);
  }

  /**
   * Deposits assets into a Yelay Vault
   *
   * @param wallet - The wallet instance to execute the transaction
   * @param args - The input arguments for the action
   * @returns A success message with transaction details or an error message
   */
  @CreateAction({
    name: "deposit",
    description: `
 This tool allows depositing assets into a Yelay Vault. 
 
 It takes:
 - vaultAddress: The address of the Yelay Vault to deposit to
 - assets: The amount of assets to deposit in whole units
   Examples for WETH:
   - 1 WETH
   - 0.1 WETH
   - 0.01 WETH
 - receiver: The address to receive the shares
 - tokenAddress: The address of the token to approve
 
 Important notes:
 - Make sure to use the exact amount provided. Do not convert units for assets for this action.
 - Please use a token address (example 0x4200000000000000000000000000000000000006) for the tokenAddress field.
 `,
    schema: YelayDepositSchema,
  })
  async deposit(
    wallet: EvmWalletProvider,
    args: z.infer<typeof YelayDepositSchema>,
  ): Promise<string> {
    const assets = BigInt(args.assets);

    if (assets <= 0) {
      return "Error: Assets amount must be greater than 0";
    }

    try {
      const decimals = await wallet.readContract({
        address: args.tokenAddress as Hex,
        abi,
        functionName: "decimals",
        args: [],
      });

      const atomicAssets = parseUnits(args.assets, decimals);

      const data = encodeFunctionData({
        abi: YELAY_VAULT_ABI,
        functionName: "deposit",
        args: [atomicAssets, args.receiver],
      });

      const txHash = await wallet.sendTransaction({
        to: args.vaultAddress as `0x${string}`,
        data,
      });

      const receipt = await wallet.waitForTransactionReceipt(txHash);

      return `Deposited ${args.assets} to Yelay Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
    } catch (error) {
      return `Error depositing to Yelay Vault: ${error}`;
    }
  }

  /**
   * redeems assets from a Yelay Vault
   *
   * @param wallet - The wallet instance to execute the transaction
   * @param args - The input arguments for the action
   * @returns A success message with transaction details or an error message
   */
  @CreateAction({
    name: "redeem",
    description: `
  This tool allows redeeming assets from a Yelay Vault. It takes:
  
  - vaultAddress: The address of the Yelay Vault to redeem from
  - assets: The amount of assets to redeem in atomic units (wei)
  - receiver: The address to receive the shares
  `,
    schema: YelayRedeemSchema,
  })
  async redeem(
    wallet: EvmWalletProvider,
    args: z.infer<typeof YelayRedeemSchema>,
  ): Promise<string> {
    if (BigInt(args.assets) <= 0) {
      return "Error: Assets amount must be greater than 0";
    }

    try {
      const data = encodeFunctionData({
        abi: YELAY_VAULT_ABI,
        functionName: "redeem",
        args: [BigInt(args.assets), args.receiver, args.receiver],
      });

      const txHash = await wallet.sendTransaction({
        to: args.vaultAddress as `0x${string}`,
        data,
      });

      const receipt = await wallet.waitForTransactionReceipt(txHash);

      return `redeemn ${args.assets} from Yelay Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
    } catch (error) {
      return `Error redeeming from Yelay Vault: ${error}`;
    }
  }

  /**
   * Claims yield from Yelay
   *
   * @param wallet - The wallet instance to execute the transaction
   * @param args - The input arguments for the action
   * @returns A success message with transaction details or an error message
   */
  @CreateAction({
    name: "claim",
    description: `
  This tool allows claiming yield from a Yelay Vault. It takes:

  - vaultAddress: The address of the Yelay Vault to claim yield from
  - assets: The amount of assets to claim in atomic units (wei)
  - receiver: The address to receive the yield
  `,
    schema: YelayClaimSchema,
  })
  async claim(wallet: EvmWalletProvider, args: z.infer<typeof YelayClaimSchema>): Promise<string> {
    if (BigInt(args.assets) <= 0) {
      return "Error: Assets amount must be greater than 0";
    }

    try {
      const data = encodeFunctionData({
        abi: YIELD_EXTRACTOR_ABI,
        functionName: "claim",
        args: [BigInt(args.assets), args.receiver],
      });

      const txHash = await wallet.sendTransaction({
        to: args.vaultAddress as `0x${string}`,
        data,
      });

      const receipt = await wallet.waitForTransactionReceipt(txHash);

      return `claimed ${args.assets} from Yelay Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
    } catch (error) {
      return `Error claiming yield from Yelay Vault: ${error}`;
    }
  }

  /**
   * Checks if this provider supports the given network.
   *
   * @param network - The network to check support for
   * @returns True if the network is supported
   */
  supportsNetwork(network: Network): boolean {
    // Check if the network is EVM and its chain ID is in the supported list
    return (
      network.protocolFamily === "evm" &&
      network.chainId !== undefined &&
      SUPPORTED_NETWORKS.includes(network.chainId)
    );
  }
}

/**
 * Factory function to create a new YelayActionProvider instance.
 *
 * @returns A new YelayActionProvider instance
 */
export const yelayActionProvider = () => new YelayActionProvider();
