"use client";

import type React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Simple NFT Grid Skeleton (no text)
export const SimpleNFTGridSkeleton: React.FC<{
  count?: number;
  columns?: number;
  className?: string;
}> = ({ count = 9, columns = 3, className = "" }) => {
  const gridClass = `grid gap-4 ${
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : `grid-cols-${columns}`
  }`;

  return (
    <div className={`${gridClass} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
};

// Wallet Summary Skeleton
export const WalletSummarySkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Card className={className}>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-6 w-32" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      {/* Chart */}
      <Skeleton className="h-64" />
      {/* Legend */}
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    </CardContent>
  </Card>
);

// NFT Treemap Skeleton
export const NFTTreemapSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {/* Header with title and stats */}
    <div className="flex items-baseline gap-2 mb-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>

    {/* Treemap container */}
    <div className="h-52 sm:h-64 w-full bg-neutral-50 dark:bg-neutral-900/50 rounded-lg overflow-hidden p-4">
      {/* Simulated treemap rectangles */}
      <div className="h-full w-full flex gap-1">
        {/* Large rectangle */}
        <div className="flex flex-col gap-1 flex-1">
          <Skeleton className="h-3/5 w-full rounded-sm" />
          <div className="flex gap-1 h-2/5">
            <Skeleton className="h-full flex-1 rounded-sm" />
            <Skeleton className="h-full flex-1 rounded-sm" />
          </div>
        </div>

        {/* Medium rectangles */}
        <div className="flex flex-col gap-1 w-1/3">
          <Skeleton className="h-2/5 w-full rounded-sm" />
          <div className="flex gap-1 h-1/5">
            <Skeleton className="h-full flex-1 rounded-sm" />
            <Skeleton className="h-full flex-1 rounded-sm" />
          </div>
          <Skeleton className="h-2/5 w-full rounded-sm" />
        </div>

        {/* Small rectangles */}
        <div className="flex flex-col gap-1 w-1/5">
          <Skeleton className="h-1/4 w-full rounded-sm" />
          <Skeleton className="h-1/6 w-full rounded-sm" />
          <Skeleton className="h-1/4 w-full rounded-sm" />
          <Skeleton className="h-1/6 w-full rounded-sm" />
          <Skeleton className="h-1/6 w-full rounded-sm" />
        </div>
      </div>
    </div>
  </div>
);

// Full Portfolio Page Skeleton
export const FullPortfolioPageSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background gradient - fixed to viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none z-0" />

      <main className="container-layout py-6 flex-1 relative">
        {/* Mobile: Show portfolio value at top */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Desktop layout - 5 column grid like actual page */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Selector Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>

            {/* Filter Button */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-40" />
            </div>

            {/* Assets/NFTs/DeFi Table Skeleton */}
            <div className="bg-card border rounded-lg p-4">
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <Skeleton className="h-10 w-full" />

            {/* Performance Chart */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>

            {/* Gas Usage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Asset Allocation Chart */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>

        {/* Mobile layout with integrated tabs */}
        <div className="lg:hidden space-y-6">
          {/* Mobile tabs */}
          <div className="w-full">
            <div className="flex justify-between items-end w-full border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-start gap-8">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>

          {/* Mobile content skeleton */}
          <div className="space-y-6">
            {/* Chart skeleton */}
            <Skeleton className="h-[200px] w-full" />

            {/* Table skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Generic Loading Component dispatcher (only used with "wallet-summary" variant)
export const LoadingSkeleton: React.FC<{
  variant: "wallet-summary";
  className?: string;
}> = ({ variant, className }) => {
  if (variant === "wallet-summary") {
    return <WalletSummarySkeleton className={className} />;
  }
  return <Skeleton className={className} />;
};
