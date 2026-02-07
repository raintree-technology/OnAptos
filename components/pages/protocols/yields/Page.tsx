"use client";

import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ProtocolPageHeader } from "@/components/pages/protocols/shared";
import { YieldTable } from "@/components/pages/tools/portfolio/YieldTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Featured yield protocols to show when data is empty
const featuredYieldProtocols = [
  {
    name: "Amnis Finance",
    description: "Liquid staking with auto-compounding yields",
    href: "https://amnis.finance",
    apy: "~7-9%",
    type: "Liquid Staking",
  },
  {
    name: "Thala Labs",
    description: "DEX liquidity pools and stablecoin yields",
    href: "https://thala.fi",
    apy: "Variable",
    type: "DEX & Stablecoin",
  },
  {
    name: "Aries Markets",
    description: "Lending and borrowing with competitive rates",
    href: "https://ariesmarkets.xyz",
    apy: "Variable",
    type: "Lending",
  },
  {
    name: "Echelon",
    description: "Money markets for Aptos assets",
    href: "https://echelon.market",
    apy: "Variable",
    type: "Lending",
  },
];

function YieldsContent() {
  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet") || undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 flex-1 relative overflow-hidden">
        {/* Protocol Page Header with breadcrumbs and tabs */}
        <ProtocolPageHeader
          title="Yield Opportunities"
          description="Discover yield-generating opportunities across Aptos DeFi protocols. Staking, lending, and liquidity provision."
        />

        {/* Yield Table */}
        <YieldTable walletAddress={walletAddress} />

        {/* Fallback content when yield data may be limited */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Popular Yield Protocols</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Explore these popular protocols for yield opportunities on Aptos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredYieldProtocols.map((protocol) => (
              <Card
                key={protocol.name}
                className="group hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{protocol.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {protocol.apy}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {protocol.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {protocol.type}
                    </span>
                    <a
                      href={protocol.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/protocols/defi">
              <Button variant="outline" className="gap-2">
                Explore All DeFi Protocols
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function YieldsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 flex-1 relative">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 dark:bg-gray-800 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      }
    >
      <YieldsContent />
    </Suspense>
  );
}
