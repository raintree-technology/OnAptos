import { apiLogger, logger } from "@/lib/utils/core/logger";

export function getAptosAuthHeaders(): Record<string, string> {
  const apiKey = process.env.APTOS_BUILD_SECRET || process.env.APTOS_BUILD_KEY;

  if (!apiKey) {
    logger.warn("No Aptos API key found in environment");
    return {};
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export class AptosGraphQLClient {
  private static readonly MAINNET_ENDPOINT = "https://api.mainnet.aptoslabs.com/v1/graphql";

  static async query<T>(
    query: string,
    variables?: Record<string, any>,
    options?: { timeout?: number }
  ): Promise<T | null> {
    const controller = new AbortController();
    const timeoutId = options?.timeout
      ? setTimeout(() => controller.abort(), options.timeout)
      : null;

    try {
      apiLogger.debug("GraphQL request", {
        endpoint: AptosGraphQLClient.MAINNET_ENDPOINT,
        hasVariables: !!variables,
        timeout: options?.timeout,
      });

      const response = await fetch(AptosGraphQLClient.MAINNET_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAptosAuthHeaders(),
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`GraphQL HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        apiLogger.warn("GraphQL query returned errors", {
          errors: result.errors,
          query: `${query.substring(0, 100)}...`,
        });
        return null;
      }

      return result.data as T;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  static async queryWithRetry<T>(
    query: string,
    variables?: Record<string, any>,
    maxRetries = 2
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await AptosGraphQLClient.query<T>(query, variables, { timeout: 10000 });
      } catch (error) {
        apiLogger.warn(`GraphQL attempt ${attempt} failed`, {
          error: error instanceof Error ? error.message : String(error),
          attempt,
          maxRetries: maxRetries + 1,
        });

        if (attempt > maxRetries) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 2 ** (attempt - 1) * 1000));
      }
    }

    return null;
  }
}
