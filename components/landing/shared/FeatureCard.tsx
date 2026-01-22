"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string | ReactNode;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "h-full p-5 md:p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
