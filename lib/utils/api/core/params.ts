import type { NextRequest } from "next/server";

export interface CommonParams {
  address?: string;
  walletAddress?: string;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export function extractParams(request: NextRequest): CommonParams {
  const { searchParams } = new URL(request.url);

  return {
    address: searchParams.get("address") || searchParams.get("walletAddress") || undefined,
    walletAddress: searchParams.get("walletAddress") || searchParams.get("address") || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : undefined,
  };
}

export function validateRequiredParams(params: CommonParams, required: string[]): string | null {
  for (const param of required) {
    if (!params[param]) {
      return `Missing required parameter: ${param}`;
    }
  }
  return null;
}

export function parseNumericParam(
  value: string | null,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed)) return defaultValue;
  if (min !== undefined && parsed < min) return min;
  if (max !== undefined && parsed > max) return max;

  return parsed;
}
