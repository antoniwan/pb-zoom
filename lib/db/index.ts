// Re-export everything from the profiles file
export * from "./profiles"

// Re-export everything from the users file
export * from "./users"

// Re-export everything from the categories file
export * from "./categories"

// Export the MongoDB client for auth.ts and other uses
export { default as clientPromise } from "../mongodb"

// Re-export the database wrapper functions
export * from "./db-wrapper"

