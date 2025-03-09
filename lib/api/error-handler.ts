import { NextResponse } from "next/server"
import {
  DatabaseError,
  DocumentNotFoundError,
  ValidationError,
  DuplicateKeyError,
  ConnectionError,
} from "../errors/db-errors"

type ErrorResponse = {
  error: string
  message: string
  status: number
  details?: any
}

/**
 * Handles errors in API route handlers and returns appropriate responses
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error("API Error:", error)

  // Default error response
  let response: ErrorResponse = {
    error: "internal_server_error",
    message: "An unexpected error occurred",
    status: 500,
  }

  // Handle specific error types
  if (error instanceof DocumentNotFoundError) {
    response = {
      error: "not_found",
      message: error.message,
      status: 404,
    }
  } else if (error instanceof ValidationError) {
    response = {
      error: "validation_error",
      message: error.message,
      status: 400,
      details: error.validationErrors,
    }
  } else if (error instanceof DuplicateKeyError) {
    response = {
      error: "duplicate_key",
      message: error.message,
      status: 409,
    }
  } else if (error instanceof ConnectionError) {
    response = {
      error: "database_connection_error",
      message: "Unable to connect to the database",
      status: 503,
    }
  } else if (error instanceof DatabaseError) {
    response = {
      error: "database_error",
      message: error.message,
      status: 500,
    }
  } else if (error instanceof Error) {
    response = {
      error: "unexpected_error",
      message: error.message,
      status: 500,
    }
  }

  // In production, don't expose internal error details
  if (process.env.NODE_ENV === "production" && response.status >= 500) {
    response.message = "An unexpected error occurred"
    delete response.details
  }

  return NextResponse.json(response, { status: response.status })
}

/**
 * Example usage in a route handler:
 *
 * export async function GET(request: Request) {
 *   try {
 *     const data = await getProfile(id);
 *     return NextResponse.json(data);
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 */

