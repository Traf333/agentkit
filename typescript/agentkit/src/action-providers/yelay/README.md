# Yelay Action Provider

This directory contains the **YelayActionProvider** implementation, which provides actions to interact with **Yelay Vaults** on EVM-compatible networks.

## Directory Structure

```
yelay/
├── yelayActionProvider.ts       # Main provider with Yelay Vault functionality
├── yelayActionProvider.test.ts  # Test file for Yelay provider
├── constants.ts                # Constants for Yelay provider
├── schemas.ts                  # Action schemas
├── types.ts                    # Type definitions
└── README.md                   # This file
```

## Actions

- `get_vaults`: Get the list of available Yelay Vaults with their current APY
  - Returns a formatted list of all available Yelay Vaults with their APY
  - Example:
    ```typescript
    const vaults = await provider.getVaults();
    // Returns: "Base WETH Vault: APY 3.4%\nBase USDC Vault: APY 5.2%"
    ```

- `deposit`: Deposit assets into a Yelay Vault
  - Deposits the specified amount of assets into the target vault
  - Example:
    ```typescript
    const result = await provider.deposit(walletProvider, {
      assets: "1.0",
      receiver: "0x1234..."
    });
    ```

- `redeem`: Redeem assets from a Yelay Vault
  - Redeems the specified amount of assets from the target vault
  - Example:
    ```typescript
    const result = await provider.redeem(walletProvider, {
      assets: "1.0",
      receiver: "0x1234..."
    });
    ```

- `claim`: Claim yield from a Yelay Vault
  - Claims accumulated yield from the specified vault
  - Example:
    ```typescript
    const result = await provider.claim(walletProvider, {
      vaultAddress: "0x1234..."
    });
    ```

## Adding New Actions

To add new Yelay actions:

1. Define your action schema in `schemas.ts`. See [Defining the input schema](https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING-TYPESCRIPT.md#defining-the-input-schema) for more information.
2. Implement the action in `yelayActionProvider.ts`
3. Add tests in `yelayActionProvider.test.ts`

## Network Support

The Yelay provider supports the following EVM networks:
- Base Mainnet (chainId: 8453)
- Ethereum Mainnet (chainId: 1)
- Sonic (chainId: 146)

## Notes

- All amounts should be provided in whole units (e.g., "1.0" for 1 token)
- The provider handles conversion to atomic units internally
- The provider includes built-in error handling and user-friendly messages
