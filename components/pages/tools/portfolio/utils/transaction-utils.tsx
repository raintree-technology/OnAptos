/**
 * Transaction utility functions
 */

import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Coins,
  Gift,
  History,
  Layers,
  type LucideIcon,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/constants/ui/colors";
import type { Transaction } from "@/lib/types/transactions";
import {
  ActivityType,
  OptimizedTransactionAnalyzer as EnhancedTransactionAnalyzer,
  type OptimizedTransactionInfo as EnhancedTransactionInfo,
  TransactionCategory,
} from "@/lib/utils/blockchain/transactions/analysis";

/**
 * Enhanced transaction analysis function
 */
export const getTransactionAnalysis = (tx: Transaction): EnhancedTransactionInfo => {
  return EnhancedTransactionAnalyzer.analyzeTransactionSync(tx);
};

/**
 * Get icon for transaction type
 */
export const getTransactionTypeIcon = (transaction: Transaction): LucideIcon => {
  const analysis = getTransactionAnalysis(transaction);

  // Use enhanced analysis for better icon selection
  switch (analysis.category) {
    case TransactionCategory.DEFI:
      switch (analysis.activityType) {
        case ActivityType.SWAP:
          return ArrowLeftRight;
        case ActivityType.LIQUIDITY_ADD:
        case ActivityType.LIQUIDITY_REMOVE:
          return Layers;
        case ActivityType.LENDING_SUPPLY:
        case ActivityType.LENDING_WITHDRAW:
        case ActivityType.LENDING_BORROW:
        case ActivityType.LENDING_REPAY:
          return TrendingUp;
        case ActivityType.FARMING_STAKE:
        case ActivityType.FARMING_UNSTAKE:
          return Shield;
        case ActivityType.FARMING_HARVEST:
          return Gift;
        default:
          return Coins;
      }

    case TransactionCategory.STAKING:
      if (analysis.activityType === ActivityType.CLAIM_REWARDS) {
        return Gift;
      }
      return Shield;

    case TransactionCategory.TRANSFER:
      return analysis.direction === "incoming" ? ArrowDownRight : ArrowUpRight;

    case TransactionCategory.CEX:
    case TransactionCategory.BRIDGE:
      return ArrowLeftRight;

    case TransactionCategory.NFT:
      return Wallet;

    case TransactionCategory.RWA:
      return TrendingUp;

    case TransactionCategory.SYSTEM:
      return Zap;

    default: {
      // Fallback to original logic
      const lowerType = transaction.type.toLowerCase();
      if (lowerType.includes("transfer") || lowerType.includes("send")) {
        return ArrowUpRight;
      }
      if (lowerType.includes("deposit") || lowerType.includes("receive")) {
        return ArrowDownRight;
      }
      return History;
    }
  }
};

/**
 * Map protocol names to local icon paths
 */
export const getProtocolLogoPath = (protocolName: string): string | null => {
  const protocolIcons: Record<string, string> = {
    panora: "/icons/protocols/panora.webp",
    thala: "/icons/protocols/thala.avif",
    echelon: "/icons/protocols/echelon.avif",
    amnis: "/icons/protocols/amnis.avif",
    echo: "/icons/protocols/echo.webp",
  };

  const normalizedName = protocolName.toLowerCase().replace(/\s+/g, "");
  return protocolIcons[normalizedName] || null;
};

/**
 * Legacy category function for backwards compatibility
 */
export const getTransactionCategory = (tx: Transaction): string => {
  const analysis = getTransactionAnalysis(tx);

  // Map enhanced categories back to simple ones for existing UI
  switch (analysis.category) {
    case TransactionCategory.DEFI:
      if (analysis.activityType === ActivityType.SWAP) return "swap";
      if (
        analysis.activityType === ActivityType.LIQUIDITY_ADD ||
        analysis.activityType === ActivityType.LIQUIDITY_REMOVE
      )
        return "liquidity";
      if (
        analysis.activityType === ActivityType.LENDING_SUPPLY ||
        analysis.activityType === ActivityType.LENDING_WITHDRAW ||
        analysis.activityType === ActivityType.LENDING_BORROW ||
        analysis.activityType === ActivityType.LENDING_REPAY
      )
        return "liquidity";
      if (
        analysis.activityType === ActivityType.FARMING_STAKE ||
        analysis.activityType === ActivityType.FARMING_UNSTAKE
      )
        return "staking";
      if (analysis.activityType === ActivityType.FARMING_HARVEST) return "rewards";
      return "other";

    case TransactionCategory.STAKING:
      if (analysis.activityType === ActivityType.CLAIM_REWARDS) return "rewards";
      return "staking";

    case TransactionCategory.TRANSFER:
      return analysis.direction === "incoming" ? "received" : "sent";

    case TransactionCategory.CEX:
      return "cex";
    case TransactionCategory.BRIDGE:
      return "bridge";
    case TransactionCategory.NFT:
      return "nft";
    case TransactionCategory.RWA:
      return "rwa";
    case TransactionCategory.SYSTEM:
      return "system";

    default:
      return "other";
  }
};

/**
 * Helper function to get category colors
 */
export const getCategoryColors = (category: string): string => {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
};
