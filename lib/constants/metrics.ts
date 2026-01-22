/**
 * Constants for metrics calculations and configuration
 */

// Dune Analytics Query IDs
export const DUNE_QUERY_IDS = {
  // Core Network Analytics
  PROTOCOL_ACTIVITY: 5699127, // Main activity data: total_transactions, unique_senders, success_rate, avg_gas_cost
  USER_ANALYTICS: 4045225, // Gas fee data: gas_fee_apt, gas_fee_usd, net_gas_apt
  DEX_COMPARISON: 3431742, // Daily metrics: daily_active_addresses, daily_transactions
  STAKING_ANALYTICS: 5091227, // Staking data
  DEX_METRICS: 3442811, // Rich gas analytics: avg_gas_fee, gas_unit_price, transaction_count
  USER_BEHAVIOR: 4045138, // User behavior analytics
  TRANSACTION_ANALYSIS: 4045024, // Transaction analysis
  NETWORK_STATS: 3468810, // Network statistics
  PROTOCOL_METRICS: 3468830, // Protocol metrics
  TOKEN_BALANCES: 5699610, // Token balances from CoinStore
  DEX_TRADING_VOLUME: 5699630, // DEX swap events and trading volume
  ACTIVITY_PATTERNS: 5699668, // Hourly activity patterns
  NETWORK_OVERVIEW: 5699670, // Comprehensive network overview metrics
  ALL_TIME_TRANSACTIONS: 5699671, // All-time total transaction count
  BLOCK_TIMES: 5699672, // Block times and finality metrics
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  DUNE_API_REVALIDATE: 300, // 5 minutes
  API_RESPONSE_MAX_AGE: 300, // 5 minutes
  API_RESPONSE_STALE_WHILE_REVALIDATE: 600, // 10 minutes
  AUTO_REFRESH_INTERVAL: 300000, // 5 minutes in milliseconds
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// APT Token Constants
export const APT_CONSTANTS = {
  DECIMALS: 1e8, // APT has 8 decimals
  OCTA_TO_APT: 1e8, // 1 APT = 100,000,000 Octa
} as const;

// Threshold Values
export const THRESHOLDS = {
  WHALE_BALANCE: 1000000, // Minimum balance to be considered a whale (1M tokens)
  LARGE_HOLDER: 1000000, // Same as whale for now
  HIGH_GAS_USER: 0.5, // USD per user to be considered high-value
  MODERATE_GAS_USER: 0.1, // USD per user for moderate activity

  // Time windows
  HOURS_IN_DAY: 24,
  SECONDS_IN_DAY: 86400,
  MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,

  // Network health
  HIGH_SUCCESS_RATE: 95,
  GOOD_SUCCESS_RATE: 85,
  MIN_ACCEPTABLE_SUCCESS_RATE: 75,

  // User engagement
  EXCEPTIONAL_ENGAGEMENT: 0.6,
  STRONG_ENGAGEMENT: 0.4,
  MODERATE_ENGAGEMENT: 0.2,

  // Network utilization
  HIGH_UTILIZATION_START: 30,
  HIGH_UTILIZATION_END: 80,
  CONGESTION_THRESHOLD: 90,
  CAPACITY_WARNING: 80,

  // Protocol concentration
  HIGH_CONCENTRATION: 80,
  MODERATE_CONCENTRATION: 60,

  // Economic activity
  MAJOR_ECOSYSTEM_GAS_USD: 50000,
  SIGNIFICANT_ECOSYSTEM_GAS_USD: 10000,

  // TPS thresholds
  HIGH_PERFORMANCE_TPS: 1000,
  SCALABLE_TPS: 100,
} as const;

// Data quality limits
export const DATA_LIMITS = {
  TOP_PROTOCOLS: 5,
  TOP_TOKEN_HOLDERS: 10,
  TOP_WHALE_HOLDERS: 5,
  MAX_ACTIVITY_PATTERNS: 24, // One day of hourly data
  MIN_PROTOCOL_TRANSACTIONS: 100,
} as const;

// Metric formatting thresholds
export const FORMAT_THRESHOLDS = {
  BILLION: 1e9,
  MILLION: 1e6,
  THOUSAND: 1e3,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  DUNE_API_KEY_MISSING: "DUNE_API_KEY_TOKEN environment variable is not configured",
  DUNE_API_KEY_REQUIRED: "Please add DUNE_API_KEY_TOKEN to your environment variables",
  DUNE_API_ERROR: "Dune API error",
  FETCH_METRICS_ERROR: "Failed to fetch metrics data",
  CONFIGURATION_ERROR: "Configuration Error",
  UNKNOWN_ERROR: "Unknown error",
} as const;

// Query URLs
export const getDuneQueryUrl = (queryId: number): string => `https://dune.com/queries/${queryId}`;
