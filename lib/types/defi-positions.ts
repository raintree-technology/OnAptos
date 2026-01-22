/**
 * Type definitions for DeFi positions and balances
 */

import type { ProtocolType } from "@/lib/types/defi";

export interface DeFiPosition {
  protocol: string;
  protocolLabel: string;
  protocolType: ProtocolType;
  address: string;
  position: {
    supplied?: {
      asset: string;
      symbol: string;
      amount: string;
      value?: number;
    }[];
    borrowed?: {
      asset: string;
      symbol: string;
      amount: string;
      value?: number;
    }[];
    liquidity?: {
      poolId: string;
      token0: { asset: string; symbol: string; amount: string };
      token1: { asset: string; symbol: string; amount: string };
      lpTokens: string;
      value?: number;
    }[];
    staked?: {
      asset: string;
      symbol: string;
      amount: string;
      rewards?: string;
      value?: number;
    }[];
    derivatives?: {
      asset: string;
      symbol: string;
      amount: string;
      type: "long" | "short" | "option";
      value?: number;
    }[];
  };
  totalValue: number;
}

export interface DetailedPosition {
  protocol: string;
  protocolAddress: string;
  type: "liquidity" | "farming" | "lending" | "staking" | "nft" | "derivatives" | "other";
  description: string;
  tokens: Array<{
    symbol: string;
    address: string;
    balance: string;
    value?: string;
  }>;
  lpTokens: Array<{
    poolType: string;
    poolTokens: string[];
    balance: string;
    value?: string;
  }>;
  resources: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
  isActive: boolean;
}

export interface ComprehensivePositionSummary {
  walletAddress: string;
  positions: DetailedPosition[];
  totalActivePositions: number;
  totalProtocols: number;
  protocolBreakdown: Record<string, number>;
  valueBreakdown: Record<string, string>;
  lastUpdated: string;
}
