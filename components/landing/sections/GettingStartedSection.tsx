"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FADE_UP } from "@/lib/constants/animations";
import { bridges, exchanges, wallets } from "@/components/landing/data/landing-data";
import { Badge } from "@/components/ui/badge";
import ExchangeCard from "../shared/ExchangeCard";
import { ExpandToggle } from "../shared/ExpandToggle";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";
import WalletCard from "../shared/WalletCard";

export default function GettingStartedSection() {
  const [showAllExchanges, setShowAllExchanges] = useState(false);
  const [showAllBridges, setShowAllBridges] = useState(false);

  const aptosExchanges = useMemo(() => exchanges.filter((ex) => ex.chain === "Aptos"), []);
  const liveBridges = useMemo(() => bridges.filter((b) => b.status === "Live"), []);

  return (
    <Section id="getting-started">
      <SectionHeader
        title="Getting Started"
        description="Set up your wallet, acquire APT, and explore the ecosystem"
      />

      <motion.div className="mb-16" {...FADE_UP}>
        <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
          Choose Your Wallet
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Install a wallet to manage assets and connect to dApps
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {wallets.map((wallet, index) => (
            <WalletCard
              key={index}
              logo={wallet.logo}
              name={wallet.name}
              description={wallet.description}
              href={wallet.href}
              recommended={index === 0}
              invertLogoInDarkMode={wallet.name === "Aptos Connect"}
            />
          ))}
        </div>

        {/* Quick Setup Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
              <img src="/icons/petra.webp" alt="Petra" className="w-8 h-8 rounded-full" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">1. Install Wallet</p>
            <p className="text-xs text-muted-foreground">Download Petra extension</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
              <Image
                src="/icons/apt.png"
                alt="APT"
                width={32}
                height={32}
                className="dark:invert"
              />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">2. Get APT</p>
            <p className="text-xs text-muted-foreground">Buy on an exchange</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
              <img src="/ans.webp" alt="ANS" className="w-8 h-8 rounded-full" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">3. Claim .apt Name</p>
            <p className="text-xs text-muted-foreground">
              <a
                href="https://www.aptosnames.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Register on Aptos Names
              </a>
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">4. Explore DeFi</p>
            <p className="text-xs text-muted-foreground">Start trading and earning</p>
          </div>
        </div>
      </motion.div>

      {/* Exchanges */}
      <motion.div className="mb-16" {...FADE_UP}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Buy APT on Exchanges</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Trade Aptos tokens on leading exchanges
            </p>
          </div>
          <ExpandToggle
            expanded={showAllExchanges}
            onToggle={() => setShowAllExchanges(!showAllExchanges)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {aptosExchanges.slice(0, showAllExchanges ? undefined : 4).map((exchange, index) => (
            <ExchangeCard
              key={index}
              logo={exchange.logo}
              name={exchange.name}
              region={exchange.region}
              usdt={exchange.usdt}
              usdc={exchange.usdc}
              link={exchange.link}
            />
          ))}
        </div>
      </motion.div>

      {/* Bridges */}
      <motion.div {...FADE_UP}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Bridge Assets to Aptos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Transfer from Ethereum, Solana, and more
            </p>
          </div>
          <ExpandToggle
            expanded={showAllBridges}
            onToggle={() => setShowAllBridges(!showAllBridges)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveBridges.slice(0, showAllBridges ? undefined : 3).map((bridge, index) => (
            <Link key={index} href={bridge.href} target="_blank" rel="noopener noreferrer">
              <div className="group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-muted p-1.5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={bridge.logo}
                      alt={bridge.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground">{bridge.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {bridge.protocol}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Time</p>
                    <p className="text-sm font-mono text-foreground">{bridge.bridgeTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Fees</p>
                    <p className="text-sm font-mono text-foreground">{bridge.fees}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Networks</p>
                    <p className="text-sm font-mono text-foreground">{bridge.networks}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {bridge.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
