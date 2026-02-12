/**
 * Protocol Registry - Temporary compatibility layer
 * This file will be deprecated. Use @/lib/protocols instead.
 */

// Re-export protocol types from new system for backward compatibility
export { ProtocolType } from "@/lib/protocols/types";

/**
 * DeFi Protocol Name Mappings
 * Maps common protocol name variations to canonical names for better matching
 */
export const DEFI_PROTOCOL_NAME_MAPPINGS: Record<string, string> = {
  // Thala variations
  thala: "Thala",
  "thala finance": "Thala",
  "thala farm": "Thala",

  // Liquid staking variations
  amnis: "Amnis",
  "amnis finance": "Amnis",

  // Aggregator variations
  panora: "Panora",
  "panora exchange": "Panora",
} as const;

/**
 * Utility function to normalize protocol names for better matching
 */
export const normalizeProtocolName = (protocolName: string): string => {
  const normalized = protocolName.toLowerCase().trim();
  return DEFI_PROTOCOL_NAME_MAPPINGS[normalized] || protocolName;
};
