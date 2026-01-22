/**
 * Metrics utility functions for data transformation and formatting
 */

// Constants for safe math operations
const EPSILON = 0.000001; // Very small number to check for near-zero values

/**
 * Safe division that handles zero denominators and returns fallback value
 */
export function safeDivide(
  numerator: number | string | null | undefined,
  denominator: number | string | null | undefined,
  fallback = 0
): number {
  const num = typeof numerator === "string" ? parseFloat(numerator) : (numerator ?? 0);
  const den = typeof denominator === "string" ? parseFloat(denominator) : (denominator ?? 0);

  // Check for invalid numbers
  if (Number.isNaN(num) || Number.isNaN(den)) {
    return fallback;
  }

  // Check for zero or near-zero denominator
  if (Math.abs(den) < EPSILON) {
    return fallback;
  }

  const result = num / den;
  return Number.isFinite(result) ? result : fallback;
}

/**
 * Safe parseInt that returns fallback value instead of NaN
 */
export function safeParseInt(value: any, fallback = 0): number {
  if (value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Safe parseFloat that returns fallback value instead of NaN
 */
export function safeParseFloat(value: any, fallback = 0): number {
  if (value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely get average from array, handles empty arrays
 */
export function safeAverage(values: number[], fallback = 0): number {
  if (!Array.isArray(values) || values.length === 0) {
    return fallback;
  }

  const sum = values.reduce((acc, val) => acc + (Number.isFinite(val) ? val : 0), 0);
  return safeDivide(sum, values.length, fallback);
}

/**
 * Shorten metric names for compact card display
 */
export function shortenMetricName(name: string): string {
  const replacements: Record<string, string> = {
    "All-Time Total Transactions": "Total Transactions",
    "Daily Active Addresses (24h)": "Daily Active Addresses",
    "Total Network Signatures": "Total Signatures",
    "Max TPS (15 blocks)": "Max TPS",
    "Transaction Success Rate": "Success Rate",
    "Average Gas Cost (APT)": "Avg Gas Price",
    "Average Block Time": "Block Time",
    "Transaction Finality Time": "Finality Time",
    "Enhanced Network Reliability": "Network Reliability",
    "Daily Gas Fees (24h USD)": "Daily Gas Fees",
    "Total Swap Events": "Swap Events",
    "Unique Traders": "Traders",
    "Peak Hour Transaction Volume": "Peak Hourly Activity",
    "Peak Hour Active Users": "Peak Hour Users",
    "Identified Protocol Activity": "Protocol Activity",
    "Hourly Failed Transactions": "Failed Transactions",
    "Net Daily Gas (24h APT)": "Daily Gas (APT)",
    "Average Hourly Transactions": "Avg Hourly Transactions",
    "Network Age (Days)": "Network Age",
  };

  return replacements[name] || name;
}

/**
 * Categorize metrics into organized sections
 */
export function categorizeMetrics(tableData: any[]) {
  const categories = {
    "Network Activity": [] as any[],
    "Network Performance": [] as any[],
    "Gas Economics": [] as any[],
    "DEX Analytics": [] as any[],
    "Protocol Analytics": [] as any[],
  };

  tableData.forEach((metric) => {
    let category = metric.category || "Network Activity";

    // Merge User Activity into Network Activity
    if (category === "User Activity") {
      category = "Network Activity";
    }

    if (categories[category as keyof typeof categories]) {
      categories[category as keyof typeof categories].push(metric);
    }
  });

  return categories;
}
