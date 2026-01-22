import { NextResponse } from "next/server";

export const STANDARD_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Max-Age": "86400",
} as const;

export const READONLY_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Max-Age": "86400",
} as const;

export const CORS_HEADERS = STANDARD_CORS_HEADERS;

export function createCORSHandler(headers = READONLY_CORS_HEADERS) {
  return async () => {
    return new NextResponse(null, {
      status: 200,
      headers,
    });
  };
}

export function addCORSHeaders(
  response: NextResponse,
  headers = READONLY_CORS_HEADERS
): NextResponse {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function createCORSResponse<T>(
  data: T,
  status = 200,
  additionalHeaders: Record<string, string> = {},
  corsHeaders = READONLY_CORS_HEADERS
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders,
      ...additionalHeaders,
    },
  });
}

export const OPTIONS = createCORSHandler();
