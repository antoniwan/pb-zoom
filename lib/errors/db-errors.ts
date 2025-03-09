/**
 * Custom error types for database operations
 */

// Base database error class
export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message)
    this.name = "DatabaseError"

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError)
    }
  }
}

// Specific error types
export class DocumentNotFoundError extends DatabaseError {
  constructor(collection: string, query: Record<string, any>, cause?: unknown) {
    super(`Document not found in collection "${collection}" with query ${JSON.stringify(query)}`, cause)
    this.name = "DocumentNotFoundError"
  }
}

export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    public validationErrors?: Record<string, string>,
    cause?: unknown,
  ) {
    super(message, cause)
    this.name = "ValidationError"
  }
}

export class DuplicateKeyError extends DatabaseError {
  constructor(collection: string, key: string, value: any, cause?: unknown) {
    super(`Duplicate key error in collection "${collection}" for key "${key}" with value "${value}"`, cause)
    this.name = "DuplicateKeyError"
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(`Database connection error: ${message}`, cause)
    this.name = "ConnectionError"
  }
}

// Error detection utilities
export function isDuplicateKeyError(error: any): boolean {
  return error.code === 11000 || error.code === 11001
}

export function extractDuplicateKeyInfo(error: any): { collection: string; key: string; value: any } | null {
  if (!isDuplicateKeyError(error)) return null

  try {
    // Extract information from the error message
    const collection = error.message.match(/collection: (\w+)/)?.[1] || "unknown"
    const keyValue = error.keyValue || {}
    const key = Object.keys(keyValue)[0] || "unknown"
    const value = keyValue[key]

    return { collection, key, value }
  } catch {
    return { collection: "unknown", key: "unknown", value: "unknown" }
  }
}

