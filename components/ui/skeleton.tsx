import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

/** Pre-built skeleton for text lines */
function SkeletonText({
  lines = 1,
  className,
  ...props
}: React.ComponentProps<"div"> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Pre-built skeleton for cards */
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card p-6 space-y-4", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

/** Pre-built skeleton for table rows */
function SkeletonTableRow({
  columns = 4,
  className,
  ...props
}: React.ComponentProps<"div"> & { columns?: number }) {
  return (
    <div
      className={cn("flex items-center gap-4 py-4 border-b border-border", className)}
      {...props}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-1/4" : i === columns - 1 ? "w-16" : "flex-1")}
        />
      ))}
    </div>
  );
}

/** Pre-built skeleton for metric/stat displays */
function SkeletonMetric({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTableRow, SkeletonMetric };
