"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { defiProtocols } from "@/components/pages/protocols/defi/data/protocols";
import { ProtocolStats } from "@/components/protocols/ProtocolStats";
import { FADE_UP } from "@/lib/constants/animations";
import { ExpandToggle } from "../shared/ExpandToggle";
import ProtocolCard from "../shared/ProtocolCard";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";

export default function DefiSection() {
  const [showAllTrading, setShowAllTrading] = useState(false);
  const [showAllLending, setShowAllLending] = useState(false);
  const [showAllYield, setShowAllYield] = useState(false);

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="defi">
      <SectionHeader
        title="Explore DeFi Protocols"
        description="Trade, lend, borrow, and earn yield"
      />

      <motion.div className="mb-16" {...FADE_UP}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Trading & DEXs</h3>
            <p className="text-sm text-muted-foreground mt-1">Swap, provide liquidity, and trade</p>
          </div>
          <ExpandToggle
            expanded={showAllTrading}
            onToggle={() => setShowAllTrading(!showAllTrading)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defiProtocols
            .filter((p) => p.category === "Trading" || p.category === "Multiple")
            .slice(0, showAllTrading ? undefined : 6)
            .map((protocol, idx) => (
              <ProtocolCard
                key={`trading-${protocol.title}-${idx}`}
                logo={protocol.logo}
                name={protocol.title}
                category={protocol.subcategory}
                href={protocol.href}
              >
                <ProtocolStats protocolName={protocol.title} showVolume={true} />
              </ProtocolCard>
            ))}
        </div>
      </motion.div>

      {/* Credit Protocols */}
      <motion.div className="mb-16" {...FADE_UP}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Lending & Borrowing</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Supply assets to earn interest or borrow against collateral
            </p>
          </div>
          <ExpandToggle
            expanded={showAllLending}
            onToggle={() => setShowAllLending(!showAllLending)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defiProtocols
            .filter((p) => p.category === "Credit")
            .slice(0, showAllLending ? undefined : 3)
            .map((protocol, idx) => (
              <ProtocolCard
                key={`credit-${protocol.title}-${idx}`}
                logo={protocol.logo}
                name={protocol.title}
                category={protocol.subcategory}
                href={protocol.href}
                statsPosition="inline"
              >
                <ProtocolStats protocolName={protocol.title} showVolume={false} inline={true} />
              </ProtocolCard>
            ))}
        </div>
      </motion.div>

      {/* Yield Protocols */}
      <motion.div {...FADE_UP}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Yield & Staking</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Auto-compounding vaults, liquid staking, and optimized strategies
            </p>
          </div>
          <ExpandToggle expanded={showAllYield} onToggle={() => setShowAllYield(!showAllYield)} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defiProtocols
            .filter((p) => p.category === "Yield")
            .slice(0, showAllYield ? undefined : 3)
            .map((protocol, idx) => (
              <ProtocolCard
                key={`yield-${protocol.title}-${idx}`}
                logo={protocol.logo}
                name={protocol.title}
                category={protocol.subcategory}
                href={protocol.href}
                statsPosition="inline"
              >
                <ProtocolStats protocolName={protocol.title} showVolume={false} inline={true} />
              </ProtocolCard>
            ))}
        </div>
      </motion.div>
    </Section>
  );
}
