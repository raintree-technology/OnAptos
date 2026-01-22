import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";

export async function GET() {
  try {
    const yieldMetrics = await serverCached(
      ["analytics:tvl:yields"],
      async () => {
        const poolsResponse = await fetch("https://yields.llama.fi/pools", {
          next: { revalidate: 300 },
        });
        if (!poolsResponse.ok) {
          throw new Error(`Pools API error: ${poolsResponse.status}`);
        }
        const poolsData = await poolsResponse.json();
        const aptosPools =
          poolsData.data?.filter((pool: any) => pool.chain?.toLowerCase() === "aptos") || [];

        return {
          totalPools: aptosPools.length,
          totalTvl: aptosPools.reduce((sum: number, pool: any) => sum + (pool.tvlUsd || 0), 0),
          averageApy:
            aptosPools.reduce((sum: number, pool: any) => sum + (pool.apy || 0), 0) /
            (aptosPools.length || 1),
          medianApy: (() => {
            const apys = aptosPools
              .map((pool: any) => pool.apy || 0)
              .sort((a: number, b: number) => a - b);
            const mid = Math.floor(apys.length / 2);
            return apys.length % 2 === 0 ? (apys[mid - 1] + apys[mid]) / 2 : apys[mid];
          })(),
          highestApy: Math.max(...aptosPools.map((pool: any) => pool.apy || 0)),
          topPools: aptosPools
            .sort((a: any, b: any) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
            .slice(0, 20)
            .map((pool: any) => ({
              pool: pool.pool,
              project: pool.project,
              symbol: pool.symbol,
              tvlUsd: pool.tvlUsd || 0,
              apy: pool.apy || 0,
              apyBase: pool.apyBase || 0,
              apyReward: pool.apyReward || 0,
              il7d: pool.il7d,
              volumeUsd1d: pool.volumeUsd1d || 0,
            })),
          categories: {
            dex: aptosPools.filter(
              (pool: any) =>
                pool.project?.toLowerCase().includes("swap") ||
                pool.project?.toLowerCase().includes("dex")
            ),
            lending: aptosPools.filter(
              (pool: any) =>
                pool.project?.toLowerCase().includes("lend") ||
                pool.project?.toLowerCase().includes("borrow")
            ),
            staking: aptosPools.filter(
              (pool: any) =>
                pool.project?.toLowerCase().includes("stake") ||
                pool.project?.toLowerCase().includes("staking")
            ),
            yield: aptosPools.filter(
              (pool: any) =>
                !pool.project?.toLowerCase().includes("swap") &&
                !pool.project?.toLowerCase().includes("dex") &&
                !pool.project?.toLowerCase().includes("lend") &&
                !pool.project?.toLowerCase().includes("borrow") &&
                !pool.project?.toLowerCase().includes("stake")
            ),
          },
          riskMetrics: {
            stablecoinPools: aptosPools.filter(
              (pool: any) =>
                pool.symbol?.toLowerCase().includes("usdc") ||
                pool.symbol?.toLowerCase().includes("usdt") ||
                pool.symbol?.toLowerCase().includes("dai")
            ).length,
            highRiskPools: aptosPools.filter((pool: any) => (pool.apy || 0) > 100).length,
            impermanentLossRisk: aptosPools.filter((pool: any) => Math.abs(pool.il7d || 0) > 5)
              .length,
          },
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:tvl:yields"] }
    );

    apiLogger.info("Aptos yield metrics fetched successfully", {
      totalPools: yieldMetrics.totalPools,
      totalTvl: yieldMetrics.totalTvl,
      averageApy: yieldMetrics.averageApy,
    });

    return NextResponse.json(yieldMetrics, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching Aptos yield data:", error);
    return NextResponse.json({ error: "Failed to fetch yield data" }, { status: 500 });
  }
}
