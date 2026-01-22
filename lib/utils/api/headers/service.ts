export interface ServiceHeaderOptions {
  serviceName: string;
  apiVersion?: string;
  dataSource?: string;
  responseTime?: number;
  deprecated?: boolean;
  redirectTo?: string;
  cacheStatus?: "hit" | "miss" | "stale";
  queryCount?: number;
}

export function buildServiceHeaders(options: ServiceHeaderOptions): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type": "application/json",
    "X-Service": options.serviceName,
    "X-API-Version": options.apiVersion || "2.0",
    Vary: "Accept-Encoding",
  };

  if (options.dataSource) {
    headers["X-Data-Source"] = options.dataSource;
  }

  if (options.responseTime !== undefined) {
    headers["X-Response-Time"] = `${options.responseTime}ms`;
  }

  if (options.deprecated) {
    headers["X-Deprecated"] = "true";
  }

  if (options.redirectTo) {
    headers["X-Redirect-To"] = options.redirectTo;
  }

  if (options.cacheStatus) {
    headers["X-Cache-Status"] = options.cacheStatus;
  }

  if (options.queryCount !== undefined) {
    headers["X-Query-Count"] = options.queryCount.toString();
  }

  return headers;
}

export const SERVICE_PRESETS = {
  analytics: (responseTime?: number, queryCount?: number): ServiceHeaderOptions => ({
    serviceName: "analytics",
    dataSource: "aptos-analytics",
    responseTime,
    queryCount,
  }),

  prices: (
    source: "panora" | "cmc" | "coingecko" | "unified",
    responseTime?: number
  ): ServiceHeaderOptions => ({
    serviceName: "prices",
    dataSource: source,
    responseTime,
  }),

  aptos: (dataType: string, responseTime?: number): ServiceHeaderOptions => ({
    serviceName: "aptos-data",
    dataSource: `aptos-${dataType}`,
    responseTime,
  }),

  portfolio: (
    dataType: string,
    responseTime?: number,
    queryCount?: number
  ): ServiceHeaderOptions => ({
    serviceName: "portfolio",
    dataSource: `portfolio-${dataType}`,
    responseTime,
    queryCount,
  }),

  deprecated: (redirectTo: string, serviceName: string): ServiceHeaderOptions => ({
    serviceName,
    deprecated: true,
    redirectTo,
  }),

  seo: (contentType: "sitemap" | "metadata" | "llm"): ServiceHeaderOptions => ({
    serviceName: "seo",
    dataSource: contentType,
  }),
} as const;

export interface PerformanceMetrics {
  startTime: number;
  cacheHits?: number;
  cacheMisses?: number;
  queryCount?: number;
  dbTime?: number;
  apiTime?: number;
}

export function buildPerformanceHeaders(metrics: PerformanceMetrics): Record<string, string> {
  const responseTime = Date.now() - metrics.startTime;

  const headers: Record<string, string> = {
    "X-Response-Time": `${responseTime}ms`,
  };

  if (metrics.cacheHits !== undefined || metrics.cacheMisses !== undefined) {
    const hits = metrics.cacheHits || 0;
    const misses = metrics.cacheMisses || 0;
    const total = hits + misses;
    const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;

    headers["X-Cache-Hit-Rate"] = `${hitRate}%`;
    headers["X-Cache-Hits"] = hits.toString();
    headers["X-Cache-Misses"] = misses.toString();
  }

  if (metrics.queryCount !== undefined) {
    headers["X-Query-Count"] = metrics.queryCount.toString();
  }

  if (metrics.dbTime !== undefined) {
    headers["X-Database-Time"] = `${metrics.dbTime}ms`;
  }

  if (metrics.apiTime !== undefined) {
    headers["X-API-Time"] = `${metrics.apiTime}ms`;
  }

  return headers;
}

export function buildFullHeaders(
  serviceOptions: ServiceHeaderOptions,
  performanceMetrics?: PerformanceMetrics
): Record<string, string> {
  const serviceHeaders = buildServiceHeaders(serviceOptions);

  if (performanceMetrics) {
    const performanceHeaders = buildPerformanceHeaders(performanceMetrics);
    return { ...serviceHeaders, ...performanceHeaders };
  }

  return serviceHeaders;
}
