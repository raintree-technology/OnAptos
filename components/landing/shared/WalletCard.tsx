"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  logo: string;
  name: string;
  description: string;
  href: string;
  recommended?: boolean;
  invertLogoInDarkMode?: boolean;
  className?: string;
}

export default function WalletCard({
  logo,
  name,
  description,
  href,
  recommended = false,
  invertLogoInDarkMode = false,
  className,
}: WalletCardProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <div
        className={cn(
          "group relative p-5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full",
          className
        )}
      >
        {recommended && (
          <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
            Recommended
          </Badge>
        )}

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-xl bg-muted p-2.5 flex items-center justify-center">
            <img
              src={logo}
              alt={name}
              className={cn(
                "w-full h-full object-contain rounded-full",
                invertLogoInDarkMode && "dark:invert"
              )}
            />
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
