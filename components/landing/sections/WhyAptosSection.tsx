"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Layers, Shield, TrendingUp, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import USDTCostChart from "@/app/performance/usdt-comparison/USDTCostChart";
import { usdtCostData } from "@/components/landing/data/landing-data";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { FADE_UP } from "@/lib/constants/animations";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";

const bentoFeatures = [
  {
    Icon: Zap,
    name: "Lightning Fast",
    description: "20k+ TPS with sub-second finality — 6,000x faster than Ethereum",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Zap className="h-[300px] w-[300px] -rotate-12" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: Shield,
    name: "Secure by Design",
    description: "Move language with fair ordering prevents common vulnerabilities",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Shield className="h-[200px] w-[200px] rotate-6" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: Code,
    name: "Low, Fixed Network Fees",
    description: "Fixed fees priced in USD, paid in APT — up to 40,000x cheaper than other chains",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Code className="h-[200px] w-[200px] -rotate-6" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: TrendingUp,
    name: "Massively Scalable",
    description: "Parallel execution engine processes thousands of transactions simultaneously",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <TrendingUp className="h-[300px] w-[300px] rotate-12" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: Layers,
    name: "Modular & Composable",
    description: "Flexible architecture for DeFi, gaming, and enterprise solutions",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Layers className="h-[200px] w-[200px] rotate-3" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: Users,
    name: "Thriving Community",
    description: "Thousands of builders, investors, and developers worldwide",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Users className="h-[200px] w-[200px] -rotate-3" strokeWidth={0.5} />
      </div>
    ),
  },
  {
    Icon: Code,
    name: "Developer Friendly",
    description: "Ship in days with Move, comprehensive SDKs, and extensive documentation",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <Code className="h-[200px] w-[200px] rotate-6" strokeWidth={0.5} />
      </div>
    ),
  },
];

export default function WhyAptosSection() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="why-aptos">
      <SectionHeader
        title="Why Aptos?"
        description="Fast, secure, and scalable blockchain infrastructure"
      />

      <motion.div className="mb-20" {...FADE_UP}>
        <BentoGrid className="auto-rows-[18rem] md:auto-rows-[20rem]">
          {bentoFeatures.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </motion.div>

      {/* Network Performance Stats */}
      <motion.div className="border-t border-border pt-16 mb-20" {...FADE_UP}>
        <p className="text-sm text-muted-foreground text-center mb-10 uppercase tracking-wider">
          Network Performance
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground font-mono mb-2">
              22k
            </p>
            <p className="text-sm text-muted-foreground">Max TPS</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground font-mono mb-2">
              &lt;1s
            </p>
            <p className="text-sm text-muted-foreground">Finality</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground font-mono mb-2">
              0.11s
            </p>
            <p className="text-sm text-muted-foreground">Block Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground font-mono mb-2">
              19
            </p>
            <p className="text-sm text-muted-foreground">Nakamoto Coefficient</p>
          </div>
        </div>
      </motion.div>

      {/* USDT Transfer Costs */}
      <motion.div {...FADE_UP}>
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Lowest USDt Transfer Costs
          </h3>
          <p className="text-muted-foreground">Up to 40,000x cheaper than other chains</p>
        </div>

        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading chart...
              </div>
            }
          >
            <USDTCostChart data={usdtCostData} />
          </Suspense>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/performance"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View detailed performance comparison
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Chain Comparison */}
      <motion.div className="mt-20" {...FADE_UP}>
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
          Chain Performance Comparison
        </h3>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Chain</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Max TPS (100 blocks)
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Max TPS (1 block)
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Finality
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Block Time
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Nakamoto
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                  Validators
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/30">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/icons/apt.png"
                      alt="Aptos"
                      width={24}
                      height={24}
                      className="dark:invert"
                    />
                    <span className="font-medium text-foreground">Aptos</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4 font-mono text-foreground">12.9k</td>
                <td className="text-center py-4 px-4 font-mono text-foreground">22k</td>
                <td className="text-center py-4 px-4 font-mono text-foreground">&lt;1s</td>
                <td className="text-center py-4 px-4 font-mono text-foreground">0.11s</td>
                <td className="text-center py-4 px-4 font-mono text-foreground">19</td>
                <td className="text-center py-4 px-4 font-mono text-foreground">151</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Image src="/icons/performance/sui.png" alt="Sui" width={24} height={24} />
                    <span className="font-medium text-foreground">Sui</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">926</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">11.5k</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">&lt;1s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">0.25s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">18</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">121</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Image src="/icons/performance/trx.png" alt="TRON" width={24} height={24} />
                    <span className="font-medium text-foreground">TRON</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">272</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">734</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">57s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">3s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">5</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">27</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Image src="/icons/performance/base.png" alt="Base" width={24} height={24} />
                    <span className="font-medium text-foreground">Base</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">1.3k</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">1.9k</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">13m13s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">2s</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">1</td>
                <td className="text-center py-4 px-4 font-mono text-muted-foreground">1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/performance"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Compare with more chains
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}
