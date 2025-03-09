import { NextResponse } from "next/server"

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    [key: string]: any
  }
}

/**
 * Creates a standardized successful API response
 */
export function apiResponse<T>(
  data?: T,
  options?: {
    status?: number
    message?: string
    meta?: ApiResponse<T>["meta"]
  },
) {
  const { status = 200, message, meta } = options || {}

  const response: ApiResponse<T> = {
    success: true,
    message,
    meta,
  }

  if (data !== undefined) {
    response.data = data
  }

  return NextResponse.json(response, {
    status,
    headers: {
      "Cache-Control": "private, max-age=0, s-maxage=0, no-store",
    },
  })
}

/**
 * Creates a standardized error API response
 */
export function errorResponse(
  error: string,
  options?: {
    status?: number
    message?: string
    details?: any
  },
) {
  const { status = 400, message, details } = options || {}

  const response: ApiResponse<null> = {
    success: false,
    error,
    message,
  }

  // Only include details in non-production environments
  if (details && process.env.NODE_ENV !== "production") {
    response.meta = { details }
  }

  return NextResponse.json(response, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}

/**
 * Creates a response with appropriate cache headers
 */
export function cachedApiResponse<T>(
  data: T,
  options?: {
    status?: number
    message?: string
    meta?: ApiResponse<T>["meta"]
    maxAge?: number // in seconds
    staleWhileRevalidate?: number // in seconds
    isPublic?: boolean
  },
) {
  const { status = 200, message, meta, maxAge = 60, staleWhileRevalidate = 300, isPublic = false } = options || {}

  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  }

  return NextResponse.json(response, {
    status,
    headers: {
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    },
  })
}

