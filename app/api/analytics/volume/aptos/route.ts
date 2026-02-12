import { NextResponse } from "next/server";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";

export async function GET() {
  try {
    const result = await serverCached(
      ["analytics:volume:aptos"],
      async () => {
        const [globalResponse, aptosProtocolsResponse] = await Promise.allSettled([
          fetch("https://api.llama.fi/overview/dexs?excludeTotalDataChart=true", {
            next: { revalidate: 300 },
          }),
          fetch("https://api.llama.fi/overview/dexs/aptos?excludeTotalDataChart=true", {
            next: { revalidate: 300 },
          }),
        ]);

        let globalVolume: any = null;
        let aptosVolume: any = null;
        let aptosMarketShare: number | null = null;

        if (globalResponse.status === "fulfilled" && globalResponse.value.ok) {
          const globalData = await globalResponse.value.json();
          globalVolume = {
            volume24h: globalData.total24h || 0,
            volume7d: globalData.total7d || 0,
            change1d: globalData.change_1d || 0,
            change7d: globalData.change_7d || 0,
          };
        }

        if (aptosProtocolsResponse.status === "fulfilled" && aptosProtocolsResponse.value.ok) {
          const aptosData = await aptosProtocolsResponse.value.json();
          aptosVolume = {
            volume24h: aptosData.total24h || 0,
            volume7d: aptosData.total7d || 0,
            change1d: aptosData.change_1d || 0,
            change7d: aptosData.change_7d || 0,
            topProtocols: aptosData.protocols?.slice(0, 5) || [],
          };
        }

        if (globalVolume && aptosVolume && globalVolume.volume24h > 0) {
          aptosMarketShare = (aptosVolume.volume24h / globalVolume.volume24h) * 100;
        }

        return {
          globalVolume,
          aptosVolume,
          marketShare: aptosMarketShare,
          lastUpdated: new Date().toISOString(),
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:volume:aptos"] }
    );

    apiLogger.info("Aptos volume context data fetched successfully", {
      globalVolume24h: result?.globalVolume?.volume24h || 0,
      aptosVolume24h: result?.aptosVolume?.volume24h || 0,
      marketShare: result?.marketShare || 0,
    });

    return NextResponse.json(result, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching Aptos volume context data:", error);
    return NextResponse.json({ error: "Failed to fetch volume context data" }, { status: 500 });
  }
}
