import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    {
      tokenId: BigNumber.from("2"),
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
    beforeEach(() => {
      marketplaceTestingUtils.address = CONTRACT_ADDRESS;
      const items = getItems(CONTRACT_ADDRESS);
      // Setup
      marketplaceTestingUtils
        .mockCall("fetchMarketItems", [items])
        // https://ipfs.infura.io/token-hash map to a MSW handler URL
        .mockCall("tokenURI", ["https://ipfs.infura.io/ipfs/nft-1"], {
          callValues: [1],
        })
        .mockCall("tokenURI", ["https://ipfs.infura.io/ipfs/nft-2"], {
          callValues: [2],
        });
    });

    it("should list all the NFTs", async () => {
      // Act
      const screen = render(<Home />);

      await waitFor(() => {
        // name, description and image are coming from MSW mocked API
        expect(screen.getByText("Mocked NFT 1")).toBeInTheDocument();
        expect(screen.getByText("This is a Mocked NFT 1")).toBeInTheDocument();
        expect(screen.getByText("Mocked NFT 2")).toBeInTheDocument();
        expect(screen.getByText("This is a Mocked NFT 2")).toBeInTheDocument();
        expect(screen.getAllByTestId("nft-image").length).toBe(2);
        expect(screen.getAllByTestId("buy-button").length).toBe(2);
      });
    });

    it("should allow a user to buy an NFT", async () => {
      marketplaceTestingUtils.mockTransaction("createMarketSale", undefined, {
        triggerCallback: () => {
          const [_bought, ...items] = getItems(CONTRACT_ADDRESS);
          marketplaceTestingUtils.mockCall("fetchMarketItems", [items]);
        },
      });
      const screen = render(<Home />);

      await waitFor(async () => {
        const [buyBtn] = screen.getAllByTestId("buy-button");
        userEvent.click(buyBtn);

        await waitForElementToBeRemoved(buyBtn);
        expect(screen.queryByText("Mocked NFT 1")).not.toBeInTheDocument();
      });
    });
  });
});
