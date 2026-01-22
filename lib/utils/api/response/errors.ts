import { NextResponse } from "next/server";
import { type APIError, APIErrorCode, type StandardAPIResponse } from "@/lib/types/api";
import { ApiError } from "@/lib/utils/core/errors";
import { logger } from "@/lib/utils/core/logger";

const randomUUID = () => {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface ErrorContext {
  operation: string;
  service: string;
  details?: Record<string, unknown>;
}

export function buildErrorResponse(
  code: APIErrorCode,
  message: string,
  details?: Record<string, any>,
  httpStatus: number = 500
): NextResponse<StandardAPIResponse<never>> {
  const isDev = process.env.NODE_ENV === "development";

  const error: APIError = {
    code,
    message,
    ...(details && { details }),
    ...(isDev && details?.stack && { stack: details.stack }),
  };

  const response: StandardAPIResponse<never> = {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: randomUUID(),
    },
  };

  logger.error("API Error", {
    code,
    message,
    details,
    httpStatus,
    requestId: response.meta.requestId,
  });

  return NextResponse.json(response, { status: httpStatus });
}

export function errorResponse(message: string, status: number = 500, details?: any): NextResponse {
  const response = {
    success: false,
    error: message,
    status,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };

  logger.error("API Error", {
    message,
    status,
    details,
  });

  return NextResponse.json(response, { status });
}

export const APIResponses = {
  invalidInput: (message: string, details?: Record<string, any>) =>
    buildErrorResponse(APIErrorCode.INVALID_INPUT, message, details, 400),

  missingParameter: (parameter: string) =>
    buildErrorResponse(
      APIErrorCode.MISSING_PARAMETER,
      `Missing required parameter: ${parameter}`,
      { parameter },
      400
    ),

  invalidAddress: (address: string) =>
    buildErrorResponse(
      APIErrorCode.INVALID_ADDRESS,
      "Invalid Aptos address format",
      { address },
      400
    ),

  rateLimited: (limit: number, windowMs: number) =>
    buildErrorResponse(APIErrorCode.RATE_LIMITED, "Rate limit exceeded", { limit, windowMs }, 429),

  notFound: (resource: string) =>
    buildErrorResponse(APIErrorCode.NOT_FOUND, `${resource} not found`, { resource }, 404),

  internalError: (message: string = "Internal server error", error?: Error) =>
    buildErrorResponse(
      APIErrorCode.INTERNAL_ERROR,
      message,
      error ? { stack: error.stack, name: error.name } : undefined,
      500
    ),

  serviceUnavailable: (service: string) =>
    buildErrorResponse(
      APIErrorCode.SERVICE_UNAVAILABLE,
      `${service} is currently unavailable`,
      { service },
      503
    ),

  timeout: (operation: string) =>
    buildErrorResponse(
      APIErrorCode.TIMEOUT,
      `Operation timed out: ${operation}`,
      { operation },
      504
    ),

  externalAPIError: (service: string, originalError?: string) =>
    buildErrorResponse(
      APIErrorCode.EXTERNAL_API_ERROR,
      `External API error from ${service}`,
      { service, originalError },
      502
    ),
};

export function validationError(missing: string[]) {
  return errorResponse(`Missing required parameters: ${missing.join(", ")}`, 400);
}

export function createErrorResponse(
  message: string,
  details?: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    {
      status,
    }
  );
}

export function logError(error: unknown, context?: ErrorContext): void {
  logger.error("API Error", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
  });
}

export function formatApiError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  }

  return {
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}

export function handleApiError(error: unknown, context?: ErrorContext): NextResponse {
  logError(error, context);
  const formattedError = formatApiError(error);

  return NextResponse.json(
    {
      error: formattedError.message,
      code: formattedError.code,
    },
    { status: formattedError.statusCode }
  );
}

export function withErrorHandling<T>(fn: () => Promise<T>, _context?: ErrorContext): Promise<T> {
  return fn().catch((error) => {
    throw error;
  });
}

export function withErrorHandlingAndFallback<T>(
  fn: () => Promise<NextResponse<T>>,
  context?: ErrorContext,
  fallbackData?: T
): Promise<NextResponse<T>> {
  return fn().catch((error) => {
    logError(error, context);

    if (fallbackData) {
      return NextResponse.json(fallbackData);
    }

    return handleApiError(error, context) as NextResponse<T>;
  });
}

export { ApiError };
export { APIErrorCode };
