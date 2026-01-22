/**
 * Site and developer configuration
 * Reads from environment variables with sensible defaults for OSS
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "On Aptos",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Aptos blockchain analytics and portfolio tracking",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const developerConfig = {
  name: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "On Aptos",
  email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "hello@example.com",
  website: process.env.NEXT_PUBLIC_DEVELOPER_WEBSITE || "",
  social: {
    twitter: process.env.NEXT_PUBLIC_DEVELOPER_TWITTER || "",
    twitterHandle: process.env.NEXT_PUBLIC_DEVELOPER_TWITTER_HANDLE || "",
    github: process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || "https://github.com/onaptos/onaptos",
    linkedin: process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN || "",
  },
} as const;
