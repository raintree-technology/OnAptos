/**
 * Application configuration
 * Centralizes all environment-dependent settings
 */

import { env, isDevelopment, isProduction } from "./validate-env";
import { siteConfig, developerConfig } from "./site";

export const APP_CONFIG = {
  // Site configuration
  siteUrl: env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  appName: siteConfig.name,
  siteDescription: siteConfig.description,

  // CORS configuration
  corsOrigins: process.env.NEXT_PUBLIC_CORS_ORIGINS?.split(",") || ["http://localhost:3000"],

  // Port configuration
  port: process.env.PORT || process.env.DEV_PORT || "3000",

  // Development settings
  isDevelopment: isDevelopment,
  isProduction: isProduction,
} as const;

// Re-export developer config with flattened structure for backward compatibility
export const DEVELOPER_CONFIG = {
  name: developerConfig.name,
  email: developerConfig.email,
  website: developerConfig.website,
  twitter: developerConfig.social.twitter,
  twitterHandle: developerConfig.social.twitterHandle,
  github: developerConfig.social.github,
  linkedin: developerConfig.social.linkedin,
} as const;

// Re-export site configs for direct access
export { siteConfig, developerConfig };

export const API_CONFIG = {
  // RWA API
  rwa: {
    baseUrl: process.env.RWA_API_BASE_URL || "https://api.rwa.xyz/v4/assets",
    apiKey: env.RWA_API_KEY || "",
  },

  // CoinMarketCap API
  cmc: {
    baseUrl: process.env.CMC_API_BASE_URL || "https://pro-api.coinmarketcap.com/v1",
    apiKey: env.CMC_API_KEY || "",
  },

  // Other APIs
  panora: {
    baseUrl: "https://api.panora.exchange",
  },

  llama: {
    baseUrl: "https://api.llama.fi",
  },
} as const;

// Validation is now handled by validate-env.ts
// This function is kept for backward compatibility but will use the new validation
export function validateConfig() {
  // Validation is performed on import through validate-env.ts
  // If we reach this point, all required env vars are already validated
}
