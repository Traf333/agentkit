/**
 * YelayActionProvider Tests
 */

import { YelayActionProvider } from "./yelayActionProvider";

describe("YelayActionProvider", () => {
  // default setup: instantiate the provider
  const provider = new YelayActionProvider();

  beforeEach(() => {});

  describe("getVaults action execution", () => {
    it("should execute getVaults action", async () => {
      const args = {
        chainId: 1,
      };
      const result = await provider.getVaults(args);
      expect(result).toContain(args.chainId);
    });
  });
});
