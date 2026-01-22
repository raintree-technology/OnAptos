import { type NextRequest, NextResponse } from "next/server";
import { apiLogger } from "@/lib/utils/core/logger";
import { STANDARD_CORS_HEADERS } from "../headers/cors";

export class DeprecationHandler {
  static async createRedirect(
    request: NextRequest,
    newEndpoint: string,
    params?: Record<string, string>
  ): Promise<NextResponse> {
    const baseUrl = request.nextUrl.origin;
    const redirectUrl = new URL(`${baseUrl}${newEndpoint}`);

    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        redirectUrl.searchParams.set(key, value);
      });
    }

    try {
      apiLogger.info("Deprecated endpoint redirect", {
        from: request.nextUrl.pathname,
        to: newEndpoint,
        params: Object.fromEntries(redirectUrl.searchParams),
      });

      const response = await fetch(redirectUrl.toString(), {
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "OnAptos-DeprecatedRedirect/1.0",
          Accept: request.headers.get("Accept") || "application/json",
        },
      });

      const data = await response.json();

      return NextResponse.json(data, {
        status: response.status,
        headers: {
          "X-Deprecated": "true",
          "X-Redirect-To": newEndpoint,
          "X-Original-Endpoint": request.nextUrl.pathname,
          ...STANDARD_CORS_HEADERS,
        },
      });
    } catch (error) {
      apiLogger.error("Redirect failed", {
        from: request.nextUrl.pathname,
        to: newEndpoint,
        error: error instanceof Error ? error.message : String(error),
      });

      return NextResponse.json(
        {
          error: "Deprecated endpoint redirect failed",
          message: `This endpoint is deprecated. Please use ${newEndpoint} instead.`,
          redirectTo: newEndpoint,
        },
        {
          status: 502,
          headers: {
            "X-Deprecated": "true",
            "X-Redirect-To": newEndpoint,
            "X-Redirect-Error": "true",
            ...STANDARD_CORS_HEADERS,
          },
        }
      );
    }
  }
}
