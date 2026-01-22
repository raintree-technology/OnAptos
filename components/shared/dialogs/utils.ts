import { toast } from "sonner";

import { copyToClipboard as baseCopyToClipboard } from "@/lib/utils/browser/clipboard";

/**
 * Copy text to clipboard with toast notification
 */
export const copyToClipboard = async (
  text: string,
  label?: string,
  showToast = true
): Promise<void> => {
  const success = await baseCopyToClipboard(text, label);
  if (showToast && !success) {
    toast.error("Failed to copy to clipboard");
  }
};

/**
 * Truncate address for display
 */
export const truncateAddress = (address: string, startLength = 8, endLength = 8): string => {
  if (!address) return "";
  if (address.length <= startLength + endLength + 3) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Format token name with bridged label if applicable
 */
export const formatTokenName = (
  name: string,
  context?: {
    protocol?: string;
    standards?: string;
    isBridged?: boolean;
    t?: (key: string, fallback?: string) => string;
  }
): string => {
  if (!context) return name;
  const { protocol, standards, isBridged, t } = context;
  if (isBridged || (protocol === "ondo" && standards === "ERC-20")) {
    const bridgedLabel = t?.("common:labels.bridged", "bridged") || "bridged";
    return `${name} (${bridgedLabel})`;
  }
  return name;
};

/**
 * Format text with fallback and title case
 */
export const formatDisplayText = (
  text: string | undefined | null,
  fallback = "Not Specified"
): string => {
  if (!text || text.toLowerCase() === "unknown" || text.toLowerCase() === "null") {
    return fallback;
  }
  return text
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Check if field has valid data
 */
export const hasValidData = (text: string | undefined | null): boolean => {
  return !(
    !text ||
    text.toLowerCase() === "unknown" ||
    text.toLowerCase() === "null" ||
    text.trim() === ""
  );
};

/**
 * Get explorer URL for address
 */
export const getExplorerUrl = (address: string, network = "mainnet"): string => {
  return `https://explorer.aptoslabs.com/account/${address}?network=${network}`;
};

/**
 * Create copy handler with toast
 */
export const createCopyHandler = (showToast = true) => {
  return (text: string, label?: string) => {
    copyToClipboard(text, label, showToast);
  };
};
