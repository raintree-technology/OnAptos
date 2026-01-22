import type { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/core/logger";
import { errorResponse } from "../response/errors";

export async function apiHandler<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  options?: {
    maxBodySize?: number;
    allowedMethods?: string[];
  }
): Promise<(request: NextRequest) => Promise<NextResponse>> {
  return async (request: NextRequest) => {
    try {
      if (options?.allowedMethods && !options.allowedMethods.includes(request.method)) {
        return errorResponse(`Method ${request.method} not allowed`, 405);
      }

      if (options?.maxBodySize && ["POST", "PUT", "PATCH"].includes(request.method)) {
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > options.maxBodySize) {
          return errorResponse("Request body too large", 413);
        }
      }

      return await handler(request);
    } catch (error) {
      logger.error("Unhandled API error", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url,
        method: request.method,
      });

      return errorResponse(
        "Internal server error",
        500,
        process.env.NODE_ENV === "development" ? error : undefined
      );
    }
  };
}
