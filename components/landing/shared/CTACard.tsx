"use client";

import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTACardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export default function CTACard({ icon: Icon, title, description, href, className }: CTACardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "group p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1 flex items-center gap-2">
              {title}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
