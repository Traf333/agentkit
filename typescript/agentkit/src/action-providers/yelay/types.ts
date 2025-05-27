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

export type ClaimRequestRaw = {
  yelayLiteVault: string;
  projectId: number;
  cycle: number;
  yieldSharesTotal: string;
  blockNumber: number;
  proof: string[];
};

export type ClaimRequest = {
  yelayLiteVault: string;
  pool: number;
  cycle: number;
  yieldSharesTotal: string;
  blockNumber: number;
  proof: string[];
};

export type SDKConfig = {
  backendUrl: string;
  contracts: {
    VaultWrapper: `0x${string}`;
    YieldExtractor: `0x${string}`;
  };
};

export type ChainId = 1 | 146 | 8453;
