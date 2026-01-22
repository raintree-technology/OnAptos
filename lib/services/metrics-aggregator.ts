/**
 * Metrics Aggregator Service
 * Handles extraction and aggregation of metrics from Dune API responses
 */

import { APT_CONSTANTS, DATA_LIMITS, THRESHOLDS } from "@/lib/constants/metrics";
import { getProtocolName } from "@/lib/protocolRegistry";
import { safeAverage, safeParseFloat, safeParseInt } from "@/lib/utils/monitoring/metrics";

export interface RawDuneData {
  protocolData: any[];
  userData: any[];
  dexData: any[];
  stakingData: any[];
  dexMetricsData: any[];
  userBehaviorData: any[];
  transactionData: any[];
  networkData: any[];
  protocolMetricsData: any[];
  tokenBalancesData: any[];
  dexTradingData: any[];
  activityPatternsData: any[];
  networkOverviewData: any[];
  allTimeTransactionsData: any[];
  blockTimesData: any[];
}

export interface AggregatedMetrics {
  // Core metrics
  totalTransactions: number;
  allTimeTransactionCount: number | null;
  uniqueUsers: number;
  avgSuccessRate: number;
  avgGasPrice: number;

  // Block metrics
  avgBlockTime: number | null;
  avgFinalityTime: number | null;
  networkReliabilityScore: number | null;
  networkLifetimeDays: number | null;

  // Daily metrics
  dailyActiveAddresses: number;
  dailyTransactions: number;
  dailyGasFeesAPT: number;
  dailyGasFeesUSD: number;
  netGasAPT: number;

  // Recent metrics
  recentTransactionCount: number;
  recentGasFeesAPT: number;
  avgGasFeePerTx: number;

  // User behavior
  behaviorDailyActiveUsers: number;
  totalSignatures: number;
  behaviorTransactions: number;

  // Network performance
  maxTPS: number;

  // Protocol breakdown
  protocolBreakdown: ProtocolMetric[];
  extendedProtocolData: ProtocolMetric[];
  totalProtocolTransactions: number;
  totalProtocolGas: number;

  // Token analytics
  totalTokenHolders: number;
  totalTokenValue: number;
  topTokenHoldings: TokenHolding[];

  // DEX analytics
  totalSwapEvents: number;
  uniqueSwappers: number;
  swapVolume24h: number;

  // Activity patterns
  hourlyTransactions: number;
  hourlyUsers: number;
  hourlyGas: number;
  hourlyFailedTxns: number;
  peakHourlyTransactions: number;
  peakHourlyUsers: number;
  averageHourlyTransactions: number;
  activityPatterns: any[];

  // TVL
  totalTVL: number;
}

export interface ProtocolMetric {
  moduleAddress: string;
  protocolName: string;
  senderCount: number;
  signerCount: number;
  transactionCount: number;
  gasTotal: number;
}

export interface TokenHolding {
  holder: string;
  tokenType: string;
  balance: number;
  formattedBalance: string;
}

/**
 * Extract core network metrics from protocol activity data
 */
function extractCoreMetrics(protocolData: any[]): {
  totalTransactions: number;
  uniqueUsers: number;
  avgSuccessRate: number;
  avgGasPrice: number;
} {
  const mainMetrics = protocolData[0] || {};
  return {
    totalTransactions: safeParseInt(mainMetrics.total_transactions, 0),
    uniqueUsers: safeParseInt(mainMetrics.unique_senders, 0),
    avgSuccessRate: safeParseFloat(mainMetrics.success_rate, 0),
    avgGasPrice: safeParseFloat(mainMetrics.avg_gas_cost, 0),
  };
}

/**
 * Extract blockchain metrics like block time and finality
 */
function extractBlockMetrics(
  allTimeTransactionsData: any[],
  blockTimesData: any[]
): {
  allTimeTransactionCount: number | null;
  networkLifetimeDays: number | null;
  avgBlockTime: number | null;
  avgFinalityTime: number | null;
  networkReliabilityScore: number | null;
} {
  const allTimeMetrics = allTimeTransactionsData[0] || {};
  const blockMetrics = blockTimesData[0] || {};

  return {
    allTimeTransactionCount: allTimeMetrics.total_all_time_transactions
      ? safeParseInt(allTimeMetrics.total_all_time_transactions, 0)
      : null,
    networkLifetimeDays: allTimeMetrics.network_age_days
      ? safeParseInt(allTimeMetrics.network_age_days, 0)
      : null,
    avgBlockTime: blockMetrics.avg_block_time_seconds
      ? safeParseFloat(blockMetrics.avg_block_time_seconds, 0)
      : null,
    avgFinalityTime: blockMetrics.avg_finality_time_seconds
      ? safeParseFloat(blockMetrics.avg_finality_time_seconds, 0)
      : null,
    networkReliabilityScore: blockMetrics.network_reliability_pct
      ? safeParseFloat(blockMetrics.network_reliability_pct, 0)
      : null,
  };
}

