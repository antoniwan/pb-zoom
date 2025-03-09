import type { Db } from "mongodb"

/**
 * Migration: Add Profile Views
 *
 * Description: Adds a views counter to profiles
 */

export async function up(db: Db): Promise<void> {
  // Add views field to all profiles with a default value of 0
  await db.collection("profiles").updateMany({ views: { $exists: false } }, { $set: { views: 0 } })

  // Create an index on views for sorting
  await db.collection("profiles").createIndex({ views: -1 })
}

export async function down(db: Db): Promise<void> {
  // Remove views field from all profiles
  await db.collection("profiles").updateMany({}, { $unset: { views: "" } })

  // Remove the index
  await db.collection("profiles").dropIndex("views_-1")
}

