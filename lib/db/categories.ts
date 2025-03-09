import { ObjectId, type Filter } from "mongodb"
import { findOneOrNull, find, insertOne, updateOne, deleteOne } from "./db-wrapper"
import { DocumentNotFoundError, DuplicateKeyError } from "../errors/db-errors"

// Collection name constant
const COLLECTION = "categories"

// Category type definition
interface Category {
  _id: string | ObjectId
  name: string
  description: string
  icon?: string
  color?: string
  isEnabled: boolean
  isCorrect: boolean
  isOfficial: boolean
  createdBy: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all categories
 */
export async function getCategories(
  options: {
    includeDisabled?: boolean
    includeIncorrect?: boolean
  } = {},
): Promise<Category[]> {
  const { includeDisabled = false, includeIncorrect = false } = options

  const filter: Filter<Category> = {}

  if (!includeDisabled) {
    filter.isEnabled = true
  }

  if (!includeIncorrect) {
    filter.isCorrect = true
  }

  return await find<Category>(COLLECTION, filter, {
    sort: { name: 1 },
  })
}

/**
 * Get a category by ID
 */
export async function getCategory(id: string): Promise<Category | null> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Category> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    return await findOneOrNull<Category>(COLLECTION, query)
  } catch (error) {
    console.error("Error fetching category by ID:", error)
    return null
  }
}

/**
 * Create a new category
 */
export async function createCategory(categoryData: Omit<Category, "_id" | "createdAt" | "updatedAt">): Promise<string> {
  // Check if category with same name already exists
  const existingCategory = await findOneOrNull<Category>(COLLECTION, {
    name: { $regex: new RegExp(`^${categoryData.name}$`, "i") },
  })

  if (existingCategory) {
    throw new DuplicateKeyError(COLLECTION, "name", categoryData.name)
  }

  // Add timestamps
  const now = new Date()
  const newCategory = {
    ...categoryData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await insertOne<Category>(COLLECTION, newCategory)
  return result._id.toString()
}

/**
 * Update a category
 */
export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<boolean> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Category> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    // Check if name is being updated and if it already exists
    if (categoryData.name) {
      const existingCategory = await findOneOrNull<Category>(COLLECTION, {
        name: { $regex: new RegExp(`^${categoryData.name}$`, "i") },
        _id: { $ne: ObjectId.isValid(id) ? new ObjectId(id) : id },
      })

      if (existingCategory) {
        throw new DuplicateKeyError(COLLECTION, "name", categoryData.name)
      }
    }

    // Add updated timestamp
    const updateData = {
      ...categoryData,
      updatedAt: new Date(),
    }

    await updateOne<Category>(COLLECTION, query, updateData)
    return true
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return false
    }
    throw error
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Category> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    return await deleteOne<Category>(COLLECTION, query)
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return false
    }
    throw error
  }
}

/**
 * Increment category usage count
 */
export async function incrementCategoryUsage(id: string): Promise<void> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Category> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    await updateOne<Category>(COLLECTION, query, { $inc: { usageCount: 1 } })
  } catch (error) {
    // Silently fail for usage counts - not critical
    console.error("Error incrementing category usage:", error)
  }
}

/**
 * Get categories by creator ID
 */
export async function getCategoriesByCreator(creatorId: string): Promise<Category[]> {
  return await find<Category>(COLLECTION, { createdBy: creatorId })
}

/**
 * Get popular categories
 */
export async function getPopularCategories(limit = 10): Promise<Category[]> {
  return await find<Category>(
    COLLECTION,
    { isEnabled: true, isCorrect: true },
    {
      sort: { usageCount: -1 },
      limit,
    },
  )
}

