/**
 * GraphQL queries for DeFi balance service
 */

// Query to get user's table item data for DeFi protocols
export const DEFI_TABLE_ITEMS_QUERY = `
  query GetDeFiTableItems($ownerAddress: String!, $tableHandles: [String!]!) {
    table_items(
      where: {
        table_handle: { _in: $tableHandles },
        decoded_key: { _has_key: $ownerAddress }
      }
    ) {
      table_handle
      decoded_key
      decoded_value
      key
      write_set_change_index
      transaction_version
    }
  }
`;

// Query to get user's token balances in specific protocols
export const PROTOCOL_BALANCES_QUERY = `
  query GetProtocolBalances($ownerAddress: String!, $protocolAddresses: [String!]!) {
    current_fungible_asset_balances(
      where: {
        owner_address: { _eq: $ownerAddress },
        amount: { _gt: "0" },
        asset_type: { _regex: $protocolAddresses }
      }
    ) {
      amount
      asset_type
      metadata {
        name
        symbol
        decimals
        icon_uri
      }
    }
  }
`;

// Query to get user's coin balances in specific protocols
export const PROTOCOL_COIN_BALANCES_QUERY = `
  query GetProtocolCoinBalances($ownerAddress: String!, $protocolAddresses: [String!]!) {
    current_coin_balances(
      where: {
        owner_address: { _eq: $ownerAddress },
        amount: { _gt: "0" },
        coin_type: { _regex: $protocolAddresses }
      }
    ) {
      amount
      coin_type
      coin_info {
        name
        symbol
        decimals
      }
    }
  }
`;

// Query to get user's resources at specific protocol addresses
export const PROTOCOL_RESOURCES_QUERY = `
  query GetProtocolResources($ownerAddress: String!, $resourceTypes: [String!]!) {
    current_account_data(
      where: {
        address: { _eq: $ownerAddress }
      }
    ) {
      account_address
    }
    account_resources: current_account_data(
      where: {
        address: { _eq: $ownerAddress }
      }
    ) {
      account_address
    }
  }
`;
