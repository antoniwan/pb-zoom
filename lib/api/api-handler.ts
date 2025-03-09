import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { apiResponse, errorResponse, cachedApiResponse } from "./response"
import { validateRequest } from "./validate"
import type { z } from "zod"

type ApiHandlerOptions<T> = {
  requireAuth?: boolean
  requireAdmin?: boolean
  validation?: z.ZodType<T>
  cache?: {
    maxAge: number
    staleWhileRevalidate?: number
    isPublic?: boolean
  }
}

/**
 * Creates a standardized API route handler with common functionality
 */
export function createApiHandler<T = any, R = any>(
  handler: (request: NextRequest, data: T, session?: any) => Promise<R>,
  options: ApiHandlerOptions<T> = {},
) {
  return async (request: NextRequest) => {
    try {
      // Check authentication if required
      const session = options.requireAuth || options.requireAdmin ? await getServerSession(authOptions) : null

      if (options.requireAuth && !session?.user) {
        return errorResponse("unauthorized", {
          status: 401,
          message: "Authentication required",
        })
      }

      // Check admin rights if required
      if (options.requireAdmin && session?.user?.email !== process.env.ADMIN_EMAIL) {
        return errorResponse("forbidden", {
          status: 403,
          message: "Admin access required",
        })
      }

      // Validate request data if schema provided
      let data: T

      if (options.validation) {
        // For GET requests, validate query parameters
        if (request.method === "GET") {
          const params = Object.fromEntries(new URL(request.url).searchParams)
          const validation = validateRequest(options.validation, params)

          if (!validation.success) {
            return validation.response
          }

          data = validation.data
        } else {
          // For other methods, validate request body
          const body = await request.json().catch(() => ({}))
          const validation = validateRequest(options.validation, body)

          if (!validation.success) {
            return validation.response
          }

          data = validation.data
        }
      } else {
        // If no validation schema, pass request body or query params
        data =
          request.method === "GET"
            ? (Object.fromEntries(new URL(request.url).searchParams) as T)
            : await request.json().catch(() => ({}))
      }

      // Execute the handler with validated data
      const result = await handler(request, data, session)

      // Return the result with appropriate caching
      if (options.cache && request.method === "GET") {
        return cachedApiResponse(result, options.cache)
      }

      // Return standard response for non-GET or non-cached responses
      return apiResponse(result)
    } catch (error) {
      console.error(`API error in ${request.nextUrl.pathname}:`, error)

      // Handle specific error types
      if (error instanceof Error) {
        return errorResponse("internal_error", {
          status: 500,
          message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : error.message,
          details:
            process.env.NODE_ENV === "production"
              ? undefined
              : {
                  name: error.name,
                  stack: error.stack,
                },
        })
      }

      return errorResponse("internal_error", {
        status: 500,
        message: "An unexpected error occurred",
      })
    }
  }
}

