import { Skeleton, SkeletonCard, SkeletonMetric } from "@/components/ui/skeleton";

export function MarketPageSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 space-y-6 max-w-[1920px] mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="w-full h-96 animate-pulse bg-muted/20 rounded-lg" />;
}
