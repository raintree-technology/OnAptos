import { useEffect, useState } from "react";
import type { ComprehensiveMetricsResponse, MetricsData, TableData } from "@/lib/types/metrics";
import { logger } from "@/lib/utils/core/logger";

export function useMetricsData() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [tableData, setTableData] = useState<TableData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        logger.info("Fetching comprehensive metrics data from Dune APIs");

        const response = await fetch("/api/metrics/comprehensive", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Force fresh data
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${response.statusText} - ${errorText.substring(0, 200)}`
          );
        }

        const data: ComprehensiveMetricsResponse = await response.json();

        logger.info("Successfully fetched metrics data", {
          queriesUsed: data.queriesUsed?.length || 0,
          tableRows: data.tableData?.length || 0,
          dataSource: data.dataSource,
        });

        setMetrics(data.metrics);
        setTableData(data.tableData || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error("Error fetching metrics data:", error);
        setError(errorMessage);

        // Don't clear data - keep previous data if available
        // Set fallback data using functional updates to avoid stale closures
        setMetrics((prevMetrics) => (prevMetrics === null ? {} : prevMetrics));
        setTableData((prevTableData) => (prevTableData === null ? [] : prevTableData));
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up auto-refresh every 5 minutes for live data
    const interval = setInterval(fetchMetrics, 300000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    tableData,
    loading,
    error,
    refresh: () => {
      setRefreshTrigger((prev) => prev + 1);
    },
  };
}
