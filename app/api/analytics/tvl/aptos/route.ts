import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";

export async function GET() {
  try {
    const result = await serverCached(
      ["analytics:tvl:aptos"],
      async () => {
        const chainsResponse = await fetch("https://api.llama.fi/v2/chains", {
          next: { revalidate: 300 },
        });

        let currentTvl = 0;
        let chainsData: any = null;

        if (chainsResponse.ok) {
          chainsData = await chainsResponse.json();
          const aptos = chainsData.find((chain: any) => chain.name === "Aptos");
          currentTvl = aptos?.tvl || 0;
          apiLogger.info("Aptos TVL from chains endpoint:", currentTvl);
        }

        if (currentTvl === 0) {
          const tvlResponse = await fetch("https://api.llama.fi/tvl/aptos", {
            next: { revalidate: 300 },
          });
          if (tvlResponse.ok) {
            currentTvl = await tvlResponse.json();
            apiLogger.info("Aptos TVL from direct endpoint (fallback):", currentTvl);
          }
        }

        const historicalResponse = await fetch("https://api.llama.fi/v2/historicalChainTvl/aptos", {
          next: { revalidate: 300 },
        });

        let historicalData: any = null;
        if (historicalResponse.ok) {
          historicalData = await historicalResponse.json();
        }

        let chainComparison: any = null;
        let marketShare: number | null = null;

        if (chainsData) {
          const aptos = chainsData.find((chain: any) => chain.name === "Aptos");
          const totalTvl = chainsData.reduce(
            (sum: number, chain: any) => sum + (chain.tvl || 0),
            0
          );
          chainComparison = {
            aptos: aptos?.tvl || 0,
            totalDeFiTvl: totalTvl,
            aptosRank:
              chainsData
                .sort((a: any, b: any) => (b.tvl || 0) - (a.tvl || 0))
                .findIndex((chain: any) => chain.name === "Aptos") + 1,
            topChains: chainsData
              .sort((a: any, b: any) => (b.tvl || 0) - (a.tvl || 0))
              .slice(0, 10)
              .map((chain: any) => ({ name: chain.name, tvl: chain.tvl || 0 })),
          };
          marketShare = aptos ? (aptos.tvl / totalTvl) * 100 : 0;
        }

        return {
          currentTvl,
          historical: historicalData,
          chainComparison,
          marketShare,
          lastUpdated: new Date().toISOString(),
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:tvl:aptos"] }
    );

    return NextResponse.json(result, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching Aptos TVL data:", error);
    return NextResponse.json({ error: "Failed to fetch TVL data" }, { status: 500 });
  }
}
