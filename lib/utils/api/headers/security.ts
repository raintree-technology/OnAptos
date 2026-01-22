import { CACHE_CONFIG } from "@/lib/config/cache";
import type { RateLimitInfo } from "@/lib/utils/core/types";

const RATE_LIMIT_MAX_REQUESTS = CACHE_CONFIG.RATE_LIMIT.MAX_REQUESTS;
const BURST_LIMIT = CACHE_CONFIG.RATE_LIMIT.BURST_LIMIT;

export function getSecurityHeaders(rateLimitInfo: RateLimitInfo): Record<string, string> {
  return {
    "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
    "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
    "X-RateLimit-Reset": (
      rateLimitInfo.resetInSeconds || CACHE_CONFIG.RATE_LIMIT.WINDOW / 1000
    ).toString(),
    "X-RateLimit-Burst-Limit": BURST_LIMIT.toString(),
    "X-RateLimit-Burst-Remaining": rateLimitInfo.burstRemaining.toString(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  };
}

export function getClientSecurityHeaders(rateLimitInfo: RateLimitInfo): Record<string, string> {
  return {
    "X-RateLimit-Limit": rateLimitInfo.remaining.toString(),
    "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
    "X-RateLimit-Reset": (rateLimitInfo.resetInSeconds || 60).toString(),
    "X-RateLimit-Burst-Remaining": rateLimitInfo.burstRemaining.toString(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  };
}
