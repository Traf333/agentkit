# Yelay Action Provider

This directory contains the **YelayActionProvider** implementation, which provides actions for interacting with Yelay Vaults.

## Overview

The YelayActionProvider is designed to work with EvmWalletProvider for blockchain interactions. It provides a set of actions that enable users to interact with Yelay Vaults, including depositing assets, redeeming shares, and claiming yield.

## Directory Structure

```
yelay/
├── yelayActionProvider.ts       # Main provider implementation
├── yelayActionProvider.test.ts  # Provider test suite
├── schemas.ts                  # Action schemas and types
├── constants.ts                # Provider constants
├── types.ts                    # Type definitions
├── index.ts                    # Package exports
└── README.md                   # Documentation (this file)
```

## Actions

### Get Vaults
- `get_vaults`: Get the list of available Yelay Vaults with their current APY
  - **Purpose**: Fetches the list of all available Yelay Vaults along with their current APY
  - **Input**: None
  - **Output**: String containing formatted list of vaults with their APY
  - **Example**:
    ```typescript
    const vaults = await provider.getVaults();
    // Returns: "Base WETH Vault: APY 3.4%\nBase USDC Vault: APY 5.2%"
    ```

### Deposit
- `deposit`: Deposit assets into a specified Yelay Vault
  - **Purpose**: Deposits assets into a Yelay Vault
  - **Input**:
    - `assets` (string): The amount of assets to deposit in whole units (e.g., "1.0")
    - `receiver` (string): The address of the Yelay Vault to deposit to (0x... format)
  - **Output**: String describing the deposit result including transaction hash
  - **Example**:
    ```typescript
    const result = await provider.deposit(walletProvider, {
      assets: "1.0",
      receiver: "0x1234..."
    });
    ```

### Redeem
- `redeem`: Redeem assets from a specified Yelay Vault
  - **Purpose**: Redeems assets from a Yelay Vault
  - **Input**:
    - `assets` (string): The amount of assets to redeem in whole units (e.g., "1.0")
    - `receiver` (string): The address of the Yelay Vault to redeem from (0x... format)
  - **Output**: String describing the redeem result including transaction hash
  - **Example**:
    ```typescript
    const result = await provider.redeem(walletProvider, {
      assets: "1.0",
      receiver: "0x1234..."
    });
    ```

### Claim
- `claim`: Claim yield from a specified Yelay Vault
  - **Purpose**: Claims accumulated yield from a Yelay Vault
  - **Input**:
    - `vaultAddress` (string): The address of the Yelay Vault to claim yield from (0x... format)
  - **Output**: String describing the claim result including transaction hash
  - **Example**:
    ```typescript
    const result = await provider.claim(walletProvider, {
      vaultAddress: "0x1234..."
    });
    ```

## Network Support

This provider supports the following EVM networks:
- Base Mainnet (chainId: 8453)
- Ethereum Mainnet (chainId: 1)
- Sonic (chainId: 146)

### Wallet Provider Integration

This provider is specifically designed to work with EvmWalletProvider. Key integration points:
- Network compatibility checks
- Transaction signing and execution
- Balance and account management
- Smart contract interaction

## Error Handling

All actions return user-friendly error messages when something goes wrong. Common error cases include:
- Network connectivity issues
- Insufficient funds
- Invalid input parameters
- Transaction failures

## Testing

Comprehensive test coverage is provided in `yelayActionProvider.test.ts`. When implementing new actions:
1. Add unit tests for schema validations
2. Test network support
3. Include error case testing
4. Test edge cases for input validation

## Notes

- All amounts should be provided in whole units (e.g., "1.0" for 1 token)
- The provider handles conversion to atomic units internally
- For test environments, set `isTest: true` when initializing the provider
- The provider includes built-in error handling and user-friendly messages
