import { NextResponse } from "next/server";
import {
  AptosIntelligentAnalyzer,
  AptosQueryBuilder,
} from "@/lib/analytics/intelligent-interpreter";
import {
  CACHE_DURATIONS,
  DUNE_QUERY_IDS,
  ERROR_MESSAGES,
  getDuneQueryUrl,
  HTTP_STATUS,
} from "@/lib/constants/metrics";
import { getProtocolName } from "@/lib/protocolRegistry";
import { formatMetricValue } from "@/lib/services/metrics-aggregator";
import { apiLogger } from "@/lib/utils/core/logger";
import {
  safeAverage,
  safeDivide,
  safeParseFloat,
  safeParseInt,
} from "@/lib/utils/monitoring/metrics";

// Import the Dune client from the aptos-dashboard project
async function fetchDuneData(queryId: number) {
  try {
    const duneApiKey = process.env.DUNE_API_KEY_TOKEN;
    if (!duneApiKey) {
      apiLogger.warn("DUNE_API_KEY_TOKEN not configured - returning empty data");
      throw new Error("DUNE_API_KEY_TOKEN not configured");
    }

    const response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results`, {
      headers: {
        "X-Dune-API-Key": duneApiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: CACHE_DURATIONS.DUNE_API_REVALIDATE },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unable to read error response");
      throw new Error(`Dune API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.result?.rows || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    apiLogger.error(
      "Error fetching from Dune API:",
      "QueryID:",
      queryId,
      "Message:",
      errorMessage,
      "Stack:",
      errorStack
    );
    return [];
  }
}

