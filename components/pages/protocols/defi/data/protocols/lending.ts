import { DEFI_PROTOCOL_COLORS } from "@/lib/constants/ui/colors";
import type { DefiProtocol } from "../types";
import { LendingImplementation } from "../types";

// Credit/Lending protocols
export const lendingProtocols: DefiProtocol[] = [
  {
    title: "Echelon",
    href: "https://echelon.market",
    description: "defi:protocol_descriptions.Echelon",
    category: "Credit",
    subcategory: "Lending",
    implementation: LendingImplementation.ISOLATED_POOLS,
    status: "Active",
    color: DEFI_PROTOCOL_COLORS.lending,
    logo: "/icons/protocols/echelon.avif",
    networks: ["mainnet"],
    security: {
      auditStatus: "Audited",
    },
    tvl: {
      current: "$270M",
    },
    external: {
      socials: {
        twitter: "https://twitter.com/EchelonMarket",
      },
    },
    integration: {
      smartContractLinks: ["https://github.com/EchelonMarket"],
    },
  },
];
