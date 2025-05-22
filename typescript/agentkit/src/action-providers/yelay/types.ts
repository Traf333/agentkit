export type VaultsDetailsResponse = {
  vaults: {
    address: string;
    name: string;
    symbol: string;
    balance: string;
    decimals: number;
  }[];
};