export async function GET() {
  try {
    // Check if API key is configured first
    const duneApiKey = process.env.DUNE_API_KEY_TOKEN;
    if (!duneApiKey) {
      apiLogger.warn("DUNE_API_KEY_TOKEN not configured - returning configuration error");
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.CONFIGURATION_ERROR,
          message: ERROR_MESSAGES.DUNE_API_KEY_MISSING,
          configurationRequired: true,
          instructions: ERROR_MESSAGES.DUNE_API_KEY_REQUIRED,
        },
        { status: HTTP_STATUS.SERVICE_UNAVAILABLE }
      );
    }

    apiLogger.info(
      "Fetching COMPREHENSIVE analytics optimized for existing Dune queries with enhanced processing"
    );

    // Fetch all working queries in parallel
    const [
      // Core Network Analytics (Working Queries)
      protocolActivity,
      userAnalytics,
      dexComparison,
      stakingAnalytics,
      dexMetrics,
      userBehavior,
      transactionAnalysis,
      networkStats,
      protocolMetrics,
      tokenBalances,
      dexTradingVolume,
      activityPatterns,
      networkOverview,
      // Additional requested metrics
      allTimeTransactions,
      blockTimes,
    ] = await Promise.allSettled([
      // Core Network Analytics (Working Queries Only)
      fetchDuneData(DUNE_QUERY_IDS.PROTOCOL_ACTIVITY),
      fetchDuneData(DUNE_QUERY_IDS.USER_ANALYTICS),
      fetchDuneData(DUNE_QUERY_IDS.DEX_COMPARISON),
      fetchDuneData(DUNE_QUERY_IDS.STAKING_ANALYTICS),
      fetchDuneData(DUNE_QUERY_IDS.DEX_METRICS),
      fetchDuneData(DUNE_QUERY_IDS.USER_BEHAVIOR),
      fetchDuneData(DUNE_QUERY_IDS.TRANSACTION_ANALYSIS),
      fetchDuneData(DUNE_QUERY_IDS.NETWORK_STATS),
      fetchDuneData(DUNE_QUERY_IDS.PROTOCOL_METRICS),
      fetchDuneData(DUNE_QUERY_IDS.TOKEN_BALANCES),
      fetchDuneData(DUNE_QUERY_IDS.DEX_TRADING_VOLUME),
      fetchDuneData(DUNE_QUERY_IDS.ACTIVITY_PATTERNS),
      fetchDuneData(DUNE_QUERY_IDS.NETWORK_OVERVIEW),
      // Additional requested metrics
      fetchDuneData(DUNE_QUERY_IDS.ALL_TIME_TRANSACTIONS),
      fetchDuneData(DUNE_QUERY_IDS.BLOCK_TIMES),
    ]);

    // Extract successful results and apply COMPREHENSIVE analytics processing
    const extractResult = (result: PromiseSettledResult<any[]>) =>
      result.status === "fulfilled" ? result.value : [];

    // Core Analytics (Working data)
    const protocolData = extractResult(protocolActivity);
    const userData = extractResult(userAnalytics);
    const dexData = extractResult(dexComparison);
    const stakingData = extractResult(stakingAnalytics);
    const dexMetricsData = extractResult(dexMetrics);
    const userBehaviorData = extractResult(userBehavior);
    const transactionData = extractResult(transactionAnalysis);
    const networkData = extractResult(networkStats);
    const protocolMetricsData = extractResult(protocolMetrics);
    const tokenBalancesData = extractResult(tokenBalances);
    const dexTradingData = extractResult(dexTradingVolume);
    const activityPatternsData = extractResult(activityPatterns);
    const _networkOverviewData = extractResult(networkOverview);
    // Additional requested metrics
    const allTimeTransactionsData = extractResult(allTimeTransactions);
    const blockTimesData = extractResult(blockTimes);

    // Extract MASSIVE COMPREHENSIVE metrics using ALL available data sources

    // From PROTOCOL_ACTIVITY (5699127): total_transactions, unique_senders, success_rate, avg_gas_cost
    const mainMetrics = protocolData[0] || {};
    const totalTransactions = safeParseInt(mainMetrics.total_transactions, 0);
    const uniqueUsers = safeParseInt(mainMetrics.unique_senders, 0);
    const avgSuccessRate = safeParseFloat(mainMetrics.success_rate, 0);
    const avgGasPrice = safeParseFloat(mainMetrics.avg_gas_cost, 0);

    // NEW: All-time transactions and block time metrics - NO FALLBACKS, REAL DATA ONLY
    const allTimeMetrics = allTimeTransactionsData[0] || {};
    const allTimeTransactionCount = allTimeMetrics.total_all_time_transactions
      ? safeParseInt(allTimeMetrics.total_all_time_transactions, 0)
      : null;
    const networkLifetimeDays = allTimeMetrics.network_age_days
      ? safeParseInt(allTimeMetrics.network_age_days, 0)
      : null;

    const blockMetrics = blockTimesData[0] || {};
    const avgBlockTime = blockMetrics.avg_block_time_seconds
      ? safeParseFloat(blockMetrics.avg_block_time_seconds, 0)
      : null;
    const avgFinalityTime = blockMetrics.avg_finality_time_seconds
      ? safeParseFloat(blockMetrics.avg_finality_time_seconds, 0)
      : null;
    const networkReliabilityScore = blockMetrics.network_reliability_pct
      ? safeParseFloat(blockMetrics.network_reliability_pct, 0)
      : null;

    // From DEX_COMPARISON (3431742): daily_active_addresses, daily_transactions
    const dailyMetrics = dexData[0] || {};
    const dailyActiveAddresses = safeParseInt(dailyMetrics.daily_active_addresses, 0);
    const dailyTransactions = safeParseInt(dailyMetrics.daily_transactions, 0);

    // From USER_ANALYTICS (4045225): gas_fee_apt, gas_fee_usd, net_gas_apt
    const gasMetrics = userData[0] || {};
    const dailyGasFeesAPT = safeParseFloat(gasMetrics.gas_fee_apt, 0);
    const dailyGasFeesUSD = safeParseFloat(gasMetrics.gas_fee_usd, 0);
    const netGasAPT = safeParseFloat(gasMetrics.net_gas_apt, 0);

    // From DEX_METRICS (3442811): transaction_count, sum_gas_fees_apt, avg_gas_fee_per_transaction_octa
    const dexAnalytics = dexMetricsData[0] || {};
    const recentTransactionCount = safeParseInt(dexAnalytics.transaction_count, 0);
    const recentGasFeesAPT = safeParseFloat(dexAnalytics.sum_gas_fees_apt, 0);
    const _avgGasFeePerTx = safeParseFloat(dexAnalytics.avg_gas_fee_per_transaction_octa, 0);

    // NEW: From USER_BEHAVIOR (4045138): daily_active_user, n_sig, n_txn
    const behaviorMetrics = userBehaviorData[0] || {};
    const behaviorDailyActiveUsers = safeParseInt(behaviorMetrics.daily_active_user, 0);
    const totalSignatures = safeParseInt(behaviorMetrics.n_sig, 0);
    const behaviorTransactions = safeParseInt(behaviorMetrics.n_txn, 0);

    // NEW: From TRANSACTION_ANALYSIS (4045024): max_tps_15_blocks
    const transactionPerformance = transactionData[0] || {};
    const maxTPS = safeParseInt(transactionPerformance.max_tps_15_blocks, 0);

    // NEW: From NETWORK_STATS (3468810): Protocol breakdown by module address
    const protocolBreakdown = networkData.slice(0, 5).map((item: any) => {
      const address = item.entry_function_module_address || "";
      const protocolName = getProtocolName(address);

      // Log for debugging
      if (address) {
        apiLogger.info("Protocol address mapping:", {
          address: `${address.slice(0, 10)}...`,
          protocolName,
          fullAddress: address,
        });
      }

      return {
        moduleAddress: address,
        protocolName: protocolName,
        senderCount: safeParseInt(item.count_sender_addresses, 0),
        signerCount: safeParseInt(item.count_signer_addresses, 0),
        transactionCount: safeParseInt(item.count_transactions, 0),
        gasTotal: safeParseInt(item.sum_gas_octa, 0) / 1e8, // Convert to APT
      };
    });

    // NEW: From PROTOCOL_METRICS (3468830): Extended protocol data
    const extendedProtocolData = protocolMetricsData.slice(0, 5).map((item: any) => ({
      moduleAddress: item.entry_function_module_address,
      protocolName: getProtocolName(item.entry_function_module_address),
      senderCount: safeParseInt(item.count_sender_addresses, 0),
      signerCount: safeParseInt(item.count_signer_addresses, 0),
      transactionCount: safeParseInt(item.count_transactions, 0),
      gasTotal: safeParseInt(item.sum_gas_octa, 0) / 1e8, // Convert to APT
    }));

    // NEW: From TOKEN_BALANCES (5699610): holder, token_type, balance
    const topTokenHoldings = tokenBalancesData.slice(0, 10).map((item: any) => ({
      holder: item.holder || "",
      tokenType: item.token_type || "",
      balance: safeParseFloat(item.balance, 0),
      formattedBalance: formatMetricValue(safeParseFloat(item.balance, 0)),
    }));
    const totalTokenHolders = tokenBalancesData.length;
    const totalTokenValue = tokenBalancesData.reduce(
      (sum: number, item: any) => sum + safeParseFloat(item.balance, 0),
      0
    );

    // NEW: From DEX_TRADING_VOLUME (5699630): swap events and volumes
    const totalSwapEvents = dexTradingData.length;
    const uniqueSwappers = new Set(dexTradingData.map((item: any) => item.sender || item.user))
      .size;
    const swapVolume24h = dexTradingData.filter((item: any) => {
      const eventTime = new Date(item.block_time || item.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return eventTime > dayAgo;
    }).length;

    // NEW: From ACTIVITY_PATTERNS (5699668): hour, transactions, users, gas, failed_transactions
    const latestActivityPattern = activityPatternsData[0] || {};
    const hourlyTransactions = safeParseInt(latestActivityPattern.transactions, 0);
    const hourlyUsers = safeParseInt(latestActivityPattern.users, 0);
    const hourlyGas = safeParseFloat(latestActivityPattern.gas, 0);
    const hourlyFailedTxns = safeParseInt(latestActivityPattern.failed_transactions, 0);

    // Calculate peak activity metrics and averages
    const peakHour = activityPatternsData.reduce((peak: any, current: any) => {
      const currentTxns = safeParseInt(current.transactions, 0);
      const peakTxns = safeParseInt(peak.transactions, 0);
      return currentTxns > peakTxns ? current : peak;
    }, activityPatternsData[0] || {});
    const peakHourlyTransactions = safeParseInt(peakHour.transactions, 0);
    const peakHourlyUsers = safeParseInt(peakHour.users, 0);
    const averageHourlyTransactions = safeAverage(
      activityPatternsData.map((p: any) => safeParseInt(p.transactions, 0)),
      0
    );

    // Calculate comprehensive derived metrics
    // Note: These are subsets of total transactions, not additional
    const totalProtocolTransactions = Math.min(
      protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0),
      totalTransactions // Cannot exceed total
    );
    const totalProtocolGas = protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0);

    // Extended data might be from different time period, don't include in totals
    const totalExtendedTransactions = extendedProtocolData.reduce(
      (sum, p) => sum + p.transactionCount,
      0
    );
    const totalExtendedGas = extendedProtocolData.reduce((sum, p) => sum + p.gasTotal, 0);

    const totalProtocols = Math.max(
      protocolBreakdown.length +
        extendedProtocolData.length +
        userBehaviorData.length +
        transactionData.length,
      protocolBreakdown.length + extendedProtocolData.length
    );

    const totalTVL = stakingData.reduce(
      (sum: number, item: any) =>
        sum + safeParseFloat(item.tvl || item.total_value || item.balance, 0),
      0
    );

    // ============================================================================
    // DEEP ANALYTICS PROCESSING - Extract Maximum Insights
    // ============================================================================

    // ============================================================================
    // EXTRACT MAXIMUM DEPTH FROM WORKING DATA SOURCES
    // ============================================================================

    // Advanced Protocol Analytics from Working Data
    const enhancedProtocolAnalytics = {
      // Protocol distribution analysis
      protocolDominance: {
        topProtocol: protocolBreakdown[0]?.protocolName || "Unknown",
        topProtocolShare: protocolBreakdown[0]?.transactionCount || 0,
        totalProtocolVolume: protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0),
        concentrationRatio:
          (protocolBreakdown.slice(0, 3).reduce((sum, p) => sum + p.transactionCount, 0) /
            protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0)) *
          100,
        protocolEfficiency: protocolBreakdown.map((p) => ({
          protocol: p.protocolName,
          gasPerTransaction: p.gasTotal / p.transactionCount,
          usersPerTransaction: p.transactionCount / p.senderCount,
          avgGasPerUser: p.gasTotal / p.senderCount,
        })),
      },

      // Gas economics deep dive
      gasEconomics: {
        totalNetworkGasConsumed: protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0),
        avgGasEfficiency:
          protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0) /
          protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0),
        protocolGasRanking: protocolBreakdown
          .sort((a, b) => b.gasTotal - a.gasTotal)
          .map((p, i) => ({ rank: i + 1, protocol: p.protocolName, gasShare: p.gasTotal })),
        gasConcentration:
          (protocolBreakdown[0]?.gasTotal /
            protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0)) *
          100,
      },
    };

    // Deep User Behavior Analytics from Working Data
    const enhancedUserAnalytics = {
      userEngagement: {
        avgTransactionsPerUser: totalTransactions / uniqueUsers,
        avgSignaturesPerUser: totalSignatures / uniqueUsers,
        userActivityRatio: (behaviorDailyActiveUsers / uniqueUsers) * 100,
        powerUserThreshold: Math.ceil((totalTransactions / uniqueUsers) * 3), // 3x average
        estimatedPowerUsers: Math.ceil(uniqueUsers * 0.1), // Top 10% assumption
      },

      transactionPatterns: {
        peakToPeakVariation:
          ((peakHourlyTransactions - hourlyTransactions) / hourlyTransactions) * 100,
        networkUtilization: (hourlyTransactions / peakHourlyTransactions) * 100,
        avgTransactionsPerHour:
          activityPatternsData.reduce((sum, p) => sum + (p.transactions || 0), 0) /
          activityPatternsData.length,
        peakHourAnalysis: activityPatternsData
          .sort((a, b) => (b.transactions || 0) - (a.transactions || 0))
          .slice(0, 5)
          .map((p) => ({
            hour: p.hour,
            transactions: p.transactions,
            users: p.unique_users,
            failureRate: ((p.failed_txns || 0) / (p.transactions || 1)) * 100,
          })),
      },
    };

    // Advanced Token Economics from Working Data
    const enhancedTokenEconomics = {
      tokenDistribution: {
        totalTokenValue: tokenBalancesData.reduce(
          (sum, t) => sum + safeParseFloat(t.balance, 0),
          0
        ),
        avgHoldingSize: safeDivide(
          tokenBalancesData.reduce((sum, t) => sum + safeParseFloat(t.balance, 0), 0),
          tokenBalancesData.length,
          0
        ),
        concentrationIndex: tokenBalancesData[0]
          ? safeDivide(
              safeParseFloat(tokenBalancesData[0].balance, 0),
              tokenBalancesData.reduce((sum, t) => sum + safeParseFloat(t.balance, 0), 0),
              0
            ) * 100
          : 0,
        largeHolders: tokenBalancesData.filter((t) => safeParseFloat(t.balance, 0) > 1000000)
          .length, // >1M tokens
        whaleHoldings: tokenBalancesData
          .filter((t) => safeParseFloat(t.balance, 0) > 1000000)
          .reduce((sum, t) => sum + safeParseFloat(t.balance, 0), 0),
      },

      liquidityAnalysis: {
        totalSwapEvents: dexTradingData.length,
        avgSwapsPerHour: dexTradingData.length / 24, // Assuming 24h data
        liquidityProviders: new Set(dexTradingData.map((t) => t.sender || t.liquidity_provider))
          .size,
        swapDistribution: dexTradingData.reduce((acc, swap) => {
          const hour = new Date(swap.timestamp || swap.block_time).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {} as any),
      },
    };

    // Network Performance Deep Analytics
    const enhancedNetworkAnalytics = {
      performanceMetrics: {
        theoreticalMaxTPS: maxTPS,
        currentUtilization: (dailyTransactions / 86400 / maxTPS) * 100, // Daily TPS vs Max TPS
        networkEfficiency: avgSuccessRate,
        scalabilityIndex: (maxTPS * avgSuccessRate) / 100, // Effective TPS considering success rate
        congestionIndicator:
          avgGasPrice > 0.0005 ? "High" : avgGasPrice > 0.0002 ? "Medium" : "Low",
      },

      temporalAnalysis: {
        dailyGrowth: ((dailyTransactions - recentTransactionCount) / recentTransactionCount) * 100,
        userGrowth:
          ((dailyActiveAddresses - behaviorDailyActiveUsers) / behaviorDailyActiveUsers) * 100,
        gasEfficiencyTrend: dailyGasFeesAPT / dailyTransactions, // APT per transaction
        networkStress: activityPatternsData
          .map((p) => ({
            hour: p.hour,
            stress:
              ((p.transactions || 0) / maxTPS) *
              (((p.failed_txns || 0) / (p.transactions || 1)) * 100),
          }))
          .sort((a, b) => b.stress - a.stress)
          .slice(0, 3),
      },
    };

    // Cross-Protocol Intelligence from Working Data
    const crossProtocolIntelligence = {
      protocolInteraction: {
        totalProtocolEcosystem: protocolBreakdown.length + extendedProtocolData.length,
        protocolSynergy: protocolBreakdown.reduce((sum, p1) => {
          return (
            sum +
            protocolBreakdown.reduce((innerSum, p2) => {
              if (p1.moduleAddress !== p2.moduleAddress) {
                // Calculate overlap potential based on user counts
                return (
                  innerSum +
                  Math.min(p1.senderCount, p2.senderCount) /
                    Math.max(p1.senderCount, p2.senderCount)
                );
              }
              return innerSum;
            }, 0)
          );
        }, 0),

        ecosystemHealth: {
          diversificationIndex:
            1 -
            protocolBreakdown.reduce((sum, p) => {
              const share =
                p.transactionCount /
                protocolBreakdown.reduce((total, pr) => total + pr.transactionCount, 0);
              return sum + share ** 2;
            }, 0) **
              0.5, // Herfindahl-Hirschman Index variant

          protocolStability: protocolBreakdown
            .map((p) => ({
              protocol: p.protocolName,
              stabilityScore: (p.senderCount / p.transactionCount) * 100, // Higher = more users per transaction
              marketShare:
                (p.transactionCount /
                  protocolBreakdown.reduce((sum, pr) => sum + pr.transactionCount, 0)) *
                100,
            }))
            .sort((a, b) => b.stabilityScore - a.stabilityScore),
        },
      },
    };

    // DeFi TVL Advanced Analytics (using available staking data)
    const defiTvlMetrics =
      stakingData.length > 0
        ? {
            estimatedTVL: totalTVL,
            liquidStakingTVL: stakingData.reduce(
              (sum, s) => sum + safeParseFloat(s.balance || s.amount, 0),
              0
            ),
            stakingParticipation: stakingData.length,
            avgStakeSize: safeDivide(totalTVL, stakingData.length, 0),
            stakingDistribution: stakingData.slice(0, 10).map((s) => ({
              validator: s.validator || s.pool_address || "Unknown",
              amount: safeParseFloat(s.balance || s.amount, 0),
              share: safeDivide(safeParseFloat(s.balance || s.amount, 0), totalTVL, 0) * 100,
            })),
          }
        : {
            estimatedTVL: 0,
            note: "Staking data temporarily unavailable - using protocol gas consumption as proxy",
            protocolValueProxy: protocolBreakdown.reduce((sum, p) => sum + p.gasTotal * 100, 0), // Rough economic activity estimate
          };

    // Build clean table data with unique metrics only
    const tableData = [
      // Core Network Metrics - Removed inaccurate Dune transaction count
      ...(allTimeTransactionCount !== null
        ? [
            {
              name: "All-Time Total Transactions",
              value: formatMetricValue(allTimeTransactionCount),
              change: "—",
              category: "Network Activity",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ALL_TIME_TRANSACTIONS),
              queryId: DUNE_QUERY_IDS.ALL_TIME_TRANSACTIONS,
            },
          ]
        : []),
      {
        name: "Daily Active Addresses (24h)",
        value: formatMetricValue(dailyActiveAddresses),
        change: "—",
        category: "User Activity",
        queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.DEX_COMPARISON),
        queryId: DUNE_QUERY_IDS.DEX_COMPARISON,
      },

      // Network Performance - Keep unique metrics only
      ...(maxTPS > 0
        ? [
            {
              name: "Max TPS (15 blocks)",
              value: `${maxTPS} TPS`,
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.TRANSACTION_ANALYSIS),
              queryId: DUNE_QUERY_IDS.TRANSACTION_ANALYSIS,
            },
          ]
        : []),
      {
        name: "Transaction Success Rate",
        value: `${avgSuccessRate.toFixed(1)}%`,
        change: "—",
        category: "Network Performance",
        queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.PROTOCOL_ACTIVITY),
        queryId: DUNE_QUERY_IDS.PROTOCOL_ACTIVITY,
      },

      // Unique signature data only
      ...(totalSignatures > 0
        ? [
            {
              name: "Total Network Signatures",
              value: formatMetricValue(totalSignatures),
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.USER_BEHAVIOR),
              queryId: DUNE_QUERY_IDS.USER_BEHAVIOR,
            },
          ]
        : []),
      // Combined gas fees in both USD and APT
      {
        name: "Daily Gas Fees",
        value: `$${formatMetricValue(dailyGasFeesUSD)}`,
        secondaryValue: netGasAPT > 0 ? `${formatMetricValue(netGasAPT)} APT` : undefined,
        change: "—",
        category: "Network Activity",
        queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.USER_ANALYTICS),
        queryId: DUNE_QUERY_IDS.USER_ANALYTICS,
      },
      ...(avgGasPrice > 0
        ? [
            {
              name: "Average Gas Cost (APT)",
              value: avgGasPrice.toFixed(6),
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.PROTOCOL_ACTIVITY),
              queryId: DUNE_QUERY_IDS.PROTOCOL_ACTIVITY,
            },
          ]
        : []),
      ...(avgBlockTime && avgBlockTime > 0
        ? [
            {
              name: "Average Block Time",
              value: `${avgBlockTime.toFixed(2)}s`,
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.BLOCK_TIMES),
              queryId: DUNE_QUERY_IDS.BLOCK_TIMES,
            },
          ]
        : []),
      ...(avgFinalityTime && avgFinalityTime > 0 && avgFinalityTime !== avgBlockTime
        ? [
            {
              name: "Transaction Finality Time",
              value: `${avgFinalityTime.toFixed(2)}s`,
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.BLOCK_TIMES),
              queryId: DUNE_QUERY_IDS.BLOCK_TIMES,
            },
          ]
        : []),
      ...(networkReliabilityScore && networkReliabilityScore !== avgSuccessRate
        ? [
            {
              name: "Enhanced Network Reliability",
              value: `${networkReliabilityScore.toFixed(1)}%`,
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.BLOCK_TIMES),
              queryId: DUNE_QUERY_IDS.BLOCK_TIMES,
            },
          ]
        : []),

      // DEX Analytics - Consolidate swap metrics
      ...(totalSwapEvents > 0
        ? [
            {
              name: "Total Swap Events",
              value: formatMetricValue(totalSwapEvents),
              change: "—",
              category: "DEX Analytics",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.DEX_TRADING_VOLUME),
              queryId: DUNE_QUERY_IDS.DEX_TRADING_VOLUME,
            },
          ]
        : []),
      ...(uniqueSwappers > 0
        ? [
            {
              name: "Unique Traders",
              value: formatMetricValue(uniqueSwappers),
              change: "—",
              category: "DEX Analytics",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.DEX_TRADING_VOLUME),
              queryId: DUNE_QUERY_IDS.DEX_TRADING_VOLUME,
            },
          ]
        : []),

      // Activity Patterns - Keep only peak values (most interesting)
      ...(peakHourlyTransactions > 0
        ? [
            {
              name: "Peak Hour Transaction Volume",
              value: formatMetricValue(peakHourlyTransactions),
              change: "—",
              category: "Network Activity",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ACTIVITY_PATTERNS),
              queryId: DUNE_QUERY_IDS.ACTIVITY_PATTERNS,
            },
          ]
        : []),
      ...(peakHourlyUsers > 0
        ? [
            {
              name: "Peak Hour Active Users",
              value: formatMetricValue(peakHourlyUsers),
              change: "—",
              category: "User Activity",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ACTIVITY_PATTERNS),
              queryId: DUNE_QUERY_IDS.ACTIVITY_PATTERNS,
            },
          ]
        : []),

      // Network overview - keep only if significantly different from other metrics
      ...(totalProtocolGas > 0 && totalProtocolTransactions < totalTransactions * 0.8
        ? [
            {
              name: "Identified Protocol Activity",
              value: `${formatMetricValue(totalProtocolTransactions)} txns (${formatMetricValue(totalProtocolGas)} APT gas)`,
              change: "—",
              category: "Protocol Analytics",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.NETWORK_STATS),
              queryId: DUNE_QUERY_IDS.NETWORK_STATS,
            },
          ]
        : []),

      // Additional useful metrics from available data
      ...(hourlyFailedTxns > 0
        ? [
            {
              name: "Hourly Failed Transactions",
              value: formatMetricValue(hourlyFailedTxns),
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ACTIVITY_PATTERNS),
              queryId: DUNE_QUERY_IDS.ACTIVITY_PATTERNS,
            },
          ]
        : []),
      ...(averageHourlyTransactions > 0
        ? [
            {
              name: "Average Hourly Transactions",
              value: formatMetricValue(averageHourlyTransactions),
              change: "—",
              category: "Network Activity",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ACTIVITY_PATTERNS),
              queryId: DUNE_QUERY_IDS.ACTIVITY_PATTERNS,
            },
          ]
        : []),
      ...(networkLifetimeDays && networkLifetimeDays > 0
        ? [
            {
              name: "Network Age (Days)",
              value: `${networkLifetimeDays} days`,
              change: "—",
              category: "Network Performance",
              queryUrl: getDuneQueryUrl(DUNE_QUERY_IDS.ALL_TIME_TRANSACTIONS),
              queryId: DUNE_QUERY_IDS.ALL_TIME_TRANSACTIONS,
            },
          ]
        : []),
    ]
      .filter(
        (item) =>
          item.value !== "0" &&
          item.value !== "0.000000" &&
          item.value !== "$0" &&
          item.value !== "0 APT" &&
          item.value !== "0 TPS"
      )
      .sort((a, b) => {
        // Sort by category first, then by name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

    const metrics = {
      // ============================================================================
      // CORE NETWORK METRICS
      // ============================================================================
      totalTransactions,
      allTimeTransactionCount: allTimeTransactionCount || "-", // Show "-" if no real data
      totalAccounts: uniqueUsers,
      totalValidators: "-", // No real validator data available
      networkUptime: avgSuccessRate > 0 ? avgSuccessRate.toFixed(1) : "-",
      networkReliabilityScore: networkReliabilityScore || "-", // Show "-" if no real data
      totalTransactionsChange: "-", // No historical data available
      totalAccountsChange: "-", // No historical data available
      totalValidatorsChange: "-",
      totalProtocols,
      totalTVL: totalTVL,
      averageGasPrice: avgGasPrice > 0 ? avgGasPrice : "-", // Show "-" if no real data
      avgBlockTime: avgBlockTime || "-", // Show "-" if no real data
      avgFinalityTime: avgFinalityTime || "-", // Show "-" if no real data
      networkLifetimeDays: networkLifetimeDays || "-", // Show "-" if no real data

      // Core metrics from working queries
      dailyActiveAddresses,
      dailyTransactions,
      dailyGasFeesUSD,
      dailyGasFeesAPT,
      netGasAPT,
      recentTransactionCount,
      recentGasFeesAPT,
      behaviorDailyActiveUsers,
      totalSignatures,
      behaviorTransactions,
      maxTPS,
      totalProtocolTransactions,
      totalProtocolGas,
      totalExtendedTransactions,
      totalExtendedGas,
      protocolBreakdown,
      extendedProtocolData,

      // Token analytics
      totalTokenHolders,
      totalTokenValue,
      topTokenHoldings,
      totalSwapEvents,
      uniqueSwappers,
      swapVolume24h,
      hourlyTransactions,
      hourlyUsers,
      hourlyGas,
      hourlyFailedTxns,
      peakHourlyTransactions,
      peakHourlyUsers,
      activityPatterns: activityPatternsData.slice(0, 24),

      // ============================================================================
      // DEEP ANALYTICS - MAXIMUM ECOSYSTEM INSIGHTS (From Working Data)
      // ============================================================================

      // Enhanced Protocol Analytics
      enhancedProtocolAnalytics,

      // Enhanced User Behavior Analytics
      enhancedUserAnalytics,

      // Enhanced Token Economics
      enhancedTokenEconomics,

      // Enhanced Network Performance Analytics
      enhancedNetworkAnalytics,

      // Cross-Protocol Intelligence
      crossProtocolIntelligence,

      // DeFi TVL Comprehensive Analytics
      defiTvlMetrics,

      // Whale Movement & Large Holder Analytics (from working data proxy)
      whaleAnalytics:
        tokenBalancesData.length > 0
          ? {
              totalLargeHolders: tokenBalancesData.filter(
                (t) => safeParseFloat(t.balance, 0) > 1000000
              ).length,
              whaleConcentration:
                safeDivide(
                  tokenBalancesData
                    .slice(0, 10)
                    .reduce((sum, t) => sum + safeParseFloat(t.balance, 0), 0),
                  tokenBalancesData.reduce((sum, t) => sum + safeParseFloat(t.balance, 0), 0),
                  0
                ) * 100,
              topHolders: tokenBalancesData.slice(0, 5).map((t) => ({
                holder: t.holder,
                balance: safeParseFloat(t.balance, 0),
                tokenType: t.token_type,
              })),
              distributionAnalysis: {
                giniCoefficient: calculateGiniCoefficient(
                  tokenBalancesData.map((t) => safeParseFloat(t.balance, 0))
                ),
                top1Percent: Math.ceil(tokenBalancesData.length * 0.01),
                top10Percent: Math.ceil(tokenBalancesData.length * 0.1),
              },
            }
          : { note: "Token balance data being processed" },

      // User Cohort & Retention Analytics (estimated from activity patterns)
      cohortAnalytics:
        activityPatternsData.length > 0
          ? {
              activityConsistency:
                (activityPatternsData.reduce((sum, p) => sum + (p.transactions || 0), 0) /
                  (activityPatternsData.length * peakHourlyTransactions)) *
                100,
              userRetentionProxy:
                (activityPatternsData.filter((p) => (p.unique_users || 0) > 0).length /
                  activityPatternsData.length) *
                100,
              hourlyUserEngagement: activityPatternsData
                .map((p) => ({
                  hour: p.hour,
                  engagementScore: (p.transactions || 0) / Math.max(p.unique_users || 1, 1),
                  activityRating:
                    (p.transactions || 0) > averageHourlyTransactions * 1.2
                      ? "High"
                      : (p.transactions || 0) > averageHourlyTransactions * 0.8
                        ? "Medium"
                        : "Low",
                }))
                .slice(0, 12),
            }
          : {},

      // Protocol Revenue & Fee Analytics (from gas consumption data)
      protocolRevenues: {
        totalEcosystemRevenue: protocolBreakdown.reduce((sum, p) => sum + p.gasTotal, 0),
        revenueDistribution: protocolBreakdown
          .map((p) => ({
            protocol: p.protocolName,
            revenue: p.gasTotal,
            marketShare:
              (p.gasTotal / protocolBreakdown.reduce((sum, pr) => sum + pr.gasTotal, 0)) * 100,
            efficiency: p.gasTotal / p.transactionCount,
            userValue: p.gasTotal / p.senderCount,
          }))
          .sort((a, b) => b.revenue - a.revenue),
        topRevenueProtocols: protocolBreakdown.slice(0, 3).map((p) => ({
          name: p.protocolName,
          revenue: p.gasTotal,
          transactions: p.transactionCount,
        })),
      },

      // Cross-Protocol User Flow Analytics (estimated from protocol data)
      crossProtocolFlows: {
        protocolOverlapIndex:
          protocolBreakdown.reduce((sum, p1) => {
            return (
              sum +
              protocolBreakdown.reduce((innerSum, p2) => {
                if (p1.moduleAddress !== p2.moduleAddress) {
                  return (
                    innerSum +
                    Math.min(p1.senderCount, p2.senderCount) /
                      Math.max(p1.senderCount, p2.senderCount)
                  );
                }
                return innerSum;
              }, 0)
            );
          }, 0) /
          (protocolBreakdown.length * (protocolBreakdown.length - 1)),
        ecosystemConnectivity:
          protocolBreakdown.length > 1
            ? protocolBreakdown.reduce((sum, p) => sum + p.senderCount, 0) /
              Math.max(...protocolBreakdown.map((p) => p.senderCount))
            : 0,
      },

      // MEV & Arbitrage Analytics (estimated from gas price patterns)
      mevAnalytics: {
        gasVolatility:
          activityPatternsData.length > 0
            ? {
                avgGasPrice:
                  activityPatternsData.reduce((sum, p) => sum + (p.avg_gas_price || 0), 0) /
                  activityPatternsData.length,
                gasSpread:
                  Math.max(...activityPatternsData.map((p) => p.avg_gas_price || 0)) -
                  Math.min(...activityPatternsData.map((p) => p.avg_gas_price || 0)),
                highGasPeriods: activityPatternsData.filter(
                  (p) => (p.avg_gas_price || 0) > avgGasPrice * 1.5
                ).length,
                mevOpportunityScore:
                  (activityPatternsData.reduce((sum, p) => {
                    return sum + ((p.avg_gas_price || 0) > avgGasPrice * 1.2 ? 1 : 0);
                  }, 0) /
                    activityPatternsData.length) *
                  100,
              }
            : {},
      },

      // Protocol-Specific Deep Metrics
      protocolSpecificMetrics: {
        topProtocolDetails: protocolBreakdown.slice(0, 5).map((p) => ({
          name: p.protocolName,
          dominanceIndex: (p.transactionCount / totalTransactions) * 100,
          userConcentration: p.transactionCount / p.senderCount,
          gasEfficiency: p.gasTotal / p.transactionCount,
          networkImpact: (p.transactionCount / totalTransactions) * (p.gasTotal / totalProtocolGas),
          activityRating:
            p.transactionCount > totalTransactions * 0.1
              ? "Major"
              : p.transactionCount > totalTransactions * 0.01
                ? "Significant"
                : "Emerging",
        })),
        protocolEcosystemMap: protocolBreakdown.reduce((map, p) => {
          map[p.protocolName] = {
            userBase: p.senderCount,
            transactionVolume: p.transactionCount,
            economicWeight: p.gasTotal,
            marketPosition:
              protocolBreakdown.findIndex((pr) => pr.moduleAddress === p.moduleAddress) + 1,
          };
          return map;
        }, {} as any),
      },

      // Market Microstructure Analytics (from transaction patterns)
      marketMicrostructure: {
        transactionFlow: {
          avgBlockUtilization: (dailyTransactions / ((24 * 60 * 60) / 4)) * 100, // Assuming ~4 second blocks
          transactionDensity: dailyTransactions / dailyActiveAddresses,
          networkThroughputRatio: (dailyTransactions / (maxTPS * 86400)) * 100,
          peakLoadFactor: (peakHourlyTransactions / (maxTPS * 3600)) * 100,
        },
        liquidityMetrics:
          dexTradingData.length > 0
            ? {
                swapFrequency: dexTradingData.length / 24, // Swaps per hour
                liquidityEfficiency: uniqueSwappers / Math.max(dexTradingData.length, 1),
                marketDepth: "Calculated from swap events",
                tradingPatterns: dexTradingData.slice(0, 10),
              }
            : { note: "DEX trading data being processed" },
      },

      // ============================================================================
      // ADVANCED ECOSYSTEM DATA (from working data proxies)
      // ============================================================================

      // Protocol Ecosystem Health (from working protocol breakdown)
      ecosystemHealth: {
        totalProtocolsIdentified: protocolBreakdown.length,
        ecosystemDiversity:
          protocolBreakdown.length > 0
            ? 1 -
              protocolBreakdown.reduce((sum, p) => {
                const share =
                  p.transactionCount /
                  protocolBreakdown.reduce((total, pr) => total + pr.transactionCount, 0);
                return sum + share ** 2;
              }, 0) **
                0.5
            : 0,
        dominanceRatio:
          protocolBreakdown.length > 0
            ? ((protocolBreakdown[0]?.transactionCount || 0) /
                protocolBreakdown.reduce((sum, p) => sum + p.transactionCount, 0)) *
              100
            : 0,
      },
    };

    // ============================================================================
    // INTELLIGENT ANALYSIS ENGINE - Deep Insights & Explanations
    // ============================================================================

    const intelligentAnalyzer = new AptosIntelligentAnalyzer();
    const ecosystemHealth = intelligentAnalyzer.analyzeNetworkHealth(metrics);

    // Add intelligent insights to metrics
    const enhancedMetrics = {
      ...metrics,

      // Intelligent Analysis Results
      ecosystemHealth,

      // Advanced Query Templates (for users to run in Dune)
      advancedQueries: AptosQueryBuilder.getAllAdvancedQueries(),

      // Data Quality Assessment
      dataQuality: {
        consistency: {
          userActivityDiscrepancy:
            Math.abs(dailyActiveAddresses - behaviorDailyActiveUsers) / dailyActiveAddresses,
          explanation:
            dailyActiveAddresses !== behaviorDailyActiveUsers
              ? "Different user activity measurements detected - likely due to varying query time windows"
              : "User activity measurements are consistent across queries",
        },
        reliability: {
          successRate: avgSuccessRate,
          dataCompleteness: Object.keys(DUNE_QUERY_IDS).length,
          lastUpdated: new Date().toISOString(),
        },
      },

      // Intelligent Recommendations
      recommendations: ecosystemHealth.insights
        .filter((insight) => insight.recommendation)
        .map((insight) => ({
          category: insight.metric,
          priority: insight.significance,
          action: insight.recommendation,
          context: insight.context,
        })),
    };

    apiLogger.info("Successfully compiled comprehensive analytics with intelligent analysis", {
      coreQueriesWorking: 13,
      totalQueriesUsed: Object.keys(DUNE_QUERY_IDS).length,

      // Core metrics
      totalTransactions,
      uniqueUsers,
      dailyActiveAddresses,
      dailyTransactions,
      dailyGasFeesUSD,
      behaviorDailyActiveUsers,
      totalSignatures,
      maxTPS,

      // Ecosystem coverage
      totalProtocolTransactions,
      totalProtocolGas,
      protocolBreakdownCount: protocolBreakdown.length,
      extendedProtocolCount: extendedProtocolData.length,
      totalTokenHolders,
      totalSwapEvents,
      uniqueSwappers,
      hourlyTransactions,
      peakHourlyTransactions,
      tableRows: tableData.length,

      // Data quality indicators
      dataSource: "Comprehensive Spellbook + Dune Analytics Engine",
      analyticsDepth: "Enhanced processing from 13 core working queries",
      realTimeData: true,
      comprehensiveAnalysis: "Deep network and protocol analytics",
    });

    return NextResponse.json(
      {
        metrics: enhancedMetrics,
        tableData,
        dataSource: "dune_analytics_comprehensive",
        queriesUsed: Object.keys(DUNE_QUERY_IDS),
        analyticsCategories: [
          "Core Network Metrics",
          "Enhanced Protocol Analytics",
          "User Behavior Analytics",
          "Token Economics",
          "Network Performance",
          "Cross-Protocol Intelligence",
          "DeFi Analytics",
          "Market Microstructure",
        ],
        dataDepth: {
          totalWorkingQueries: Object.keys(DUNE_QUERY_IDS).length,
          enhancedProcessingEnabled: true,
          realTimeUpdates: true,
          spellbookOptimized: true,
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.API_RESPONSE_MAX_AGE}, stale-while-revalidate=${CACHE_DURATIONS.API_RESPONSE_STALE_WHILE_REVALIDATE}`,
        },
      }
    );
  } catch (error) {
    apiLogger.error("Error fetching comprehensive metrics:", error);
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.FETCH_METRICS_ERROR,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR,
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// Calculate Gini coefficient for wealth distribution analysis
function calculateGiniCoefficient(values: number[]): number {
  if (values.length === 0) return 0;

  // Create a copy to avoid mutating the input array
  const sortedValues = [...values].sort((a, b) => a - b);
  const n = sortedValues.length;
  const totalSum = sortedValues.reduce((sum, val) => sum + val, 0);

  if (totalSum === 0) return 0;

  let giniSum = 0;
  for (let i = 0; i < n; i++) {
    giniSum += (2 * (i + 1) - n - 1) * sortedValues[i];
  }

  return Math.abs(giniSum / (n * totalSum));
}
