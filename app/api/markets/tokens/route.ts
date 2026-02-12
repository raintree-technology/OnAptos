import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CACHE_DURATIONS, getCacheHeaders, successResponse } from "@/lib/utils/api/common";
import { PanoraTokenListService } from "@/lib/utils/api/panora-token-list";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";

export const revalidate = 900; // 15 minutes for token list

type TokenOut = {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  fullyDilutedValuation?: number;
  fdv?: number;
  supply?: number;
  priceChange24H?: number;
  category?: string;
  bridge?: string | null;
  logoUrl?: string | null;
  panoraSymbol?: string;
  panoraTags?: string[];
  panoraUI?: boolean;
  websiteUrl?: string | null;
  faAddress?: string | null;
  tokenAddress?: string | null;
  coinGeckoId?: string | null;
  rank?: number;
  isVerified?: boolean;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit") || 100);
  const offsetParam = Number(url.searchParams.get("offset") || 0);
  const _all = url.searchParams.get("all") === "true";

  const limit = Math.max(1, Math.min(1000, limitParam));
  const offset = Math.max(0, offsetParam);

  try {
    // Load full token list from Panora and cache it
    const panoraTokens = await serverCached(
      ["markets:tokens:full"],
      async () => PanoraTokenListService.getTokenList(),
      { revalidate: revalidate, tags: ["markets:tokens"] }
    );

    // Map to UI-friendly format
    const mapped: TokenOut[] = panoraTokens.map((t, idx) => ({
      name: t.name,
      symbol: t.symbol,
      price: t.usdPrice ? parseFloat(t.usdPrice) : 0,
      marketCap: 0,
      fullyDilutedValuation: 0,
      fdv: 0,
      supply: 0,
      priceChange24H: 0,
      category: t.panoraTags?.[0] || (t.bridge ? "Bridged" : "Native"),
      bridge: t.bridge,
      logoUrl: t.logoUrl,
      panoraSymbol: t.panoraSymbol,
      panoraTags: t.panoraTags,
      panoraUI: t.panoraUI,
      websiteUrl: t.websiteUrl,
      faAddress: t.faAddress,
      tokenAddress: t.tokenAddress,
      coinGeckoId: t.coinGeckoId,
      rank: t.panoraIndex ?? idx + 1,
      isVerified: (t.panoraTags || []).includes("Verified"),
    }));

    // Compute summary + distribution (best-effort with available fields)
    const _prices = mapped.map((m) => m.price).filter((n) => typeof n === "number");
    const totalMarketCap = 0; // Unknown without supplies; keep 0
    const aptPrice = 0; // not used directly
    const totalTokens = mapped.length;

    const distribution = [
      { range: "> $1B", count: 0 },
      { range: "$100M - $1B", count: 0 },
      { range: "$10M - $100M", count: 0 },
      { range: "$1M - $10M", count: 0 },
      { range: "$100K - $1M", count: 0 },
      { range: "< $100K", count: 0 },
    ];

    // Pagination
    const pageTokens = mapped.slice(offset, offset + limit);

    const body = {
      tokens: pageTokens,
      totalTokens,
      limit,
      offset,
      nextOffset: offset + limit < totalTokens ? offset + limit : null,
      totalMarketCap,
      aptPrice,
      categories: {},
      distribution,
    };

    return successResponse(body, CACHE_DURATIONS.LONG, {
      ...getCacheHeaders(CACHE_DURATIONS.LONG),
      "X-Tokens-Total": String(totalTokens),
    });
  } catch (error) {
    apiLogger.error("/api/markets/tokens error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
