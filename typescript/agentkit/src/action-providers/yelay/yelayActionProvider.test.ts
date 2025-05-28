import { YelayActionProvider } from "./yelayActionProvider";
import { Network } from "../../network";
import { APYResponse, ClaimRequestRaw, VaultsDetailsResponse } from "./types";
import { EvmWalletProvider } from "../../wallet-providers";
import { RETAIL_POOL_ID, YELAY_VAULT_ABI, YIELD_EXTRACTOR_ABI, getEnvironment } from "./constants";
import { encodeFunctionData, parseEther } from "viem";

const mockFetchResult = (status: number, data: object) => {
  return {
    json: async () => data,
    status,
    ok: status >= 200 && status < 400,
  };
};

const MOCK_VAULT_ADDRESS = "0x1234567890123456789012345678901234567890";
const MOCK_WHOLE_ASSETS = "1";
const MOCK_RECEIVER_ID = "0x9876543210987654321098765432109876543210";
const MOCK_TX_HASH = "0xabcdef1234567890";
const MOCK_RECEIPT = { status: 1, blockNumber: 1234567 };
const MOCK_DECIMALS = 18;

const mockVaults: VaultsDetailsResponse[] = [
  {
    address: "0x123...",
    name: "Base WETH Vault",
    symbol: "WETH",
    balance: "1000",
    decimals: 18,
  },
  {
    address: "0x456...",
    name: "Base USDC Vault",
    symbol: "USDC",
    balance: "500000",
    decimals: 6,
  },
];

const mockAPYs: APYResponse[] = [
  {
    vault: "0x123...",
    startBlock: 1000,
    finishBlock: 2000,
    startTimestamp: 1234567890,
    finishTimestamp: 1234667890,
    yield: "100",
    apy: "3.4",
  },
  {
    vault: "0x456...",
    startBlock: 1000,
    finishBlock: 2000,
    startTimestamp: 1234567890,
    finishTimestamp: 1234667890,
    yield: "50",
    apy: "5.2",
  },
];

const mockClaimProof: ClaimRequestRaw[] = [
  {
    yelayLiteVault: MOCK_VAULT_ADDRESS,
    projectId: RETAIL_POOL_ID,
    cycle: 1,
    yieldSharesTotal: "100",
    blockNumber: 1234567,
    proof: ["0x123..."],
  },
];

