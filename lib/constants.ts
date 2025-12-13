export const CACHE_TTL_MS = 30_000;
export const ORDERBOOK_POLL_MS = 30_000;
export const DEPOSIT_POLL_MS = 30_000;
export const DEFAULT_PAGE_LIMIT = 20;
export const DEFAULT_TRADES_LIMIT = 50;

export const MINIMUM_DEPOSITS: Record<string, { amount: number; usdEquivalent: string }> = {
  ETH: { amount: 0.001, usdEquivalent: "~$3.50" },
  USDC: { amount: 5, usdEquivalent: "$5.00" },
  USDT: { amount: 5, usdEquivalent: "$5.00" },
};

export const SUPPORTED_CRYPTO_TOKENS = ["ETH", "USDC", "USDT"] as const;
export type CryptoToken = typeof SUPPORTED_CRYPTO_TOKENS[number];

export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const isValidEthAddress = (address: string): boolean => ETH_ADDRESS_REGEX.test(address);

export const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback;
