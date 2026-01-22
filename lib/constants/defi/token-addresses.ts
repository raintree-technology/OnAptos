/**
 * Token addresses for DeFi protocols on Aptos
 */

export const TOKEN_ADDRESSES = {
  APT: "0x1::aptos_coin::AptosCoin",
  USDC: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
  USDT: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
  THAPT: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::staking::ThalaAPT",
  THL: "0x07fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL",
  MOD: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD",
} as const;

export const INDEXER = "https://api.mainnet.aptoslabs.com/v1/graphql";
