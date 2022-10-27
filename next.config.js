/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
    INFURA_IPFS_API_SECRET: process.env.INFURA_IPFS_API_SECRET,
    INFURA_IPFS_SUBDOMAIN: process.env.INFURA_IPFS_SUBDOMAIN,
  },
};

module.exports = nextConfig;