/**
 * Extract daily network activity metrics
 */
function extractDailyMetrics(
  dexData: any[],
  userData: any[],
  dexMetricsData: any[]
): {
  dailyActiveAddresses: number;
  dailyTransactions: number;
  dailyGasFeesAPT: number;
  dailyGasFeesUSD: number;
  netGasAPT: number;
  recentTransactionCount: number;
  recentGasFeesAPT: number;
  avgGasFeePerTx: number;
} {
  const dailyMetrics = dexData[0] || {};
  const gasMetrics = userData[0] || {};
  const dexAnalytics = dexMetricsData[0] || {};

  return {
    dailyActiveAddresses: safeParseInt(dailyMetrics.daily_active_addresses, 0),
    dailyTransactions: safeParseInt(dailyMetrics.daily_transactions, 0),
    dailyGasFeesAPT: safeParseFloat(gasMetrics.gas_fee_apt, 0),
    dailyGasFeesUSD: safeParseFloat(gasMetrics.gas_fee_usd, 0),
    netGasAPT: safeParseFloat(gasMetrics.net_gas_apt, 0),
    recentTransactionCount: safeParseInt(dexAnalytics.transaction_count, 0),
    recentGasFeesAPT: safeParseFloat(dexAnalytics.sum_gas_fees_apt, 0),
    avgGasFeePerTx: safeParseFloat(dexAnalytics.avg_gas_fee_per_transaction_octa, 0),
  };
}

/**
 * Extract user behavior metrics
 */
function extractUserBehaviorMetrics(
  userBehaviorData: any[],
  transactionData: any[]
): {
  behaviorDailyActiveUsers: number;
  totalSignatures: number;
  behaviorTransactions: number;
  maxTPS: number;
} {
  const behaviorMetrics = userBehaviorData[0] || {};
  const transactionPerformance = transactionData[0] || {};

  return {
    behaviorDailyActiveUsers: safeParseInt(behaviorMetrics.daily_active_user, 0),
    totalSignatures: safeParseInt(behaviorMetrics.n_sig, 0),
    behaviorTransactions: safeParseInt(behaviorMetrics.n_txn, 0),
    maxTPS: safeParseInt(transactionPerformance.max_tps_15_blocks, 0),
  };
}

/**
 * Extract protocol breakdown metrics
 */
function extractProtocolMetrics(
  networkData: any[],
  protocolMetricsData: any[],
  totalTransactions: number
): {
  protocolBreakdown: ProtocolMetric[];
  extendedProtocolData: ProtocolMetric[];
  totalProtocolTransactions: number;
  totalProtocolGas: number;
} {
  const protocolBreakdown = networkData.slice(0, DATA_LIMITS.TOP_PROTOCOLS).map((item: any) => ({
    moduleAddress: item.entry_function_module_address || "",
    protocolName: getProtocolName(item.entry_function_module_address || ""),
    senderCount: safeParseInt(item.count_sender_addresses, 0),
    signerCount: safeParseInt(item.count_signer_addresses, 0),
    transactionCount: safeParseInt(item.count_transactions, 0),
    gasTotal: safeParseInt(item.sum_gas_octa, 0) / APT_CONSTANTS.OCTA_TO_APT,
  }));

  const extendedProtocolData = protocolMetricsData
    .slice(0, DATA_LIMITS.TOP_PROTOCOLS)
    .map((item: any) => ({
      moduleAddress: item.entry_function_module_address,
      protocolName: getProtocolName(item.entry_function_module_address),
      senderCount: safeParseInt(item.count_sender_addresses, 0),
      signerCount: safeParseInt(item.count_signer_addresses, 0),
      transactionCount: safeParseInt(item.count_transactions, 0),
      gasTotal: safeParseInt(item.sum_gas_octa, 0) / APT_CONSTANTS.OCTA_TO_APT,
    }));

  const totalProtocolTransactions = Math.min(
    protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0),
    totalTransactions
  );

  const totalProtocolGas = protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0);

  return {
    protocolBreakdown,
    extendedProtocolData,
    totalProtocolTransactions,
    totalProtocolGas,
  };
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

/**
 * Extract token analytics
 */
