"use client";

import { motion } from "framer-motion";
import { TrendingUp, Wallet } from "lucide-react";
import { FADE_UP } from "@/lib/constants/animations";
import CTACard from "../shared/CTACard";
import { Section } from "../shared/Section";

export default function CTASection() {
  return (
    <Section id="cta">
      <motion.div className="max-w-4xl mx-auto" {...FADE_UP}>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Ready to Explore?
          </h2>
          <p className="text-muted-foreground">
            Track your portfolio or discover yield opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <CTACard
            icon={Wallet}
            title="Track Your Portfolio"
            description="Monitor holdings, track performance, discover opportunities"
            href="/portfolio"
          />
          <CTACard
            icon={TrendingUp}
            title="Explore Yield Opportunities"
            description="Find highest APY pools across DeFi protocols"
            href="/protocols/yields"
          />
        </div>
      </motion.div>
    </Section>
  );
}
