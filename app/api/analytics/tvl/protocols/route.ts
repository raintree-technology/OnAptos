import { NextResponse } from "next/server";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";

export async function GET() {
  try {
    const protocolMetrics = await serverCached(
      ["analytics:tvl:protocols"],
      async () => {
        const protocolsResponse = await fetch("https://api.llama.fi/protocols", {
          next: { revalidate: 300 },
        });
        if (!protocolsResponse.ok) {
          throw new Error(`Protocols API error: ${protocolsResponse.status}`);
        }
        const allProtocols = await protocolsResponse.json();
        const aptosProtocols = allProtocols.filter((protocol: any) =>
          protocol.chains?.includes("Aptos")
        );
        const sortedProtocols = aptosProtocols
          .sort((a: any, b: any) => (b.tvl || 0) - (a.tvl || 0))
          .map((protocol: any) => ({
            name: protocol.name,
            tvl: protocol.tvl || 0,
            change1h: protocol.change_1h,
            change1d: protocol.change_1d,
            change7d: protocol.change_7d,
            mcap: protocol.mcap,
            category: protocol.category,
            chains: protocol.chains,
            gecko_id: protocol.gecko_id,
            slug: protocol.slug,
          }));

        return {
          totalProtocols: aptosProtocols.length,
          totalTvl: sortedProtocols.reduce((sum: number, p: any) => sum + p.tvl, 0),
          topProtocols: sortedProtocols.slice(0, 20),
          categories: [...new Set(aptosProtocols.map((p: any) => p.category).filter(Boolean))],
          newProtocols: aptosProtocols.filter((p: any) => p.tvl < 1_000_000 && p.tvl > 0).length,
          growthMetrics: {
            avgChange1d:
              sortedProtocols.reduce((sum: number, p: any) => sum + (p.change1d || 0), 0) /
              (sortedProtocols.length || 1),
            avgChange7d:
              sortedProtocols.reduce((sum: number, p: any) => sum + (p.change7d || 0), 0) /
              (sortedProtocols.length || 1),
            positiveGrowth1d: sortedProtocols.filter((p: any) => (p.change1d || 0) > 0).length,
            positiveGrowth7d: sortedProtocols.filter((p: any) => (p.change7d || 0) > 0).length,
          },
        };
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["analytics:tvl:protocols"] }
    );

    apiLogger.info("Aptos protocol metrics fetched successfully", {
      totalProtocols: protocolMetrics.totalProtocols,
      totalTvl: protocolMetrics.totalTvl,
      categories: protocolMetrics.categories.length,
    });

    return NextResponse.json(protocolMetrics, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching Aptos protocol data:", error);
    return NextResponse.json({ error: "Failed to fetch protocol data" }, { status: 500 });
  }
}