function extractTokenMetrics(tokenBalancesData: any[]): {
  totalTokenHolders: number;
  totalTokenValue: number;
  topTokenHoldings: TokenHolding[];
} {
  const topTokenHoldings = tokenBalancesData
    .slice(0, DATA_LIMITS.TOP_TOKEN_HOLDERS)
    .map((item: any) => ({
      holder: item.holder || "",
      tokenType: item.token_type || "",
      balance: safeParseFloat(item.balance, 0),
      formattedBalance: formatMetricValue(safeParseFloat(item.balance, 0)),
    }));

  const totalTokenValue = tokenBalancesData.reduce(
    (sum: number, item: any) => sum + safeParseFloat(item.balance, 0),
    0
  );

  return {
    totalTokenHolders: tokenBalancesData.length,
    totalTokenValue,
    topTokenHoldings,
  };
}

/**
 * Extract DEX trading metrics
 */
function extractDEXMetrics(dexTradingData: any[]): {
  totalSwapEvents: number;
  uniqueSwappers: number;
  swapVolume24h: number;
} {
  const totalSwapEvents = dexTradingData.length;
  const uniqueSwappers = new Set(dexTradingData.map((item: any) => item.sender || item.user)).size;

  const dayAgo = new Date(Date.now() - THRESHOLDS.MILLISECONDS_IN_DAY);
  const swapVolume24h = dexTradingData.filter((item: any) => {
    const eventTime = new Date(item.block_time || item.timestamp);
    return eventTime > dayAgo;
  }).length;

  return {
    totalSwapEvents,
    uniqueSwappers,
    swapVolume24h,
  };
}

/**
 * Extract activity pattern metrics
 */
function extractActivityPatterns(activityPatternsData: any[]): {
  hourlyTransactions: number;
  hourlyUsers: number;
  hourlyGas: number;
  hourlyFailedTxns: number;
  peakHourlyTransactions: number;
  peakHourlyUsers: number;
  averageHourlyTransactions: number;
  activityPatterns: any[];
} {
  const latestActivityPattern = activityPatternsData[0] || {};

  const peakHour = activityPatternsData.reduce((peak: any, current: any) => {
    const currentTxns = safeParseInt(current.transactions, 0);
    const peakTxns = safeParseInt(peak.transactions, 0);
    return currentTxns > peakTxns ? current : peak;
  }, activityPatternsData[0] || {});

  return {
    hourlyTransactions: safeParseInt(latestActivityPattern.transactions, 0),
    hourlyUsers: safeParseInt(latestActivityPattern.users, 0),
    hourlyGas: safeParseFloat(latestActivityPattern.gas, 0),
    hourlyFailedTxns: safeParseInt(latestActivityPattern.failed_transactions, 0),
    peakHourlyTransactions: safeParseInt(peakHour.transactions, 0),
    peakHourlyUsers: safeParseInt(peakHour.users, 0),
    averageHourlyTransactions: safeAverage(
      activityPatternsData.map((p: any) => safeParseInt(p.transactions, 0)),
      0
    ),
    activityPatterns: activityPatternsData.slice(0, DATA_LIMITS.MAX_ACTIVITY_PATTERNS),
  };
}

/**
 * Extract TVL from staking data
 */
function extractTVLMetrics(stakingData: any[]): number {
  return stakingData.reduce(
    (sum: number, item: any) =>
      sum + safeParseFloat(item.tvl || item.total_value || item.balance, 0),
    0
  );
}

/**
 * Main aggregation function - combines all data sources
 */
export function aggregateMetrics(rawData: RawDuneData): AggregatedMetrics {
  const coreMetrics = extractCoreMetrics(rawData.protocolData);
  const blockMetrics = extractBlockMetrics(rawData.allTimeTransactionsData, rawData.blockTimesData);
  const dailyMetrics = extractDailyMetrics(
    rawData.dexData,
    rawData.userData,
    rawData.dexMetricsData
  );
  const userBehaviorMetrics = extractUserBehaviorMetrics(
    rawData.userBehaviorData,
    rawData.transactionData
  );
  const protocolMetrics = extractProtocolMetrics(
    rawData.networkData,
    rawData.protocolMetricsData,
    coreMetrics.totalTransactions
  );
  const tokenMetrics = extractTokenMetrics(rawData.tokenBalancesData);
  const dexMetrics = extractDEXMetrics(rawData.dexTradingData);
  const activityMetrics = extractActivityPatterns(rawData.activityPatternsData);
  const totalTVL = extractTVLMetrics(rawData.stakingData);

  return {
    ...coreMetrics,
    ...blockMetrics,
    ...dailyMetrics,
    ...userBehaviorMetrics,
    ...protocolMetrics,
    ...tokenMetrics,
    ...dexMetrics,
    ...activityMetrics,
    totalTVL,
  };
}
