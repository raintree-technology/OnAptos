"use client";

import Image from "next/image";
import type React from "react";
import { memo, useEffect, useState } from "react";

import { useTranslation } from "@/lib/hooks/useTranslation";
import { dedupeFetch } from "@/lib/utils/cache/request-deduplication";

export const AptPrice = memo(function AptPrice() {
  const { t } = useTranslation("common");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const currentResponse = await dedupeFetch(
          "/api/unified/prices?tokens=0x1::aptos_coin::AptosCoin"
        );
        if (!currentResponse.ok) return;

        const currentData = await currentResponse.json();
        if (currentData.prices?.["0x1::aptos_coin::AptosCoin"]) {
          setCurrentPrice(currentData.prices["0x1::aptos_coin::AptosCoin"]);
        }
      } catch {
        // Silent fail - show unavailable state
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.src = "/placeholder.jpg";
  };

  if (loading || currentPrice === null) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-xs sm:text-sm text-muted-foreground">
        <Image
          src="/icons/apt.png"
          alt="APT token"
          width={16}
          height={16}
          className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0 rounded-full dark:invert opacity-50"
          onError={handleImageError}
        />
        <span className="truncate">
          {loading
            ? t("messages.apt_price_loading", "Loading...")
            : t("messages.apt_price_unavailable", "Unavailable")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-xs sm:text-sm">
      <Image
        src="/icons/apt.png"
        alt="APT token"
        width={16}
        height={16}
        className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0 rounded-full dark:invert"
        onError={handleImageError}
      />
      <span className="font-medium whitespace-nowrap text-muted-foreground">
        ${currentPrice.toFixed(2)}
      </span>
    </div>
  );
});
