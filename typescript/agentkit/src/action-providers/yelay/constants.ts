import { ChainId, SDKConfig } from "./types";

export const RETAIL_POOL_ID = 10;

export const YELAY_VAULT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "yelayLiteVault",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapTarget",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "swapCallData",
            type: "bytes",
          },
        ],
        internalType: "struct SwapArgs",
        name: "swapArgs",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "swapAndDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "yelayLiteVault",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "wrapEthAndDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

export const YIELD_EXTRACTOR_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "yelayLiteVault", type: "address" },
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cycle",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yieldSharesTotal",
            type: "uint256",
          },
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
        ],
        internalType: "struct YieldExtractor.ClaimRequest[]",
        name: "data",
        type: "tuple[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "yieldSharesClaimed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const getEnvironment = (chainId: ChainId, testing: boolean): SDKConfig => {
  if (chainId !== 8453 && testing) {
    throw new Error("Test environment is only supported for Base");
  }
  const backendUrl = "https://lite.api.yelay.io/v2";
  if (chainId === 8453) {
    if (testing) {
      return {
        contracts: {
          VaultWrapper: "0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b",
          YieldExtractor: "0xf3b5e160898cfd8b89476e77887050abb377c277",
        },
        backendUrl: "https://lite.dev.yelay.io/v2",
      };
    } else {
      return {
        contracts: {
          VaultWrapper: "0xdccf337ea77b687a4daca5586351b08f8927c825",
          YieldExtractor: "0x4d6a89dc55d8bacc0cbc3824bd7e44fa051c3958",
        },
        backendUrl,
      };
    }
  }
  if (chainId === 1) {
    return {
      contracts: {
        VaultWrapper: "0xf65d02700915259602D9105b66401513D1CB61ff",
        YieldExtractor: "0x226239384EB7d78Cdf279BA6Fb458E2A4945E275",
      },
      backendUrl,
    };
  }
  if (chainId === 146) {
    return {
      contracts: {
        VaultWrapper: "0x0872e8391662D4e53D6649c8dE5d4bF581Bd778C",
        YieldExtractor: "0xB84B621D3da3E5e47A1927883C685455Ad731D7C",
      },
      backendUrl,
    };
  }
  throw new Error(`Chain ${chainId} is not supported`);
};
