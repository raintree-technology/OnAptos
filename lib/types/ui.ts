/**
 * Centralized UI component type definitions
 */

import type { TokenMetadata } from "./tokens";

// Base Dialog Props
export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Token Dialog Props
export interface BaseTokenDialogProps extends BaseDialogProps {
  symbol: string;
  name: string;
  decimals: number;
  supply: string;
  logoUrl?: string;
  description?: string;
  metadata?: TokenMetadata;
}

export interface ExtendedTokenDialogProps extends BaseTokenDialogProps {
  price?: number;
  priceChange24h?: number;
  marketCap?: string;
  volume24h?: string;
  susdePrice?: number;
  suppliesData?: Record<string, string>;
}

// Base Table Props
export interface BaseTableProps<T = any> {
  selectedItem?: T;
  onItemSelect: (item: T) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}

// Table Column Definition
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

// Base Filter Props
export interface BaseFilterProps<T = any> {
  filters: T;
  onChange: (filters: T) => void;
  onReset?: () => void;
  className?: string;
}

// Yield Table Props
export interface YieldTableProps {
  walletAddress?: string;
  limit?: number;
  compact?: boolean;
}
