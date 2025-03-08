import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Profile } from "@/lib/models"

// Get all profiles for a user
export async function getProfiles(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profiles = await db.collection("profiles").find({ userId }).sort({ updatedAt: -1 }).toArray()

    return JSON.parse(JSON.stringify(profiles))
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return []
  }
}

// Get a specific profile by ID
export async function getProfile(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profile = await db.collection("profiles").findOne({ _id: new ObjectId(id) })

    if (!profile) {
      return null
    }

    return JSON.parse(JSON.stringify(profile))
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

// Get a profile by slug
export async function getProfileBySlug(slug: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profile = await db.collection("profiles").findOne({ slug, isPublic: true })

    if (!profile) {
      return null
    }

    return JSON.parse(JSON.stringify(profile))
  } catch (error) {
    console.error("Error fetching profile by slug:", error)
    return null
  }
}

// Create a new profile
export async function createProfile(profileData: Omit<Profile, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if slug is already taken
    const existingProfile = await db.collection("profiles").findOne({ slug: profileData.slug })
    if (existingProfile) {
      throw new Error("Profile URL is already taken")
    }

    const now = new Date()
    const result = await db.collection("profiles").insertOne({
      ...profileData,
      createdAt: now,
      updatedAt: now,
    })

    return result.insertedId.toString()
  } catch (error) {
    console.error("Error creating profile:", error)
    throw error
  }
}

// Update a profile
export async function updateProfile(id: string, updates: Partial<Profile>) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if slug is already taken by another profile
    if (updates.slug) {
      const existingProfile = await db
        .collection("profiles")
        .findOne({ slug: updates.slug, _id: { $ne: new ObjectId(id) } })
      if (existingProfile) {
        throw new Error("Profile URL is already taken")
      }
    }

    const result = await db.collection("profiles").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Delete a profile
export async function deleteProfile(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("profiles").deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting profile:", error)
    throw error
  }
}

