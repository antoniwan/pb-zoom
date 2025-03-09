import { ObjectId, type Filter } from "mongodb"
import { findOneOrNull, find, insertOne, updateOne, deleteOne, countDocuments } from "./db-wrapper"
import { DuplicateKeyError } from "../errors/db-errors"
import type { User } from "../models"

// Collection name constant
const COLLECTION = "users"

/**
 * Get a user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<User> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    return await findOneOrNull<User>(COLLECTION, query)
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email) return null

  try {
    return await findOneOrNull<User>(COLLECTION, {
      email: email.toLowerCase(),
    })
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

/**
 * Get a user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  if (!username) return null

  try {
    return await findOneOrNull<User>(COLLECTION, { username })
  } catch (error) {
    console.error("Error fetching user by username:", error)
    return null
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: Omit<User, "_id">): Promise<User> {
  // Check if email already exists
  const existingUserByEmail = await getUserByEmail(userData.email)
  if (existingUserByEmail) {
    throw new DuplicateKeyError(COLLECTION, "email", userData.email)
  }

  // Check if username already exists
  if (userData.username) {
    const existingUserByUsername = await getUserByUsername(userData.username)
    if (existingUserByUsername) {
      throw new DuplicateKeyError(COLLECTION, "username", userData.username)
    }
  }

  // Add timestamps
  const now = new Date()
  const newUser = {
    ...userData,
    email: userData.email.toLowerCase(), // Normalize email
    createdAt: now,
    updatedAt: now,
  }

  return await insertOne<User>(COLLECTION, newUser)
}

/**
 * Update a user
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  // Try to convert the ID to ObjectId if it's in the right format
  let query: Filter<User> = { _id: id }
  try {
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    }
  } catch (e) {
    // If conversion fails, use the string ID
  }

  // Check if email is being updated and if it already exists
  if (userData.email) {
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser && existingUser._id.toString() !== id) {
      throw new DuplicateKeyError(COLLECTION, "email", userData.email)
    }

    // Normalize email
    userData.email = userData.email.toLowerCase()
  }

  // Check if username is being updated and if it already exists
  if (userData.username) {
    const existingUser = await getUserByUsername(userData.username)
    if (existingUser && existingUser._id.toString() !== id) {
      throw new DuplicateKeyError(COLLECTION, "username", userData.username)
    }
  }

  // Add updated timestamp
  const updateData = {
    ...userData,
    updatedAt: new Date(),
  }

  return await updateOne<User>(COLLECTION, query, updateData)
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  // Try to convert the ID to ObjectId if it's in the right format
  let query: Filter<User> = { _id: id }
  try {
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    }
  } catch (e) {
    // If conversion fails, use the string ID
  }

  return await deleteOne<User>(COLLECTION, query)
}

/**
 * Get all users (with pagination)
 */
export async function getUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
  const skip = (page - 1) * limit

  const users = await find<User>(
    COLLECTION,
    {},
    {
      skip,
      limit,
      sort: { createdAt: -1 },
    },
  )

  const total = await countDocuments<User>(COLLECTION, {})

  return { users, total }
}

/**
 * Search users by name, email, or username
 */
export async function searchUsers(query: string, page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
  const searchRegex = new RegExp(query, "i")

  const filter = {
    $or: [{ name: { $regex: searchRegex } }, { email: { $regex: searchRegex } }, { username: { $regex: searchRegex } }],
  }

  const skip = (page - 1) * limit

  const users = await find<User>(COLLECTION, filter, {
    skip,
    limit,
    sort: { createdAt: -1 },
  })

  const total = await countDocuments<User>(COLLECTION, filter)

  return { users, total }
}

