import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/30 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
        success:
          "text-green-700 dark:text-green-400 bg-green-500/10 border-green-500/30 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 *:data-[slot=alert-description]:text-green-700/90 dark:*:data-[slot=alert-description]:text-green-400/90",
        warning:
          "text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 *:data-[slot=alert-description]:text-yellow-700/90 dark:*:data-[slot=alert-description]:text-yellow-400/90",
        info: "text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 *:data-[slot=alert-description]:text-blue-700/90 dark:*:data-[slot=alert-description]:text-blue-400/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
