"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTACardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function CTACard({
  icon: Icon,
  title,
  description,
  href,
  className,
  variant = "primary",
}: CTACardProps) {
  const isSecondary = variant === "secondary";

  return (
    <Link href={href}>
      <div
        className={cn(
          "group rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full",
          isSecondary ? "p-4" : "p-6",
          className
        )}
      >
        <div className={cn("flex items-start", isSecondary ? "gap-3" : "gap-4")}>
          <div
            className={cn(
              "rounded-lg bg-muted flex items-center justify-center flex-shrink-0",
              isSecondary ? "w-8 h-8" : "w-10 h-10"
            )}
          >
            <Icon className={cn("text-foreground", isSecondary ? "w-4 h-4" : "w-5 h-5")} />
          </div>
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium text-foreground flex items-center gap-2",
                isSecondary ? "text-sm mb-0.5" : "mb-1"
              )}
            >
              {title}
              <ArrowRight
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  isSecondary ? "w-3 h-3" : "w-4 h-4"
                )}
              />
            </h3>
            <p className={cn("text-muted-foreground", isSecondary ? "text-xs" : "text-sm")}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
