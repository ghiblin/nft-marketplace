import { rest } from "msw";

const nfts = {
  "nft-1": {
    name: "Mocked NFT 1",
    description: "This is a Mocked NFT 1",
    image: "http://example.com/my-image-1",
  },
  "nft-2": {
    name: "Mocked NFT 2",
    description: "This is a Mocked NFT 2",
    image: "http://example.com/my-image-2",
  },
};

export const handlers = [
  rest.get("https://ipfs.infura.io/ipfs/:hash", (req, res, ctx) => {
    if (req.params.hash in nfts) {
      return res(ctx.json(nfts[req.params.hash]));
    }
    return res(ctx.status(404));
  }),
];
