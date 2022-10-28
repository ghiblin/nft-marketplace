const fs = require("fs");
const Marketplace = artifacts.require("NFTMarketplace");

async function main(cb) {
  try {
    const marketplace = await Marketplace.deployed();

    fs.writeFileSync(
      "./src/config.js",
      `
    export const marketplaceAddress = "${marketplace.address}"
    `
    );
  } catch (err) {
    console.log("Doh! ", err);
  }
  cb();
}

module.exports = main;
