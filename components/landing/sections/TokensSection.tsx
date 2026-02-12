"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { FADE_UP, FADE_UP_DELAYED } from "@/lib/constants/animations";
import type { TokenData } from "@/lib/types/tokens";
import { formatCurrency, formatNumber } from "@/lib/utils/format/format";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";

const TokenTreemap = dynamic(() =>
  import("@/components/pages/markets/tokens/TokenTreemap").then((m) => m.TokenTreemap)
);

interface TokensSectionProps {
  tokens: TokenData[];
  loadingTokens: boolean;
  error: string | null;
  displayMetrics: {
    marketCap: number;
    tokenCount: number;
    averageMarketCap: number;
    medianMarketCap: number;
  };
  totalTokenCount: number;
  stableTokens: TokenData[];
  fetchInitialData: () => void;
}

export default function TokensSection({
  tokens,
  loadingTokens,
  error,
  displayMetrics,
  totalTokenCount,
  stableTokens,
  fetchInitialData,
}: TokensSectionProps) {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="tokens">
      <SectionHeader
        title="Token Market"
        description="Real-time market data for the Aptos token ecosystem"
      />

      <motion.div className="grid grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto" {...FADE_UP}>
        <div className="text-center p-4 rounded-lg border border-border bg-card">
          <p className="text-2xl md:text-3xl font-semibold text-foreground font-mono mb-1">
            {formatCurrency(displayMetrics.marketCap)}
          </p>
          <p className="text-sm text-muted-foreground">Non-APT Market Cap</p>
        </div>
        <div className="text-center p-4 rounded-lg border border-border bg-card">
          <p className="text-2xl md:text-3xl font-semibold text-foreground font-mono mb-1">
            {formatNumber(totalTokenCount)}
          </p>
          <p className="text-sm text-muted-foreground">Active Tokens</p>
        </div>
      </motion.div>

      {/* Treemap */}
      <motion.div {...FADE_UP_DELAYED(0.1)}>
        {error ? (
          <div className="flex items-center justify-center py-16">
            <div className="p-6 rounded-lg border border-border bg-card text-center max-w-md">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                <X className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">Failed to load data</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                type="button"
                onClick={fetchInitialData}
                className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loadingTokens ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading token data...</p>
            </div>
          </div>
        ) : tokens.length > 0 ? (
          <div className="w-full">
            <TokenTreemap tokens={stableTokens} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">No token data available</p>
          </div>
        )}
      </motion.div>
    </Section>
  );
}
