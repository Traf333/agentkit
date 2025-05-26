import { YelayActionProvider } from "./yelayActionProvider";
import { Network } from "../../network";

describe("YelayActionProvider", () => {
  const provider = new YelayActionProvider(8453, true);

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
