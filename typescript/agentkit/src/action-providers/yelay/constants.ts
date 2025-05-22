export const BASE_YELAY_VAULTS = {
  WETH: "0xf0533a9eb11b144ac3b9bbe134728d0f7f547c52",
  USDC: "0x0c6daf9b4e0eb49a0c80c325da82ec028cb8118b",
  cbBTC: "0x47a879ac3c9646116326b4a1462e1d477056aff0",
} as const;

export const RETAIL_POOL_ID = 10;

export const YELAY_VAULT_ABI = [
  "function deposit(address _token, uint256 _amount, uint256 _poolId) external",
  "function redeem(address _token, uint256 _amount, uint256 _poolId) external",
];

export const YIELD_EXTRACTOR_ABI = ["function claim(address _token, uint256 _amount) external"];
