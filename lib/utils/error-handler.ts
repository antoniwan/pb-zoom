import type { ApiError } from "@/lib/types"

/**
 * Parse an error from an API response
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    return {
      error: data.error || "unknown_error",
      message: data.message || "An unknown error occurred",
      status: response.status,
      details: data.meta?.details,
    }
  } catch (e) {
    return {
      error: "parse_error",
      message: "Failed to parse error response",
      status: response.status,
    }
  }
}

/**
 * Format an error for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unknown error occurred"
}

/**
 * Log an error with context
 */
export function logError(error: unknown, context?: Record<string, any>) {
  console.error("Error:", error, context ? { context } : "")

  // Here you could also send to an error tracking service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   captureException(error, { extra: context })
  // }
}

