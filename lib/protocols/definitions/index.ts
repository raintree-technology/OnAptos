/**
 * Protocol Definitions Index
 *
 * Each protocol is in its own file for:
 * - Better organization
 * - Easier maintenance
 * - Code splitting
 * - Lazy loading capability
 */

// Export all as array for bulk registration
export { getAllProtocols } from "./all";
// Liquid Staking Protocols
export { AmnisProtocol } from "./amnis";
// DEX Protocols
export { ThalaProtocol } from "./thala";
export { ThalaLSDProtocol } from "./thala-lsd";
