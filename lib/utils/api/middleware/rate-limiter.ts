import { LRUCache } from "lru-cache";
import type { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/core/logger";
import { errorResponse } from "../response/errors";

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const rateLimiters = new Map<string, LRUCache<string, number[]>>();

export function createRateLimiter(
  name: string,
  options: RateLimitOptions = {}
): LRUCache<string, number[]> {
  const { uniqueTokenPerInterval = 500, interval = 60000 } = options;

  const limiter = new LRUCache<string, number[]>({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });

  rateLimiters.set(name, limiter);
  return limiter;
}

function getClientId(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}:${userAgent}`;
}

export function checkRateLimit(
  request: NextRequest,
  limiterName: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  let limiter = rateLimiters.get(limiterName);

  if (!limiter) {
    limiter = createRateLimiter(limiterName, {
      uniqueTokenPerInterval: 500,
      interval: windowMs,
    });
  }

  const clientId = getClientId(request);
  const now = Date.now();
  const windowStart = now - windowMs;

  let timestamps = limiter.get(clientId) || [];

  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= maxRequests) {
    const oldestTimestamp = timestamps[0];
    const resetTime = oldestTimestamp + windowMs;

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: resetTime,
    };
  }

  timestamps.push(now);
  limiter.set(clientId, timestamps);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - timestamps.length,
    reset: now + windowMs,
  };
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    name: string;
    maxRequests?: number;
    windowMs?: number;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { name, maxRequests = 10, windowMs = 60000 } = options;

    const result = checkRateLimit(request, name, maxRequests, windowMs);

    if (!result.success) {
      logger.warn("Rate limit exceeded", {
        clientId: getClientId(request),
        limiter: name,
        limit: result.limit,
      });

      const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

      return errorResponse("Too many requests", 429, {
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
        retryAfter,
      });
    }

    const response = await handler(request);

    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", new Date(result.reset).toISOString());

    return response;
  };
}

export const RATE_LIMIT_TIERS = {
  STRICT: { maxRequests: 5, windowMs: 60000 },
  STANDARD: { maxRequests: 30, windowMs: 60000 },
  RELAXED: { maxRequests: 100, windowMs: 60000 },
  PUBLIC: { maxRequests: 60, windowMs: 60000 },
} as const;
