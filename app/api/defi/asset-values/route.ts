import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/utils/core/logger";
import { serverCached } from "@/lib/utils/server/cache";
import { CACHE_DURATIONS, getCacheHeaders } from "@/lib/utils/api/common";
import { APP_CONFIG } from "@/lib/config/app";

export const revalidate = 300; // 5 minute cache

interface AssetMetrics {
  stables: {
    value: number;
    label: string;
    description: string;
  };
  rwas: {
    value: number;
    label: string;
    description: string;
  };
  btc: {
    value: number;
    label: string;
    description: string;
  };
  tokens: {
    value: number;
    label: string;
    description: string;
  };
}

export async function GET(request: Request) {
  try {
    const data = await serverCached(
      ["defi:asset-values"],
      async () => {
        apiLogger.info("Fetching fresh asset values for Aptos");

        // Use configured site URL for internal API calls
        const baseUrl = APP_CONFIG.siteUrl;

        // xBTC address for fetching Bitcoin price
        const xBTCAddress = "0x81214a80d82035a190fcb76b6ff3c0145161c3a9f33d137f2bbaee4cfec8a387";

        // Fetch all real data in parallel with error handling
        const [stablesRes, rwaRes, btcRes, defiRes, btcPriceRes] = await Promise.allSettled([
          fetch(`${baseUrl}/api/markets/stables`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/markets/rwas`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/aptos/btc`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/defi/metrics`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/unified/prices?tokens=${xBTCAddress}`, { cache: "no-store" }),
        ]);

        // Safely parse responses with fallbacks
        let stablesData: any = {};
        let rwaData: any = {};
        let btcData: any = {};
        let defiData: any = {};
        let btcPriceData: any = {};

        try {
          if (stablesRes.status === "fulfilled" && stablesRes.value.ok) {
            stablesData = await stablesRes.value.json();
          }
        } catch (e) {
          apiLogger.warn("Failed to parse stables data", e);
        }

        try {
          if (rwaRes.status === "fulfilled" && rwaRes.value.ok) {
            rwaData = await rwaRes.value.json();
          }
        } catch (e) {
          apiLogger.warn("Failed to parse RWA data", e);
        }

        try {
          if (btcRes.status === "fulfilled" && btcRes.value.ok) {
            btcData = await btcRes.value.json();
          }
        } catch (e) {
          apiLogger.warn("Failed to parse BTC data", e);
        }

        try {
          if (defiRes.status === "fulfilled" && defiRes.value.ok) {
            defiData = await defiRes.value.json();
          }
        } catch (e) {
          apiLogger.warn("Failed to parse DeFi data", e);
        }

        try {
          if (btcPriceRes.status === "fulfilled" && btcPriceRes.value.ok) {
            btcPriceData = await btcPriceRes.value.json();
          }
        } catch (e) {
          apiLogger.warn("Failed to parse BTC price data", e);
        }

        // Extract actual values with fallbacks
        let stablesValue = stablesData?.total ? Math.round(parseFloat(stablesData.total)) : 0;
        const rwasValue = rwaData?.totalAptosValue ? Math.round(rwaData.totalAptosValue) : 0;

        // Calculate BTC value using REAL price from the same source as BTC page
        const btcSupply = parseFloat(btcData?.data?.total_supply_formatted || "0");
        const btcPrice = btcPriceData?.prices?.[xBTCAddress] || 96000;
        const btcValue = Math.round(btcSupply * btcPrice);

        const totalTokensValue = defiData?.tvl ? Math.round(defiData.tvl) : 0;

        // Fallback: if stablecoin value missing, try analytics stablecoin TVL endpoint
        if (!stablesValue) {
          try {
            const fallbackRes = await fetch(`${baseUrl}/api/analytics/tvl/stablecoins`, {
              cache: "no-store",
            });
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const aptosStable = fallbackData?.aptos?.totalMarketCap;
              if (typeof aptosStable === "number" && aptosStable > 0) {
                stablesValue = Math.round(aptosStable);
              }
            }
          } catch (e) {
            apiLogger.warn("Stablecoin fallback fetch failed", e);
          }
        }

        const metrics: AssetMetrics = {
          stables: {
            value: stablesValue,
            label: "Stablecoins",
            description: "USDC, USDT, USDe, USDA & more on Aptos",
          },
          rwas: {
            value: rwasValue,
            label: "Real World Assets",
            description: "BlackRock BUIDL, Franklin Templeton & more",
          },
          btc: {
            value: btcValue,
            label: "Bitcoin",
            description: "aBTC, SBTC, xBTC & wrapped variants",
          },
          tokens: {
            value: totalTokensValue,
            label: "Total Value Locked",
            description: "Total value across all Aptos protocols",
          },
        };

        return metrics;
      },
      { revalidate: CACHE_DURATIONS.MEDIUM, tags: ["defi:asset-values"] }
    );

    return NextResponse.json(data, { headers: getCacheHeaders(CACHE_DURATIONS.MEDIUM) });
  } catch (error) {
    apiLogger.error("Error fetching asset values:", error);

    // Return error response
    return NextResponse.json(
      {
        error: "Failed to fetch asset values",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
