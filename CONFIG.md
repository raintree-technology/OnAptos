# Configuration Guide

This document explains the configuration system in On Aptos, designed for easy customization and OSS deployment.

## Overview

On Aptos uses a layered configuration approach:

1. **Environment Variables** (`.env`) - Runtime configuration and secrets
2. **Static Config Files** (`lib/config/`) - Application configuration with env defaults
3. **Constants** (`lib/constants/`) - Fixed values like addresses and protocol definitions

## Environment Variables

### Required Variables

These API keys are required for the application to function:

```env
# Price data from CoinMarketCap
CMC_API_KEY=your_cmc_key

# Real World Assets data
RWA_API_KEY=your_rwa_key
```

### Optional Variables

#### Site Configuration

```env
# Your deployment URL (default: http://localhost:3000)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Site name (default: On Aptos)
NEXT_PUBLIC_SITE_NAME=Your Site Name

# Site description (default: Aptos blockchain analytics and portfolio tracking)
NEXT_PUBLIC_SITE_DESCRIPTION=Your custom description
```

#### CORS Configuration

```env
# Comma-separated list of allowed origins
NEXT_PUBLIC_CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### Developer Attribution

These appear in SEO metadata, footer, and site credits:

```env
NEXT_PUBLIC_DEVELOPER_NAME=Your Name
NEXT_PUBLIC_DEVELOPER_EMAIL=your@email.com
NEXT_PUBLIC_DEVELOPER_WEBSITE=https://yoursite.com
NEXT_PUBLIC_DEVELOPER_TWITTER=https://x.com/yourhandle
NEXT_PUBLIC_DEVELOPER_TWITTER_HANDLE=yourhandle
NEXT_PUBLIC_DEVELOPER_GITHUB=https://github.com/yourusername/your-repo
NEXT_PUBLIC_DEVELOPER_LINKEDIN=https://linkedin.com/in/yourhandle
```

#### API Keys (Optional)

```env
# Aptos Indexer (for better rate limits)
APTOS_BUILD_SECRET=your_key

# Panora API (public key used by default if not set)
PANORA_API_KEY=your_key
```

#### Database (Optional)

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### Environment Settings

```env
# Environment (development, production, test)
NODE_ENV=development

# Logging level (debug, info, warn, error)
LOG_LEVEL=info
```

## Configuration Files

### Site Config (`lib/config/site.ts`)

Core site and developer configuration:

```typescript
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "On Aptos",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "...",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const developerConfig = {
  name: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "On Aptos",
  email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "hello@example.com",
  website: process.env.NEXT_PUBLIC_DEVELOPER_WEBSITE || "",
  social: {
    twitter: process.env.NEXT_PUBLIC_DEVELOPER_TWITTER || "",
    twitterHandle: process.env.NEXT_PUBLIC_DEVELOPER_TWITTER_HANDLE || "",
    github: process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || "...",
    linkedin: process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN || "",
  },
} as const;
```

**When to customize:**
- Fork the project and want to change defaults
- Need different defaults for different deployments
- Want to remove env variable dependency (hardcode values)

### App Config (`lib/config/app.ts`)

Application runtime configuration:

```typescript
export const APP_CONFIG = {
  siteUrl: env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  appName: siteConfig.name,
  siteDescription: siteConfig.description,
  corsOrigins: process.env.NEXT_PUBLIC_CORS_ORIGINS?.split(",") || [...],
  port: process.env.PORT || "3000",
  isDevelopment: isDevelopment,
  isProduction: isProduction,
} as const;
```

### API Config (`lib/config/app.ts`)

API endpoints and credentials:

```typescript
export const API_CONFIG = {
  rwa: {
    baseUrl: process.env.RWA_API_BASE_URL || "...",
    apiKey: env.RWA_API_KEY || "",
  },
  cmc: {
    baseUrl: process.env.CMC_API_BASE_URL || "...",
    apiKey: env.CMC_API_KEY || "",
  },
  // ...
} as const;
```

### Token Config (`lib/config/tokens/`)

Token definitions organized by type:

- `btc.ts` - Bitcoin wrapped tokens
- `stablecoins.ts` - Stablecoin definitions
- `lst.ts` - Liquid staking tokens
- `index.ts` - Barrel exports

**Structure:**

```typescript
export const BTC_TOKENS: TokenConfig[] = [
  {
    symbol: "xBTC",
    name: "Bitcoin",
    type: "0x...",
    decimals: 8,
    logo: "/logos/xbtc.svg",
    protocol: "xBTC",
    // ...
  },
  // ...
];
```

### Protocol Config (`lib/config/protocols/`)

DeFi protocol definitions:

- `echo.ts` - Echo Protocol configuration
- `index.ts` - Protocol registry

## Constants

### Known Addresses (`lib/constants/aptos/known-addresses.ts`)

Known contracts and addresses:

```typescript
export const KNOWN_ADDRESSES: Record<string, AddressInfo> = {
  "0x...": {
    name: "Protocol Name",
    type: "protocol",
    protocol: "protocolId",
    description: "...",
  },
  // ...
};
```

### Protocol Definitions (`lib/constants/aptos/protocols.ts`)

Protocol metadata and capabilities:

```typescript
export const PROTOCOLS: Record<string, ProtocolDefinition> = {
  thala: {
    id: "thala",
    name: "Thala",
    url: "https://app.thala.fi",
    logo: "/logos/thala.svg",
    categories: ["dex", "lending", "stablecoin"],
    // ...
  },
  // ...
};
```

## Configuration Hierarchy

The configuration system uses this priority order:

1. **Environment Variables** - Highest priority, runtime configuration
2. **Static Config Files** - Code-level defaults
3. **Hardcoded Defaults** - Fallback values

Example:

```typescript
// Priority: ENV > siteConfig > hardcoded
const siteName =
  process.env.NEXT_PUBLIC_SITE_NAME ||  // 1. Check environment
  siteConfig.name ||                     // 2. Check config file
  "On Aptos";                            // 3. Fallback default
