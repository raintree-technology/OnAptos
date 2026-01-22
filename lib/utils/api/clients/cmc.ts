import { apiLogger } from "@/lib/utils/core/logger";

export class CMCClient {
  private static readonly BASE_URL = "https://pro-api.coinmarketcap.com/v1";
  private static readonly USER_AGENT = "OnAptos-Service/1.0";

  private static get apiKey(): string {
    const key = process.env.CMC_API_KEY;
    if (!key) {
      throw new Error("CMC API key is required but not configured");
    }
    return key;
  }

  static async fetchQuote(id: string): Promise<any> {
    const url = `${CMCClient.BASE_URL}/cryptocurrency/quotes/latest?id=${id}`;

    apiLogger.debug("CMC API request", { url, id });

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMCClient.apiKey,
        Accept: "application/json",
        "User-Agent": CMCClient.USER_AGENT,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      const errorMessage = `CMC API error: ${response.status} - ${errorBody}`;
      apiLogger.error("CMC API failed", {
        status: response.status,
        error: errorBody,
      });
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async fetchBySymbol(symbol: string): Promise<any> {
    const url = `${CMCClient.BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbol}`;

    apiLogger.debug("CMC API request by symbol", { url, symbol });

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMCClient.apiKey,
        Accept: "application/json",
        "User-Agent": CMCClient.USER_AGENT,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      const errorMessage = `CMC API error: ${response.status} - ${errorBody}`;
      apiLogger.error("CMC API failed", {
        status: response.status,
        error: errorBody,
      });
      throw new Error(errorMessage);
    }

    return response.json();
  }
}
