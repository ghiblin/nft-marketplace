import { render, waitFor } from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import { BigNumber, utils } from "ethers";

import Marketplace from "../build/contracts/NFTMarketplace.json";
import Home from "./index.page";

const OWNER = "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf";
const CONTRACT_ADDRESS = "0x0fa97a96cc54107c7293e58d4bd0e5e524beed25";

function getItems(address) {
  return [
    {
      tokenId: BigNumber.from("1"),
      seller: OWNER,
      owner: address,
      sold: false,
      price: utils.parseUnits("1"),
    },
  ];
}

describe("Home", () => {
  const testingUtils = generateTestingUtils({
    providerType: "MetaMask",
  });
  let marketplaceTestingUtils = testingUtils.generateContractUtils(
    Marketplace.abi
  );

  let originalEth;
  beforeAll(() => {
    originalEth = global.window.ethereum;
    // Manually inject the mocked provider in the window as MetaMask does
    global.window.ethereum = testingUtils.getProvider();
  });

  afterAll(() => {
    // reset original ethereum
    global.window.ethereum = originalEth;
  });

  // mock wallet for any test
  // TODO: there is a warning in the console telling that
  // There is already a persistent registered mock for eth_accounts, this additional
  // mocking will not be considered.
  beforeEach(() => {
    testingUtils.mockConnectedWallet([OWNER]);
  });

  // clear mocks
  afterEach(() => {
    testingUtils.clearAllMocks();
  });

  describe("when no NFT is listed", () => {
    it("should alert user no NFT is listed", async () => {
      // Setup
      marketplaceTestingUtils.mockCall("fetchMarketItems", [[]]);

      // Act
      const screen = render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("No items in marketplace")).toBeInTheDocument();
      });
    });
  });

  describe("when there is NFT on the market", () => {
    it("should list all the NFTs", async () => {
      marketplaceTestingUtils.address = CONTRACT_ADDRESS;
      const items = getItems(CONTRACT_ADDRESS);
      // Setup
      marketplaceTestingUtils
        .mockCall("fetchMarketItems", [items])
        // https://ipfs.infura.io/token-hash map to a MSW handler URL
        .mockCall("tokenURI", ["https://ipfs.infura.io/token-hash"]);

      // Act
      const screen = render(<Home />);

      await waitFor(() => {
        // name, description and image are coming from MSW mocked API
        expect(screen.getByText("Mocked NFT")).toBeInTheDocument();
        expect(screen.getByText("This is a Mocked NFT")).toBeInTheDocument();
        expect(screen.getByTestId("nft-image")).toBeInTheDocument();
      });
    });
  });
});
