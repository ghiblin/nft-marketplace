const Marketplace = artifacts.require("NFTMarketplace");
const ethers = require("ethers");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("NFTMarketplace", function (accounts) {
  let instance;
  const [owner, other] = accounts;
  beforeEach(async function () {
    instance = await Marketplace.new();
  });

  it("should be deployed", async function () {
    return assert.isTrue(true);
  });

  describe("listing price", function () {
    it("should have an initial value", async () => {
      const listingPrice = await instance.getListingPrice({ from: other });
      assert(listingPrice > 0, "Initial value should greater then 0");
    });
    it("should allow owner to upddate", async () => {
      const value = ethers.utils.parseEther("1.0");
      await instance.updateListingPrice(value, { from: owner });
      const listingPrice = await instance.getListingPrice({ from: owner });

      assert(
        listingPrice.toString(),
        value.toString(),
        "Owner should be able to update listingPrice"
      );
    });
    it("should prevent other users from updating", async () => {
      const value = ethers.utils.parseEther("1.0");
      await expectRevert(
        instance.updateListingPrice(value, { from: other }),
        "Only marketplace owner can update listing price"
      );
    });
  });

  describe("create token", function () {
    it("should create a new token", async () => {
      const listingPrice = await instance.getListingPrice();
      const price = ethers.utils.parseEther("2.5");
      const tokenId = await instance.createToken("token-url", price, {
        from: other,
        value: listingPrice.toString(),
      });
      expect(tokenId.toString(), "1", "It should return tokenId");
      const items = await instance.fetchMarketItems();
      expect(items.length, 0, "It should return one item");
      expect(items[0].tokenId, tokenId, "It should have the right tokenId");
      expect(
        items[0].seller.toString(),
        other.toString(),
        "User should be the seller of the item"
      );
      expect(
        items[0].owner.toString(),
        owner.toString(),
        "Marketplace owner shuold own unsold items"
      );
      expect(items[0].sold, false, "New items should be unsold");
    });
    it("should emit an event", async () => {
      const listingPrice = await instance.getListingPrice();
      const price = ethers.utils.parseEther("2.5");
      const receipt = await instance.createToken("token-url", price, {
        from: other,
        value: listingPrice.toString(),
      });

      expectEvent(receipt, "MarketItemCreated");
    });
  });

  describe("buy token", function () {
    it("should let user buy a token", async () => {
      const listingPrice = await instance.getListingPrice();
      const price = ethers.utils.parseEther("2.5");
      const tokenId = await instance.createToken("token-url", price, {
        from: other,
        value: listingPrice.toString(),
      });
      await instance.createMarketSale(1, {
        from: owner,
        value: price,
      });

      const items = await instance.fetchMarketItems({ from: owner });
      expect(items.lenght, 0, "Item should be sold");
      const myItems = await instance.fetchMyNFTs({ from: owner });
      expect(myItems.lenght, 1, "Item should be in the owner's list of NFTs");
      expect(
        myItems[0].tokenId.toString(),
        tokenId.toString(),
        "Token ids should match"
      );
    });
  });
});
