import { DEFI_PROTOCOL_COLORS } from "@/lib/constants/ui/colors";
import type { DefiProtocol } from "../types";
import { DexAggregatorImplementation, DexImplementation, PerpsImplementation } from "../types";

// Trading protocols - DEX, DEX Aggregators, Perps, and Launchpads
export const tradingProtocols: DefiProtocol[] = [
  // DEX AGGREGATORS
  {
    title: "Panora",
    href: "https://panora.exchange",
    description: "defi:protocol_descriptions.Panora",
    category: "Trading",
    subcategory: "DEX Aggregator",
    categoryBreakdown: undefined,
    implementation: DexAggregatorImplementation.ROUTE_OPTIMIZATION,
    status: "Active",
    launchDate: undefined,
    color: DEFI_PROTOCOL_COLORS.trading,
    logo: "/icons/protocols/panora.webp",
    lastUpdated: undefined,
    tags: undefined,
    networks: ["mainnet"],
    blockchainSupported: undefined,
    isOpenSource: undefined,
    security: {
      auditStatus: "Unaudited",
      auditFirms: undefined,
      metrics: undefined,
    },
    tvl: {
      current: "N/A",
      change7d: undefined,
      change30d: undefined,
      lastUpdated: undefined,
      source: undefined,
      breakdown: undefined,
      historical: undefined,
    },
    volume: undefined,
    financials: undefined,
    yields: undefined,
    token: undefined,
    pools: undefined,
    users: undefined,
    feeStructure: undefined,
    integration: {
      smartContractLinks: ["https://github.com/PanoraExchange"],
      deploymentAddresses: undefined,
      deployerAddress: undefined,
      apiEndpoints: undefined,
      sdkLanguages: undefined,
      docs: undefined,
      integrations: undefined,
      description: undefined,
    },
    external: {
      socials: {
        twitter: "https://twitter.com/PanoraExchange",
      },
      notableBackers: undefined,
    },
  },

  // DEXes
  {
    title: "Tapp",
    href: "https://testnet.tapp.exchange",
    description: "defi:protocol_descriptions.Tapp",
    category: "Trading",
    subcategory: "DEX",
    implementation: DexImplementation.AMM,
    status: "Active",
    color: DEFI_PROTOCOL_COLORS.trading,
    logo: "/icons/protocols/tapp.webp",
    networks: ["testnet"],
    security: {
      auditStatus: "Unaudited",
    },
    tvl: {
      current: "N/A",
    },
    external: {
      socials: {
        twitter: "https://twitter.com/TappExchange",
      },
    },
  },
];