```

## Customization Scenarios

### Scenario 1: Quick Fork

Just want to rebrand quickly:

1. Copy `.env.example` to `.env`
2. Set your developer info:
   ```env
   NEXT_PUBLIC_DEVELOPER_NAME=Your Name
   NEXT_PUBLIC_DEVELOPER_EMAIL=your@email.com
   NEXT_PUBLIC_DEVELOPER_GITHUB=https://github.com/you/repo
   ```
3. Done! Everything else uses defaults.

### Scenario 2: Production Deployment

Deploying to production:

1. Set all required API keys
2. Set production URL:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
3. Configure CORS if needed
4. Set `NODE_ENV=production`

### Scenario 3: Deep Customization

Want to change defaults permanently:

1. Fork the repository
2. Edit `lib/config/site.ts` to change defaults
3. Edit token configs in `lib/config/tokens/`
4. Customize protocol definitions
5. Update branding assets in `public/`

### Scenario 4: Multi-Environment

Different settings for dev/staging/prod:

1. Use different `.env` files:
   - `.env.development`
   - `.env.staging`
   - `.env.production`
2. Set environment-specific URLs and keys
3. Use deployment platform's environment variables

## Best Practices

### Security

- ✅ Never commit `.env` files
- ✅ Use environment variables for all secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod
- ❌ Don't hardcode secrets in config files

### Organization

- ✅ Keep related configs together
- ✅ Use TypeScript for type safety
- ✅ Document configuration options
- ✅ Provide sensible defaults
- ✅ Make configs immutable (`as const`)

### Environment Variables

- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Document all variables in `.env.example`
- ✅ Mark required vs optional clearly
- ✅ Provide default values where possible
- ❌ Don't use env vars for constants

### OSS Friendliness

- ✅ No hardcoded personal information
- ✅ Easy to fork and customize
- ✅ Clear documentation
- ✅ Sensible defaults for all settings
- ✅ Work out of the box (where possible)

## Troubleshooting

### "Missing required environment variables"

**Solution:** Check `.env` file has required API keys:
```bash
grep CMC_API_KEY .env
grep RWA_API_KEY .env
```

### "Invalid environment configuration"

**Solution:** Ensure NEXT_PUBLIC_SITE_URL is a valid URL:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # ✅
NEXT_PUBLIC_SITE_URL=localhost:3000         # ❌
```

### Developer info not showing

**Solution:** Ensure you're using `NEXT_PUBLIC_` prefix:
```env
NEXT_PUBLIC_DEVELOPER_NAME=Your Name  # ✅
DEVELOPER_NAME=Your Name              # ❌ (won't work in browser)
```

### Changes not taking effect

**Solution:**
1. Restart dev server (`Ctrl+C`, then `bun dev`)
2. Clear Next.js cache: `rm -rf .next`
3. Check you edited the right `.env` file

## Migration Guide

### From v0.1 to v0.2 (Current)

Old environment variables have been renamed:

```diff
- DEVELOPER_NAME=...
+ NEXT_PUBLIC_DEVELOPER_NAME=...

- DEVELOPER_EMAIL=...
+ NEXT_PUBLIC_DEVELOPER_EMAIL=...

- DEVELOPER_WEBSITE=...
+ NEXT_PUBLIC_DEVELOPER_WEBSITE=...

- DEVELOPER_TWITTER=...
+ NEXT_PUBLIC_DEVELOPER_TWITTER=...

- DEVELOPER_TWITTER_HANDLE=...
+ NEXT_PUBLIC_DEVELOPER_TWITTER_HANDLE=...

- DEVELOPER_GITHUB=...
+ NEXT_PUBLIC_DEVELOPER_GITHUB=...

- DEVELOPER_LINKEDIN=...
+ NEXT_PUBLIC_DEVELOPER_LINKEDIN=...

+ NEXT_PUBLIC_SITE_NAME=On Aptos
+ NEXT_PUBLIC_SITE_DESCRIPTION=...
```

## Further Reading

- [README.md](README.md) - Quick start guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup
- `.env.example` - All configuration options with comments
