export type VaultsDetailsResponse = {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
};

export type APYResponse = {
  vault: string;
  startBlock: number;
  finishBlock: number;
  startTimestamp: number;
  finishTimestamp: number;
  yield: string;
  apy: string;
};

export type SDKConfig = {
  backendUrl: string;
  contracts: {
    VaultWrapper: string;
    YieldExtractor: string;
  };
};

export type ChainId = 1 | 146 | 8453;
