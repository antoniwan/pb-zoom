import { ObjectId, type Filter } from "mongodb"
import { findOneOrNull, find, insertOne, updateOne, deleteOne } from "./db-wrapper"
import { DocumentNotFoundError } from "../errors/db-errors"

// Collection name constant
const COLLECTION = "profiles"

// Profile type (assuming it's imported from types/profile)
import type { Profile } from "../types/profile"

// Get profile by slug
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    return await findOneOrNull<Profile>(COLLECTION, { slug })
  } catch (error) {
    console.error("Error fetching profile by slug:", error)

    // In development, return a mock profile even if there's an error
    if (process.env.NODE_ENV === "development") {
      return getMockProfile(slug)
    }

    return null
  }
}

// Get profile by ID
export async function getProfile(id: string): Promise<Profile | null> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Profile> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    return await findOneOrNull<Profile>(COLLECTION, query)
  } catch (error) {
    console.error("Error fetching profile by ID:", error)

    // In development, return a mock profile even if there's an error
    if (process.env.NODE_ENV === "development") {
      return getMockProfile("test-profile", id)
    }

    return null
  }
}

// Create a new profile
export async function createProfile(data: Omit<Profile, "_id">): Promise<Profile> {
  // Add timestamps
  const profileData = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return await insertOne<Profile>(COLLECTION, profileData)
}

// Update profile
export async function updateProfile(id: string, data: Partial<Profile>): Promise<Profile> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Profile> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    // Add updatedAt timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return await updateOne<Profile>(COLLECTION, query, updateData)
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      throw new DocumentNotFoundError(COLLECTION, { id }, error)
    }
    throw error
  }
}

// Delete profile
export async function deleteProfile(id: string): Promise<boolean> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Profile> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    return await deleteOne<Profile>(COLLECTION, query)
  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      // If we're trying to delete something that doesn't exist,
      // we can consider this a success
      return false
    }
    throw error
  }
}

// Get profiles by user ID
export async function getProfilesByUserId(userId: string): Promise<Profile[]> {
  return await find<Profile>(COLLECTION, { userId })
}

// Increment profile view count
export async function incrementProfileViews(id: string): Promise<void> {
  try {
    // Try to convert the ID to ObjectId if it's in the right format
    let query: Filter<Profile> = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    await updateOne<Profile>(COLLECTION, query, { $inc: { viewCount: 1 } })
  } catch (error) {
    // Silently fail for view counts - not critical
    console.error("Error incrementing profile views:", error)
  }
}

// Helper function to get a mock profile for development
function getMockProfile(slug: string, id = "profile123"): Profile {
  return {
    _id: id,
    slug: slug,
    title: "Test Profile",
    subtitle: "Web Developer & Designer",
    bio: "This is a test profile for development purposes.",
    isPublic: true,
    completionPercentage: 85,
    viewCount: 42,
    tags: ["Web Development", "UI/UX", "JavaScript"],
    location: "San Francisco, CA",
    email: "test@example.com",
    website: "https://example.com",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    header: {
      avatarImage: "/placeholder.svg?height=200&width=200",
      coverImage: "/placeholder.svg?height=1200&width=600",
    },
    theme: {
      backgroundColor: "#ffffff",
      textColor: "#333333",
      primaryColor: "#3b82f6",
      secondaryColor: "#6b7280",
      accentColor: "#f59e0b",
    },
    sections: [
      {
        _id: "section1",
        type: "bio",
        title: "About Me",
        content: {
          text: "I'm a passionate developer with experience in web technologies.",
          attributes: [],
          images: [],
          videos: [],
          markdown: "",
          html: "",
        },
        order: 0,
      },
      {
        _id: "section2",
        type: "attributes",
        title: "Skills",
        content: {
          text: "",
          attributes: [
            { _id: "attr1", label: "JavaScript", value: "90" },
            { _id: "attr2", label: "React", value: "85" },
            { _id: "attr3", label: "Node.js", value: "80" },
          ],
          images: [],
          videos: [],
          markdown: "",
          html: "",
        },
        order: 1,
      },
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    userId: "user123",
  }
}

