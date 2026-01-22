import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";

export async function GET() {
  try {
    const stablecoinMetrics = await serverCached(
      ["analytics:tvl:stablecoins"],
      async () => {
        const stablecoinResponse = await fetch("https://stablecoins.llama.fi/stablecoins", {
          next: { revalidate: 300 },
        });
        if (!stablecoinResponse.ok) {
          throw new Error(`Stablecoin API error: ${stablecoinResponse.status}`);
        }
        const stablecoinsData = await stablecoinResponse.json();

        const chainsResponse = await fetch("https://stablecoins.llama.fi/stablecoinchains", {
          next: { revalidate: 300 },
        });
        let aptosStableData: any = null;
        if (chainsResponse.ok) {
          const chainsData = await chainsResponse.json();
          aptosStableData = chainsData.find(
            (chain: any) => chain.name.toLowerCase() === "aptos" || chain.gecko_id === "aptos"
          );
        }

        return {
          global: {
            totalMarketCap: stablecoinsData?.totalMcap || 0,
            totalStablecoins: stablecoinsData?.stablecoins?.length || 0,
            dominance:
              stablecoinsData?.stablecoins?.slice(0, 3).map((stable: any) => ({
                name: stable.name,
                symbol: stable.symbol,
                mcap: stable.mcap,
                dominancePercentage: (stable.mcap / stablecoinsData.totalMcap) * 100,
              })) || [],
          },
          aptos: {
            totalMarketCap: aptosStableData?.totalCirculating || 0,
            stablecoins:
              aptosStableData?.stablecoins?.map((stable: any) => ({
                name: stable.name,
                symbol: stable.symbol,
                circulating: stable.circulating,
                dominancePercentage:
                  aptosStableData.totalCirculating > 0
                    ? (stable.circulating / aptosStableData.totalCirculating) * 100
                    : 0,
                pegStability: Math.abs(1 - (stable.price || 1)),
              })) || [],
            pegStability:
              aptosStableData?.stablecoins?.reduce(
                (avg: number, stable: any, _index: number, array: any[]) => {
                  const stability = 1 - Math.abs(1 - (stable.price || 1));
                  return avg + stability / array.length;
                },
                0
              ) || 0,
          },
          growth: {
            marketCapGrowth: 0,
            adoptionGrowth: 0,
          },
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:tvl:stablecoins"] }
    );

    apiLogger.info("Stablecoin metrics fetched successfully", {
      globalTotalMcap: stablecoinMetrics.global.totalMarketCap,
      aptosTotalMcap: stablecoinMetrics.aptos.totalMarketCap,
      aptosStablecoins: stablecoinMetrics.aptos.stablecoins.length,
    });

    return NextResponse.json(stablecoinMetrics, {
      headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM),
    });
  } catch (error) {
    apiLogger.error("Error fetching stablecoin metrics:", error);
    return NextResponse.json({ error: "Failed to fetch stablecoin metrics" }, { status: 500 });
  }
}
