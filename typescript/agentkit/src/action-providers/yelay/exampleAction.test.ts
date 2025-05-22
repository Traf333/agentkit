/**
 * ExampleAction Tests
 */

import { YelayActionProvider } from "./yelayActionProvider";
import { ExampleActionSchema } from "./schemas";
import { EvmWalletProvider } from "../../wallet-providers";

describe("Example Action", () => {
  // default setup: instantiate the provider
  const provider = new YelayActionProvider();

  // mock wallet provider setup
  let mockWalletProvider: jest.Mocked<EvmWalletProvider>;

  beforeEach(() => {
    mockWalletProvider = {
      getAddress: jest.fn(),
      getBalance: jest.fn(),
      getName: jest.fn(),
      getNetwork: jest.fn().mockReturnValue({
        protocolFamily: "evm",
        networkId: "test-network",
      }),
      nativeTransfer: jest.fn(),
    } as unknown as jest.Mocked<EvmWalletProvider>;
  });

  describe("schema validation", () => {
    it("should validate example action schema", () => {
      const validInput = {
        fieldName: "test",
        amount: "1.0",
      };
      const parseResult = ExampleActionSchema.safeParse(validInput);
      expect(parseResult.success).toBe(true);
      if (parseResult.success) {
        expect(parseResult.data.fieldName).toBe("test");
        expect(parseResult.data.amount).toBe("1.0");
      }
    });

    it("should reject invalid example action input", () => {
      const invalidInput = {
        fieldName: "",
        amount: "invalid",
      };
      const parseResult = ExampleActionSchema.safeParse(invalidInput);
      expect(parseResult.success).toBe(false);
    });
  });

  describe("example action execution", () => {
    it("should execute example action with wallet provider", async () => {
      const args = {
        fieldName: "test",
        amount: "1.0",
      };
      const result = await provider.exampleAction(mockWalletProvider, args);
      expect(result).toContain(args.fieldName);
      expect(mockWalletProvider.getNetwork).toHaveBeenCalled();
    });
  });
});
