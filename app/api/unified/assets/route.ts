import type { NextRequest } from "next/server";

import {
  BitcoinService,
  LiquidStakingService,
  RWAService,
  StablecoinService,
} from "@/lib/services/asset-types";
import { CACHE_DURATIONS, errorResponse, successResponse } from "@/lib/utils/api/common";
import { serverCached } from "@/lib/utils/server/cache";
import { RATE_LIMIT_TIERS, withRateLimit } from "@/lib/utils/api/rate-limiter";
import { logger } from "@/lib/utils/core/logger";
import { OPTIONS } from "../shared";

// Cache asset data for 10 minutes
export const revalidate = 600;

interface AssetData {
  [key: string]: any;
  metrics?: AssetMetrics;
}

interface AssetMetrics {
  [assetType: string]: {
    totalSupply: number;
    count: number;
  };
}

interface AssetResult {
  type: string;
  data: any;
}

type AssetType = "stables" | "btc" | "rwa" | "lst";

async function unifiedAssetsHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assetType = searchParams.get("type") || "all"; // all, stables, btc, rwa, lst
  const includeMetrics = searchParams.get("metrics") === "true";

  try {
    const response = await serverCached(
      ["unified:assets", assetType, includeMetrics ? "1" : "0"],
      async () => {
        const data: AssetData = {};
        const types: AssetType[] =
          assetType === "all" ? ["stables", "btc", "rwa", "lst"] : [assetType as AssetType];

        const results = await Promise.allSettled(
          types.map(async (type: AssetType): Promise<AssetResult> => {
            switch (type) {
              case "stables":
                return {
                  type: "stables",
                  data: await StablecoinService.getStablecoinSupplies(),
                };
              case "btc":
                return {
                  type: "btc",
                  data: await BitcoinService.getBTCSupply(),
                };
              case "rwa":
                return { type: "rwa", data: await RWAService.getRWAData() };
              case "lst":
                return {
                  type: "lst",
                  data: await LiquidStakingService.getLSTSupplyDetailed(),
                };
              default:
                throw new Error(`Invalid asset type: ${type}`);
            }
          })
        );

        results.forEach((result, index) => {
          const currentType = types[index];
          if (result.status === "fulfilled") {
            data[result.value.type] = result.value.data;
          } else {
            logger.warn(`Failed to fetch ${currentType} data`, {
              error: result.reason,
            });
            data[currentType] = { error: "Failed to fetch data" };
          }
        });

        if (includeMetrics) {
          const metrics: AssetMetrics = {};
          const calculateSupplyMetrics = (supplies: any[]) => ({
            totalSupply: supplies.reduce((sum: number, s: any) => sum + (s.supply || 0), 0),
            count: supplies.length,
          });
          const assetTypes: AssetType[] = ["stables", "btc", "rwa", "lst"];
          assetTypes.forEach((type) => {
            if (data[type]?.supplies) {
              metrics[type] = calculateSupplyMetrics(data[type].supplies);
            }
          });
          data.metrics = metrics;
        }

        return assetType === "all" ? data : data[assetType];
      },
      { revalidate: CACHE_DURATIONS.LONG, tags: ["unified:assets"] }
    );

    return successResponse(response, CACHE_DURATIONS.LONG, {
      "X-Data-Source": "aptos-indexer",
      "X-Asset-Type": assetType,
      "X-Include-Metrics": includeMetrics ? "true" : "false",
    });
  } catch (error) {
    logger.error("Unified assets API error", {
      error: error instanceof Error ? error.message : String(error),
      assetType,
    });

    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch asset data",
      500
    );
  }
}

export const GET = withRateLimit(unifiedAssetsHandler, {
  name: "unified-assets",
  ...RATE_LIMIT_TIERS.STANDARD,
});
export { OPTIONS };
