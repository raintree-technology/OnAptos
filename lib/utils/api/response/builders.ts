import { NextResponse } from "next/server";
import type { StandardAPIResponse } from "@/lib/types/api";

const randomUUID = () => {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface ResponseOptions {
  startTime?: number;
  cacheHit?: boolean;
  cached?: boolean;
  apiCalls?: number;
  pagination?: any;
  source?: string;
  requestId?: string;
}

export interface CacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
  cacheControl?: string;
}

export function buildSuccessResponse<T>(
  data: T,
  options: ResponseOptions = {}
): StandardAPIResponse<T> {
  const { startTime, cacheHit = false, apiCalls, pagination } = options;

  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: randomUUID(),
      performance: {
        responseTimeMs: startTime ? Date.now() - startTime : 0,
        cacheHit,
        ...(apiCalls && { apiCalls }),
      },
      ...(pagination && { pagination }),
    },
  };
}

export function successResponse<T>(
  data: T,
  _cacheDuration?: number,
  headers?: Record<string, string>,
  _options: ResponseOptions = {}
): NextResponse {
  const responseHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  return NextResponse.json(data, {
    headers: responseHeaders,
  });
}

export function createCacheHeaders(
  maxAge: number,
  staleWhileRevalidate?: number,
  additionalHeaders: Record<string, string> = {}
): Record<string, string> {
  return {
    "Cache-Control": `public, max-age=${maxAge}${
      staleWhileRevalidate ? `, stale-while-revalidate=${staleWhileRevalidate}` : ""
    }`,
    "X-Content-Type": "application/json",
    Vary: "Accept-Encoding",
    ...additionalHeaders,
  };
}

export function createSuccessResponse<T>(data: T, headers?: HeadersInit): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers,
    }
  );
}

export function createApiResponse<T>(
  data: T | { error: string },
  status: number = 200,
  endpoint?: string
): NextResponse {
  if (status >= 400) {
    return NextResponse.json(data, { status });
  }

  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: randomUUID(),
        ...(endpoint && { endpoint }),
      },
    },
    { status }
  );
}

export function validateParams(
  params: Record<string, any>,
  required: string[]
): { valid: boolean; missing?: string[] } {
  const missing = required.filter((key) => !params[key]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}
