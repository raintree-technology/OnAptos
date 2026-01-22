"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExchangeCardProps {
  logo?: string;
  name: string;
  region: "US" | "KR" | "Global";
  usdt?: "Y" | "N" | "";
  usdc?: "Y" | "N" | "";
  link?: string;
  className?: string;
}

export default function ExchangeCard({
  logo,
  name,
  region,
  usdt,
  usdc,
  link,
  className,
}: ExchangeCardProps) {
  const getRegionLabel = () => {
    if (region === "US") return "US";
    if (region === "KR") return "Korea";
    return "Global";
  };

  const cardContent = (
    <div
      className={cn(
        "group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full",
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <Badge variant="outline" className="text-xs">
          {getRegionLabel()}
        </Badge>

        {logo ? (
          <div className="w-12 h-12 rounded-lg bg-muted p-2 flex items-center justify-center">
            <img src={logo} alt={name} className="w-full h-full object-contain rounded-full" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <Globe className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <h3 className="font-medium text-foreground">{name}</h3>

        <div className="flex gap-1.5 justify-center items-center">
          <img src="/icons/apt.png" alt="APT" className="w-5 h-5 rounded-full dark:invert" />
          {usdt === "Y" && (
            <img src="/icons/stables/usdt.png" alt="USDT" className="w-5 h-5 rounded-full" />
          )}
          {usdc === "Y" && (
            <img src="/icons/stables/usdc.png" alt="USDC" className="w-5 h-5 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      {cardContent}
    </Link>
  ) : (
    <div>{cardContent}</div>
  );
}
