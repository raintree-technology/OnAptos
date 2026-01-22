/**
 * Metrics data fetching service
 */

interface ApiResponse {
  metrics: any;
  tableData: any[];
  dataSource: string;
}

/**
 * Fetch comprehensive metrics data
 * When called server-side (SSR), directly imports and calls the API logic
 * When called client-side, fetches from the API endpoint
 */
export async function getMetricsData(): Promise<ApiResponse> {
  const isServer = typeof window === "undefined";

  // Server-side: Import and call the API logic directly to avoid self-fetching
  if (isServer) {
    try {
      // Dynamically import the API route handler
      const { GET } = await import("@/app/api/metrics/comprehensive/route");
      const response = await GET();
      const data = await response.json();
      return data;
    } catch (_error) {
      return {
        metrics: {},
        tableData: [],
        dataSource: "error",
      };
    }
  }

  // Client-side: Use fetch to call the API endpoint
  try {
    const response = await fetch("/api/metrics/comprehensive", {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (_error) {
    return {
      metrics: {},
      tableData: [],
      dataSource: "error",
    };
  }
}
