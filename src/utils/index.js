// enum for LoadingStates
export const LoadingStates = {
  NotLoaded: "not-loaded",
  Loaded: "loaded",
};

/**
 * Format an Ethereum address
 * @param {string} addr - Address to format
 * @returns string - Formatted address
 */
export function formatAddress(addr) {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}
