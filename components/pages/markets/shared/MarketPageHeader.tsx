"use client";

import { Bitcoin, Building2, ChevronRight, Coins, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MarketPageHeaderProps {
  title: string;
  description: string;
  totalValue?: string;
  totalLabel?: string;
}

const marketPages = [
  {
    href: "/markets/stables",
    label: "Stablecoins",
    icon: Coins,
    shortLabel: "Stables",
  },
  {
    href: "/markets/bitcoin",
    label: "Bitcoin",
    icon: Bitcoin,
    shortLabel: "Bitcoin",
  },
  {
    href: "/markets/rwas",
    label: "Real-World Assets",
    icon: Building2,
    shortLabel: "RWAs",
  },
  {
    href: "/markets/tokens",
    label: "Tokens",
    icon: Coins,
    shortLabel: "Tokens",
  },
];

export function MarketPageHeader({
  title,
  description,
  totalValue,
  totalLabel = "Total Value",
}: MarketPageHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Markets</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">{description}</p>
        </div>
        {totalValue && (
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {totalLabel}
            </p>
            <p className="text-xl sm:text-2xl font-bold font-mono">{totalValue}</p>
          </div>
        )}
      </div>

      {/* Market Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {marketPages.map((page) => {
            const isActive = pathname === page.href;
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors
                  ${
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{page.label}</span>
                <span className="sm:hidden">{page.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default MarketPageHeader;
