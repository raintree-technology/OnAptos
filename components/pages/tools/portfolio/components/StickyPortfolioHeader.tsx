"use client";

import { ArrowLeftRight, ChevronLeft, ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyPortfolioHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarView?: "assets" | "nfts";
  onSidebarViewChange?: (view: "assets" | "nfts") => void;
  portfolioMetrics?: {
    totalPortfolioValue?: number;
    totalAssets?: number;
    totalNFTs?: number;
    totalDeFiValue?: number;
  };
}

const portfolioTabs = [
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "transactions", label: "Activity", icon: ArrowLeftRight },
  { id: "yield", label: "Yield", icon: TrendingUp },
];

export function StickyPortfolioHeader({ activeTab, onTabChange }: StickyPortfolioHeaderProps) {
  const currentIndex = portfolioTabs.findIndex((t) => t.id === activeTab);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < portfolioTabs.length - 1;

  const goToPrevious = () => {
    if (canGoPrevious) {
      onTabChange(portfolioTabs[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      onTabChange(portfolioTabs[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevious}
        disabled={!canGoPrevious}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {portfolioTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "h-8 px-2 sm:px-3 gap-1.5",
                activeTab === tab.id && "pointer-events-none"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNext}
        disabled={!canGoNext}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