describe("YelayActionProvider", () => {
  const provider = new YelayActionProvider(8453, true);
  const config = getEnvironment(8453, true);
  let mockWallet: jest.Mocked<EvmWalletProvider>;
  let mockedFetch: jest.Mock;
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = mockedFetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    mockWallet = {
      getAddress: jest.fn().mockReturnValue(MOCK_RECEIVER_ID),
      getNetwork: jest.fn().mockReturnValue({ protocolFamily: "evm", networkId: "8453" }),
      sendTransaction: jest.fn().mockResolvedValue(MOCK_TX_HASH as `0x${string}`),
      waitForTransactionReceipt: jest.fn().mockResolvedValue(MOCK_RECEIPT),
      readContract: jest.fn().mockResolvedValue(MOCK_DECIMALS),
    } as unknown as jest.Mocked<EvmWalletProvider>;
  });

  describe("network support", () => {
    it("should support the protocol EVM family", () => {
      expect(
        provider.supportsNetwork({
          protocolFamily: "evm",
          chainId: "8453",
        } as Network),
      ).toBe(true);
    });

    it("should support the Base, Mainnet and Sonic networks", () => {
      const networks = ["1", "146", "8453"];
      networks.forEach(network => {
        expect(
          provider.supportsNetwork({
            protocolFamily: "evm",
            chainId: network,
          } as Network),
        ).toBe(true);
      });
    });

    it("should not support other than base, mainnet and sonic networks", () => {
      expect(
        provider.supportsNetwork({
          protocolFamily: "evm",
          chainId: "10",
        } as Network),
      ).toBe(false);
    });

    it("should not support other protocol families", () => {
      expect(
        provider.supportsNetwork({
          protocolFamily: "other-protocol-family",
          chainId: "8453",
        } as Network),
      ).toBe(false);
    });
  });

  describe("getVaults action", () => {
    it("returns list of vaults with their APYs", async () => {
      mockedFetch
        .mockResolvedValueOnce(mockFetchResult(200, mockVaults))
        .mockResolvedValueOnce(mockFetchResult(200, mockAPYs));

      const result = await provider.getVaults();

      expect(result).toBe("Base WETH Vault: APY 3.4%\nBase USDC Vault: APY 5.2%");
    });

    it("returns error message when vaults API fails", async () => {
      mockedFetch.mockResolvedValue(mockFetchResult(500, mockVaults));

      const result = await provider.getVaults();
      expect(result).toBe("Yield backend is currently unavailable. Please try again later.");
    });

    it("returns error message when APY API fails", async () => {
      mockedFetch.mockResolvedValue(mockFetchResult(500, mockAPYs));

      const result = await provider.getVaults();
      expect(result).toBe("Yield backend is currently unavailable. Please try again later.");
    });
  });

  describe("deposit action", () => {
    it("should deposit assets into a specified Yelay Vault", async () => {
      const args = {
        assets: MOCK_WHOLE_ASSETS,
        receiver: MOCK_VAULT_ADDRESS,
      };

      const atomicAssets = parseEther(MOCK_WHOLE_ASSETS);

      const response = await provider.deposit(mockWallet, args);

      expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
        to: config.contracts.VaultWrapper,
        data: encodeFunctionData({
          abi: YELAY_VAULT_ABI,
          functionName: "deposit",
          args: [atomicAssets, RETAIL_POOL_ID, args.receiver],
        }),
      });

      expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith(MOCK_TX_HASH);
      expect(response).toContain(`Deposited ${MOCK_WHOLE_ASSETS}`);
      expect(response).toContain(MOCK_TX_HASH);
      expect(response).toContain(JSON.stringify(MOCK_RECEIPT));
    });
  });

  describe("redeem action", () => {
    it("should redeem assets from a specified Yelay Vault", async () => {
      const args = {
        assets: MOCK_WHOLE_ASSETS,
        receiver: MOCK_VAULT_ADDRESS,
      };

      const response = await provider.redeem(mockWallet, args);

      expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
        to: config.contracts.VaultWrapper,
        data: encodeFunctionData({
          abi: YELAY_VAULT_ABI,
          functionName: "redeem",
          args: [BigInt(args.assets), RETAIL_POOL_ID, args.receiver],
        }),
      });

      expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith(MOCK_TX_HASH);
      expect(response).toContain(`Redeemed ${MOCK_WHOLE_ASSETS}`);
      expect(response).toContain(MOCK_TX_HASH);
      expect(response).toContain(JSON.stringify(MOCK_RECEIPT));
    });
  });

  describe("claim action", () => {
    it("should claim yield from a specified Yelay Vault", async () => {
      const args = {
        vaultAddress: MOCK_VAULT_ADDRESS,
      };

      mockedFetch.mockResolvedValue(mockFetchResult(200, mockClaimProof));
      const response = await provider.claim(mockWallet, args);

      const expectedTransformedClaimProof = mockClaimProof.map(c => ({
        yelayLiteVault: c.yelayLiteVault,
        pool: c.projectId,
        cycle: c.cycle,
        yieldSharesTotal: c.yieldSharesTotal,
        blockNumber: c.blockNumber,
        proof: c.proof,
      }));

      console.log("expectedTransformedClaimProof", expectedTransformedClaimProof);

      expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
        to: config.contracts.YieldExtractor,
        data: encodeFunctionData({
          abi: YIELD_EXTRACTOR_ABI,
          functionName: "claim",
          args: [expectedTransformedClaimProof],
        }),
      });

      expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith(MOCK_TX_HASH);
      expect(response).toContain(`Claimed yield from Yelay Vault ${MOCK_VAULT_ADDRESS}`);
      expect(response).toContain(MOCK_TX_HASH);
      expect(response).toContain(JSON.stringify(MOCK_RECEIPT));
    });
  });
});
