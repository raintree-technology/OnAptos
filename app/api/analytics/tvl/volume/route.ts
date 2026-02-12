import { NextResponse } from "next/server";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";

export async function GET() {
  try {
    const volumeMetrics = await serverCached(
      ["analytics:tvl:volume"],
      async () => {
        const dexResponse = await fetch("https://api.llama.fi/overview/dexs/aptos", {
          next: { revalidate: 300 },
        });
        const dexData = dexResponse.ok ? await dexResponse.json() : null;

        const optionsResponse = await fetch("https://api.llama.fi/overview/options/aptos", {
          next: { revalidate: 300 },
        });
        let optionsData = null;
        if (optionsResponse.ok) {
          try {
            optionsData = await optionsResponse.json();
          } catch {
            optionsData = null;
          }
        }

        const bridgeResponse = await fetch("https://api.llama.fi/bridgevolume/aptos", {
          next: { revalidate: 300 },
        });
        let bridgeData = null;
        if (bridgeResponse.ok) {
          try {
            bridgeData = await bridgeResponse.json();
          } catch {
            bridgeData = null;
          }
        }

        return {
          dex: dexData
            ? {
                volume24h: dexData.total24h || 0,
                volume7d: dexData.total7d || 0,
                volumeChange24h: dexData.change_24h || 0,
                volumeChange7d: dexData.change_7d || 0,
                protocols:
                  dexData.protocols?.slice(0, 10).map((protocol: any) => ({
                    name: protocol.name,
                    volume24h: protocol.volume24h || 0,
                    volume7d: protocol.volume7d || 0,
                    change24h: protocol.change_24h || 0,
                    change7d: protocol.change_7d || 0,
                  })) || [],
              }
            : { volume24h: 0, volume7d: 0, volumeChange24h: 0, volumeChange7d: 0, protocols: [] },
          options: optionsData
            ? {
                volume24h: optionsData.total24h || 0,
                volume7d: optionsData.total7d || 0,
                volumeChange24h: optionsData.change_24h || 0,
                protocols: optionsData.protocols || [],
              }
            : { volume24h: 0, volume7d: 0, volumeChange24h: 0, protocols: [] },
          bridge: bridgeData
            ? {
                totalVolume: bridgeData.reduce(
                  (sum: number, entry: any) =>
                    sum + (entry.depositUSD || 0) + (entry.withdrawUSD || 0),
                  0
                ),
                inflows: bridgeData.reduce(
                  (sum: number, entry: any) => sum + (entry.depositUSD || 0),
                  0
                ),
                outflows: bridgeData.reduce(
                  (sum: number, entry: any) => sum + (entry.withdrawUSD || 0),
                  0
                ),
                netFlow: bridgeData.reduce(
                  (sum: number, entry: any) =>
                    sum + (entry.depositUSD || 0) - (entry.withdrawUSD || 0),
                  0
                ),
              }
            : { totalVolume: 0, inflows: 0, outflows: 0, netFlow: 0 },
          trading: {
            totalVolume24h: (dexData?.total24h || 0) + (optionsData?.total24h || 0),
            totalVolume7d: (dexData?.total7d || 0) + (optionsData?.total7d || 0),
            dexDominance:
              dexData?.total24h && optionsData?.total24h
                ? (dexData.total24h / (dexData.total24h + optionsData.total24h)) * 100
                : 100,
            avgDailyVolume: ((dexData?.total7d || 0) + (optionsData?.total7d || 0)) / 7,
          },
          growth: {
            volume24hChange: dexData?.change_24h || 0,
            volume7dChange: dexData?.change_7d || 0,
            isGrowing: (dexData?.change_24h || 0) > 0 && (dexData?.change_7d || 0) > 0,
          },
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:tvl:volume"] }
    );

    apiLogger.info("Aptos volume metrics fetched successfully", {
      dexVolume24h: volumeMetrics.dex.volume24h,
      bridgeVolume: volumeMetrics.bridge.totalVolume,
      totalTradingVolume: volumeMetrics.trading.totalVolume24h,
    });

    return NextResponse.json(volumeMetrics, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching Aptos volume data:", error);
    return NextResponse.json({ error: "Failed to fetch volume data" }, { status: 500 });
  }
}
