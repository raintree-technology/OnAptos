/**
 * Export all protocol definitions
 */

import type { ProtocolDefinition } from "../types";

// Import all protocol definitions
import { AmnisProtocol } from "./amnis";
import { ThalaProtocol } from "./thala";
import { ThalaLSDProtocol } from "./thala-lsd";

/**
 * Get all protocol definitions
 */
export function getAllProtocols(): ProtocolDefinition[] {
  return [
    // DEX Protocols
    ThalaProtocol,

    // Liquid Staking Protocols
    AmnisProtocol,
    ThalaLSDProtocol,
  ];
}
