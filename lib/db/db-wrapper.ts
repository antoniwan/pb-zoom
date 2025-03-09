import type { Db, Document, Filter, FindOptions, UpdateFilter, UpdateOptions, DeleteOptions } from "mongodb"
import { getDb } from "../mongodb"
import {
  DatabaseError,
  DocumentNotFoundError,
  DuplicateKeyError,
  ConnectionError,
  isDuplicateKeyError,
  extractDuplicateKeyInfo,
} from "../errors/db-errors"

// Type for database operation functions
type DbOperation<T> = (db: Db) => Promise<T>

/**
 * Wrapper function to standardize error handling for database operations
 */
export async function withDb<T>(operation: DbOperation<T>): Promise<T> {
  try {
    const db = await getDb()
    return await operation(db)
  } catch (error: any) {
    // Handle specific MongoDB errors
    if (error.name === "MongoNetworkError" || error.name === "MongoServerSelectionError") {
      throw new ConnectionError(error.message, error)
    }

    if (isDuplicateKeyError(error)) {
      const info = extractDuplicateKeyInfo(error)
      if (info) {
        throw new DuplicateKeyError(info.collection, info.key, info.value, error)
      }
    }

    // If it's already one of our custom errors, just rethrow it
    if (error instanceof DatabaseError) {
      throw error
    }

    // Default to generic database error
    throw new DatabaseError(`Database operation failed: ${error.message}`, error)
  }
}

/**
 * Helper functions for common database operations with standardized error handling
 */

// Find a document by ID or other unique identifier
export async function findOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  options?: FindOptions,
): Promise<T> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    const result = await collection.findOne(filter, options)

    if (!result) {
      throw new DocumentNotFoundError(collectionName, filter as Record<string, any>)
    }

    return result
  })
}

// Find a document or return null if not found (doesn't throw NotFoundError)
export async function findOneOrNull<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  options?: FindOptions,
): Promise<T | null> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    return await collection.findOne(filter, options)
  })
}

// Find multiple documents
export async function find<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  options?: FindOptions,
): Promise<T[]> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    return await collection.find(filter, options).toArray()
  })
}

// Insert a new document
export async function insertOne<T extends Document>(collectionName: string, document: Omit<T, "_id">): Promise<T> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    const result = await collection.insertOne(document as any)

    if (!result.acknowledged) {
      throw new DatabaseError(`Failed to insert document into ${collectionName}`)
    }

    return { ...document, _id: result.insertedId } as T
  })
}

// Update a document
export async function updateOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: UpdateFilter<T> | Partial<T>,
  options?: UpdateOptions,
): Promise<T> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)

    // If update is not using operators like $set, wrap it in $set
    const finalUpdate = Object.keys(update).every((key) => !key.startsWith("$")) ? { $set: update } : update

    const result = await collection.findOneAndUpdate(filter, finalUpdate, { returnDocument: "after", ...options })

    if (!result) {
      throw new DocumentNotFoundError(collectionName, filter as Record<string, any>)
    }

    return result
  })
}

// Delete a document
export async function deleteOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  options?: DeleteOptions,
): Promise<boolean> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    const result = await collection.deleteOne(filter, options)

    if (!result.acknowledged) {
      throw new DatabaseError(`Failed to delete document from ${collectionName}`)
    }

    if (result.deletedCount === 0) {
      throw new DocumentNotFoundError(collectionName, filter as Record<string, any>)
    }

    return true
  })
}

// Count documents
export async function countDocuments<T extends Document>(collectionName: string, filter: Filter<T>): Promise<number> {
  return withDb(async (db) => {
    const collection = db.collection<T>(collectionName)
    return await collection.countDocuments(filter)
  })
}

