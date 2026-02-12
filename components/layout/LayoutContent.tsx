"use client";

import { usePathname } from "next/navigation";

import { MinimalNav } from "@/components/shared/MinimalNav";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();

  const isPortfolioPage = pathname === "/tools/portfolio";
  const isMetricsPage = pathname === "/metrics";
  const showFullHeader = !isMetricsPage && !isPortfolioPage;
  const showMinimalNav = isMetricsPage || isPortfolioPage;

  // Use h-screen for portfolio to enforce single viewport
  const containerClass = isPortfolioPage
    ? "h-screen flex flex-col overflow-hidden"
    : "min-h-screen flex flex-col";

  return (
    <div className={containerClass}>
      {showFullHeader && <Header />}
      {showMinimalNav && (
        <MinimalNav
          currentPage={isMetricsPage ? "Network Metrics" : "Portfolio"}
          parentHref={isMetricsPage ? undefined : "/tools/portfolio"}
          parentLabel={isMetricsPage ? undefined : undefined}
        />
      )}
      <main className={isPortfolioPage ? "flex-1 overflow-hidden" : "flex-1"}>{children}</main>
      {showFullHeader && <Footer />}
    </div>
  );
}
