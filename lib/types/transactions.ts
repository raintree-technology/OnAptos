/**
 * Transaction-related type definitions
 */

export interface Transaction {
  transaction_version: string;
  transaction_timestamp: string;
  type: string;
  amount: string;
  asset_type: string;
  success: boolean;
  function?: string;
  gas_fee?: string;
}

export interface TransactionHistoryTableProps {
  walletAddress: string | undefined;
  className?: string;
  limit?: number;
  initialLimit?: number;
  preloadedTransactions?: Transaction[] | null;
  preloadedTransactionsLoading?: boolean;
  transactions?: any[] | null;
  isLoading?: boolean;
  hasMoreTransactions?: boolean;
  loadMoreTransactions?: () => void;
}
