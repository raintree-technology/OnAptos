export const CACHE_DURATIONS = {
  INSTANT: 0,
  VERY_SHORT: 60,
  SHORT: 120,
  MEDIUM: 300,
  LONG: 600,
  VERY_LONG: 1800,
  HOUR: 3600,
} as const;

export const CACHE_HEADERS = {
  SHORT: "public, s-maxage=300, stale-while-revalidate=600",
  MEDIUM: "public, s-maxage=900, stale-while-revalidate=1800",
  LONG: "public, s-maxage=3600, stale-while-revalidate=7200",
  VERY_LONG: "public, s-maxage=3600, stale-while-revalidate=7200",
  NO_CACHE: "no-cache, no-store, must-revalidate",
  REVALIDATE: "public, must-revalidate, stale-while-revalidate=60",
  ERROR: "public, max-age=60, stale-while-revalidate=120",
  PORTFOLIO: {
    ASSETS: "public, s-maxage=300, stale-while-revalidate=600",
    NFTS: "public, s-maxage=120, stale-while-revalidate=240",
    DEFI: "public, s-maxage=300, stale-while-revalidate=600",
    TRANSACTIONS: "public, s-maxage=60, stale-while-revalidate=120",
    BATCH: "public, s-maxage=300, stale-while-revalidate=600",
  },
  MARKETS: {
    PRICES: "public, s-maxage=30, stale-while-revalidate=60",
    ANALYTICS: "public, s-maxage=180, stale-while-revalidate=360",
    TOKENS: "public, s-maxage=900, stale-while-revalidate=1800",
  },
} as const;

export function addCacheHeaders(response: Response, cacheControl: string): Response {
  response.headers.set("Cache-Control", cacheControl);
  return response;
}

export function createCacheHeaders(cacheControl: string): Record<string, string> {
  return {
    "Cache-Control": cacheControl,
  };
}

export function getCacheHeaders(duration: number = CACHE_DURATIONS.MEDIUM): Record<string, string> {
  return {
    "Cache-Control": `public, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`,
  };
}
