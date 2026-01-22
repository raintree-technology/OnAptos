"use client";

import { usePathname } from "next/navigation";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();

  const isPortfolioPage = pathname === "/tools/portfolio";
  const isMetricsPage = pathname === "/metrics";
  const showHeaderAndFooter = !isMetricsPage;

  // Use h-screen for portfolio to enforce single viewport
  const containerClass = isPortfolioPage
    ? "h-screen flex flex-col overflow-hidden"
    : "min-h-screen flex flex-col";

  return (
    <div className={containerClass}>
      {showHeaderAndFooter && <Header />}
      <main className={isPortfolioPage ? "flex-1 overflow-hidden" : "flex-1"}>{children}</main>
      {showHeaderAndFooter && <Footer />}
    </div>
  );
}
