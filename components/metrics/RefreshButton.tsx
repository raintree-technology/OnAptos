"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    // Reset after minimum feedback time
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 rounded-lg
        bg-gradient-to-r from-[#F4603E] to-[#1E1870]
        hover:from-[#F4603E]/90 hover:to-[#1E1870]/90
        text-white
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md"
      aria-label={isRefreshing ? "Refreshing..." : "Refresh Data"}
    >
      <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  );
}
