import withBundleAnalyzer from "@next/bundle-analyzer";

// Content Security Policy configuration
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.arweave.net https://arweave.net https://ipfs.io https://*.ipfs.io https://cloudflare-ipfs.com https://nftstorage.link https://*.aptoslabs.com https://raw.githubusercontent.com https://*.githubusercontent.com",
  "connect-src 'self' https://api.llama.fi https://api.mainnet.aptoslabs.com https://fullnode.mainnet.aptoslabs.com https://pro-api.coinmarketcap.com https://api.coingecko.com https://api.panora.exchange https://api.rwa.xyz https://on-chain-data-seven.vercel.app https://vercel.live https://va.vercel-scripts.com wss://*.walletconnect.com https://*.walletconnect.com",
  "font-src 'self' data:",
  "frame-ancestors 'self'",
  "frame-src 'self' https://verify.walletconnect.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side environment variables - removed client exposure for security

  // Basic settings
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  // Temporarily disable ESLint during builds for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable TypeScript error checking
  typescript: {
    ignoreBuildErrors: false,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/stablecoins",
        destination: "/markets/stables",
        permanent: true,
      },
      {
        source: "/stables",
        destination: "/markets/stables",
        permanent: true,
      },
      {
        source: "/btc",
        destination: "/markets/bitcoin",
        permanent: true,
      },
      {
        source: "/bitcoin",
        destination: "/markets/bitcoin",
        permanent: true,
      },
      {
        source: "/rwa",
        destination: "/markets/rwas",
        permanent: true,
      },
      {
        source: "/rwas",
        destination: "/markets/rwas",
        permanent: true,
      },
      {
        source: "/tokens",
        destination: "/markets/tokens",
        permanent: true,
      },
      {
        source: "/defi",
        destination: "/protocols/defi",
        permanent: true,
      },
      {
        source: "/lst",
        destination: "/protocols/lst",
        permanent: true,
      },
      {
        source: "/yields",
        destination: "/protocols/yields",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/tools/portfolio",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/tools/portfolio",
        permanent: true,
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },

  // Disable image optimization
  images: {
    unoptimized: true,
  },

  // Simplified webpack config to resolve build issues
  webpack: (config, { isServer, dev }) => {
    // Handle Node.js modules in browser for wallet adapters
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        util: false,
      };
    }

    // Handle "node:" prefixed imports for Node.js built-ins
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:events": "events",
      "node:fs/promises": "fs/promises",
      "node:path": "path",
    };

    return config;
  },
};

// Configure bundle analyzer
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
