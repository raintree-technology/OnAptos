"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProtocolCardProps {
  logo: string;
  name: string;
  category: string;
  href?: string;
  badge?: string;
  stats?: {
    label: string;
    value: string;
  }[];
  children?: ReactNode;
  statsPosition?: "below" | "inline";
  className?: string;
}

export default function ProtocolCard({
  logo,
  name,
  category,
  href,
  badge,
  stats,
  children,
  statsPosition = "below",
  className,
}: ProtocolCardProps) {
  const cardContent = (
    <div
      className={cn(
        "group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full",
        className
      )}
    >
      {statsPosition === "below" ? (
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted p-1.5 flex items-center justify-center flex-shrink-0">
              <img src={logo} alt={name} className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="font-medium text-foreground truncate">{name}</p>
                {badge && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{category}</p>
              {stats && stats.length > 0 && (
                <div className="mt-2 space-y-1">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-mono text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {children}
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted p-1.5 flex items-center justify-center flex-shrink-0">
            <img src={logo} alt={name} className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground mb-0.5 truncate">{name}</p>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <div className="flex flex-col items-end justify-center">{children}</div>
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
