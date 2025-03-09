import { MongoClient, ObjectId } from "mongodb"

// MongoDB connection
const uri = process.env.MONGODB_URI || ""
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Export the clientPromise for use in auth.ts
export { clientPromise }

// Type definitions
export interface ProfileAttribute {
  _id: string
  label: string
  value: string
}

export interface ProfileImage {
  url: string
  alt?: string
  caption?: string
}

export interface ProfileVideo {
  url: string
  title?: string
  description?: string
}

export interface ProfileSocial {
  platform: string
  url: string
}

export interface ProfileSection {
  _id: string
  type: string
  title: string
  content: {
    text: string
    attributes: ProfileAttribute[]
    images: ProfileImage[]
    videos: ProfileVideo[]
    markdown: string
    html: string
  }
  order: number
}

export interface Profile {
  _id: string
  slug: string
  title: string
  subtitle?: string
  bio?: string
  isPublic: boolean
  completionPercentage?: number
  viewCount?: number
  tags?: string[]
  location?: string
  email?: string
  website?: string
  resume?: string
  socialLinks?: ProfileSocial[]
  header?: {
    avatarImage?: string
    coverImage?: string
  }
  theme?: {
    backgroundColor?: string
    textColor?: string
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }
  sections: ProfileSection[]
  updatedAt?: string
  userId?: string
}

// Database functions
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Try to fetch the profile from the database
    const profile = (await db.collection("profiles").findOne({ slug })) as Profile | null

    // If no profile is found in the database, return a mock profile for testing
    if (!profile && process.env.NODE_ENV === "development") {
      return getMockProfile(slug)
    }

    return profile
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
    const client = await clientPromise
    const db = client.db()

    // Try to convert the ID to ObjectId if it's in the right format
    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    // Try to fetch the profile from the database
    const profile = (await db.collection("profiles").findOne(query)) as Profile | null

    // If no profile is found in the database, return a mock profile for testing
    if (!profile && process.env.NODE_ENV === "development") {
      return getMockProfile("test-profile", id)
    }

    return profile
  } catch (error) {
    console.error("Error fetching profile by ID:", error)

    // In development, return a mock profile even if there's an error
    if (process.env.NODE_ENV === "development") {
      return getMockProfile("test-profile", id)
    }

    return null
  }
}

// Update profile
export async function updateProfile(id: string, data: Partial<Profile>): Promise<Profile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Try to convert the ID to ObjectId if it's in the right format
    let query = { _id: id }
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

    // Update the profile in the database
    const result = await db
      .collection("profiles")
      .findOneAndUpdate(query, { $set: updateData }, { returnDocument: "after" })

    return result as unknown as Profile | null
  } catch (error) {
    console.error("Error updating profile:", error)
    return null
  }
}

// Delete profile
export async function deleteProfile(id: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Try to convert the ID to ObjectId if it's in the right format
    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    // Delete the profile from the database
    const result = await db.collection("profiles").deleteOne(query)

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting profile:", error)
    return false
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
    userId: "user123",
  }
}

