"use client";

import { motion } from "framer-motion";
import { BarChart3, Coins, Gauge, TrendingUp, Wallet } from "lucide-react";
import { FADE_UP } from "@/lib/constants/animations";
import CTACard from "../shared/CTACard";
import { Section } from "../shared/Section";

export default function CTASection() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="cta">
      <motion.div className="max-w-5xl mx-auto" {...FADE_UP}>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Ready to Explore?
          </h2>
          <p className="text-muted-foreground">
            Track your portfolio, explore protocols, and analyze the Aptos ecosystem
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <CTACard
            icon={Wallet}
            title="Track Your Portfolio"
            description="Monitor holdings, track performance, and discover opportunities"
            href="/tools/portfolio"
          />
          <CTACard
            icon={BarChart3}
            title="Explore DeFi Protocols"
            description="Browse all DeFi protocols with TVL, categories, and analytics"
            href="/protocols/defi"
          />
        </div>

        {/* Secondary CTAs */}
        <div className="grid sm:grid-cols-3 gap-4">
          <CTACard
            icon={Coins}
            title="Market Analytics"
            description="Stablecoins, RWAs, Bitcoin, and token data"
            href="/markets/stables"
            variant="secondary"
          />
          <CTACard
            icon={TrendingUp}
            title="Yield Opportunities"
            description="Find the best APY across protocols"
            href="/protocols/yields"
            variant="secondary"
          />
          <CTACard
            icon={Gauge}
            title="Chain Performance"
            description="Compare Aptos vs other blockchains"
            href="/performance"
            variant="secondary"
          />
        </div>
      </motion.div>
    </Section>
  );
}
