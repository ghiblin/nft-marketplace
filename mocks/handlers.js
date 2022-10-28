import { rest } from "msw";

export const handlers = [
  rest.get("https://ipfs.infura.io/token-hash", (_req, res, ctx) => {
    return res(
      ctx.json({
        name: "Mocked NFT",
        description: "This is a Mocked NFT",
        image: "http://ipfs.infura.io/ipfs/my-token-image",
      })
    );
  }),
];
