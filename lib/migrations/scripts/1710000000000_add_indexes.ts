import type { Db } from "mongodb"

/**
 * Migration: Add Indexes
 *
 * Description: Adds indexes to improve query performance
 */

export async function up(db: Db): Promise<void> {
  // Add indexes to profiles collection
  await db.collection("profiles").createIndex({ slug: 1 }, { unique: true })
  await db.collection("profiles").createIndex({ userId: 1 })
  await db.collection("profiles").createIndex({ category: 1 })

  // Add indexes to users collection
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ username: 1 }, { unique: true })

  // Add indexes to categories collection
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true })
}

export async function down(db: Db): Promise<void> {
  // Remove indexes from profiles collection
  await db.collection("profiles").dropIndex("slug_1")
  await db.collection("profiles").dropIndex("userId_1")
  await db.collection("profiles").dropIndex("category_1")

  // Remove indexes from users collection
  await db.collection("users").dropIndex("email_1")
  await db.collection("users").dropIndex("username_1")

  // Remove indexes from categories collection
  await db.collection("categories").dropIndex("slug_1")
}

