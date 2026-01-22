"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FADE_UP, FADE_UP_DELAYED } from "@/lib/constants/animations";
import { YieldTable } from "@/components/pages/tools/portfolio/YieldTable";
import { Button } from "@/components/ui/button";
import { Section } from "../shared/Section";

export default function YieldSection() {
  return (
    <Section id="yield" className="bg-muted/30">
      <motion.div className="flex items-center justify-between mb-8" {...FADE_UP}>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            Top Yield Opportunities
          </h2>
          <p className="text-sm text-muted-foreground">
            Highest APY pools across Aptos DeFi protocols
          </p>
        </div>
        <Link href="/protocols/yields">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div {...FADE_UP_DELAYED(0.1)}>
        <Suspense
          fallback={
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          }
        >
          <YieldTable limit={10} compact={true} />
        </Suspense>
      </motion.div>
    </Section>
  );
}
