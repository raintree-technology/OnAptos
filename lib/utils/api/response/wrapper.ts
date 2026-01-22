import { NextResponse } from "next/server";
import type { StandardAPIResponse } from "@/lib/types/api";
import { logger } from "@/lib/utils/core/logger";
import { STANDARD_CORS_HEADERS } from "../headers/cors";
import { buildSuccessResponse } from "./builders";
import { APIResponses } from "./errors";

export function withAPIHandler<T>(
  handler: () => Promise<T>,
  options: {
    startTime?: number;
    operation?: string;
    cacheHit?: boolean;
    apiCalls?: number;
  } = {}
) {
  return async (): Promise<NextResponse<StandardAPIResponse<T>>> => {
    const { startTime = Date.now(), operation = "API operation", cacheHit, apiCalls } = options;

    try {
      const data = await handler();

      const response = buildSuccessResponse(data, {
        startTime,
        cacheHit,
        apiCalls,
      });

      return NextResponse.json(response);
    } catch (error) {
      logger.error(`Error in ${operation}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof Error) {
        if (error.message.includes("rate limit") || error.message.includes("429")) {
          return APIResponses.rateLimited(100, 60000);
        }

        if (error.message.includes("timeout")) {
          return APIResponses.timeout(operation);
        }

        if (error.message.includes("not found") || error.message.includes("404")) {
          return APIResponses.notFound(operation);
        }

        return APIResponses.internalError(error.message, error);
      }

      return APIResponses.internalError();
    }
  };
}

export function optionsResponse(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: STANDARD_CORS_HEADERS,
  });
}
