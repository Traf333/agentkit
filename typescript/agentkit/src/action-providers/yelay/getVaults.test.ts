import { YelayActionProvider } from "./yelayActionProvider";
import type { VaultsDetailsResponse, APYResponse } from "./types";

describe("YelayActionProvider", () => {
  const provider = new YelayActionProvider(8453, true);
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getVaults action execution", () => {
    it("should fetch and merge vaults with their APYs", async () => {
      (global.fetch as jest.Mock)
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockVaults),
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAPYs),
          }),
        );
      const result = await provider.getVaults();

      expect(result).toBe("Base WETH Vault: APY 3.4%\nBase USDC Vault: APY 5.2%");
    });

    it("should throw an error when vaults API fails", async () => {
      // Mock a failed response for the vaults API
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        }),
      );

      const result = await provider.getVaults();
      expect(result).toBe("Yield backend is currently unavailable. Please try again later.");
    });

    it("should returns an error message when APY API fails", async () => {
      // First call succeeds (vaults), second fails (APYs)
      (global.fetch as jest.Mock)
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockVaults),
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 400,
            statusText: "Bad Request",
          }),
        );

      const result = await provider.getVaults();
      expect(result).toBe("Yield backend is currently unavailable. Please try again later.");
    });
  });
});
