/**
 * Protocol logo mapping - Comprehensive coverage for all protocols
 * Centralized location for protocol logo URLs
 */

export const getProtocolLogo = (protocol: string): string => {
  const protocolName = protocol.toLowerCase();
  const logoMap: Record<string, string> = {
    // Liquid Staking Protocols
    amnis: "/icons/protocols/amnis.avif",
    "amnis finance": "/icons/protocols/amnis.avif",
    "thala liquid staking": "/icons/protocols/thala.avif",

    // Lending Protocols
    echelon: "/icons/protocols/echelon.avif",
    "echelon market": "/icons/protocols/echelon.avif",
    echo: "/icons/protocols/echo.webp",
    "echo lending": "/icons/protocols/echo.webp",
    aave: "/placeholder.jpg",
    "thala cdp": "/icons/protocols/thala.avif",

    // DEX Protocols
    panora: "/icons/protocols/panora.webp",
    "panora exchange": "/icons/protocols/panora.webp",

    // Farming Protocols
    thala: "/icons/protocols/thala.avif",
    "thala farm": "/icons/protocols/thala.avif",
    "thala infrastructure": "/icons/protocols/thala.avif",

    // Other Protocols
    moar: "/icons/protocols/moar.webp",
    tapp: "/icons/protocols/tapp.webp",

    // Stablecoin Protocols
    usdc: "/icons/protocols/usdc.avif",
    usde: "/icons/protocols/usde.avif",
    usdt: "/icons/protocols/usdt.avif",

    // Additional protocol variations
    kofi: "/icons/protocols/kofi.avif",
  };

  return logoMap[protocolName] || "/placeholder.jpg";
};
