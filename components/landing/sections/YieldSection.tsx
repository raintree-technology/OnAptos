"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FADE_UP, FADE_UP_DELAYED } from "@/lib/constants/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "../shared/Section";

// Featured yield protocols
const featuredYieldProtocols = [
  {
    name: "Amnis Finance",
    description: "Liquid staking with auto-compounding yields on APT",
    href: "https://amnis.finance",
    apy: "~7-9%",
    type: "Liquid Staking",
    logo: "/icons/protocols/amnis.avif",
  },
  {
    name: "Thala Labs",
    description: "DEX liquidity pools and MOD stablecoin yields",
    href: "https://thala.fi",
    apy: "Variable",
    type: "DEX & Stablecoin",
    logo: "/icons/protocols/thala.avif",
  },
  {
    name: "Aries Markets",
    description: "Lending and borrowing with competitive rates",
    href: "https://ariesmarkets.xyz",
    apy: "Variable",
    type: "Lending",
    logo: "/icons/protocols/aries.avif",
  },
  {
    name: "Echelon",
    description: "Money markets for lending and borrowing",
    href: "https://echelon.market",
    apy: "Variable",
    type: "Money Market",
    logo: "/icons/protocols/echelon.avif",
  },
  {
    name: "Joule Finance",
    description: "Lending protocol with isolated markets",
    href: "https://joule.finance",
    apy: "Variable",
    type: "Lending",
    logo: "/icons/protocols/joule.webp",
  },
  {
    name: "Merkle Trade",
    description: "Perpetual trading with LP yield opportunities",
    href: "https://merkle.trade",
    apy: "Variable",
    type: "Perpetuals",
    logo: "/icons/protocols/merkle.avif",
  },
];

export default function YieldSection() {
  return (
    <Section id="yields" className="bg-muted/30">
      <motion.div
        className="flex items-center justify-between mb-8"
        {...FADE_UP}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Yield Opportunities
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore yield-generating protocols across Aptos DeFi
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredYieldProtocols.map((protocol, index) => (
            <motion.div key={protocol.name} {...FADE_UP_DELAYED(0.05 * index)}>
              <a
                href={protocol.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="group hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={protocol.logo}
                          alt={protocol.name}
                          width={40}
                          height={40}
                          className="object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {protocol.name}
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                            {protocol.apy}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {protocol.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {protocol.type}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="mt-6 text-center" {...FADE_UP_DELAYED(0.3)}>
        <Link href="/protocols/lst">
          <Button variant="outline" className="gap-2">
            Explore Liquid Staking
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </Section>
  );
}
