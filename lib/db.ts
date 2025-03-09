import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  let _mongoClientPromise: Promise<MongoClient>
}

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export { clientPromise }

export interface ProfileCategory {
  _id?: ObjectId
  name: string
  description: string
  isEnabled: boolean
  isCorrect: boolean
  isOfficial: boolean
  usageCount: number
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Profile {
  _id?: ObjectId
  userId: string
  title: string
  slug: string
  isPublic: boolean
  header: {
    name: string
    title: string
    subtitle: string
    shortBio: string
    pictures: Array<{
      url: string
      altText?: string
      isPrimary: boolean
    }>
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    customCSS?: string
  }
  layout: string
  sections: Array<{
    _id: string
    type: string
    title: string
    content: Record<string, unknown>
    order: number
  }>
  socialLinks: Array<{
    platform: string
    url: string
  }>
  createdAt?: Date
  updatedAt?: Date
}

// Get all categories
export async function getCategories(
  options: {
    includeDisabled?: boolean
    includeIncorrect?: boolean
  } = {},
) {
  const { includeDisabled = false, includeIncorrect = false } = options

  try {
    const client = await clientPromise
    const db = client.db()

    const query: Partial<ProfileCategory> = {}

    if (!includeDisabled) {
      query.isEnabled = true
    }

    if (!includeIncorrect) {
      query.isCorrect = true
    }

    return await db.collection<ProfileCategory>("categories").find(query).toArray()
  } catch (error) {
    console.error("Error getting categories:", error)
    throw error
  }
}

// Get a single category by ID
export async function getCategory(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const category = await db.collection("profileCategories").findOne({ _id: new ObjectId(id) })

    if (!category) return null

    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

// Create a new category
export async function createCategory(data: Omit<ProfileCategory, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db()

    const now = new Date()
    const result = await db.collection("profileCategories").insertOne({
      ...data,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    })

    return result.insertedId.toString()
  } catch (error) {
    console.error("Error creating category:", error)
    return null
  }
}

// Update a category
export async function updateCategory(id: string, data: Partial<ProfileCategory>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("profileCategories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating category:", error)
    return false
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("profileCategories").deleteOne({
      _id: new ObjectId(id),
    })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting category:", error)
    return false
  }
}

// Increment usage count when a profile uses this category
export async function incrementCategoryUsage(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("profileCategories")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { usageCount: 1 } })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error incrementing category usage:", error)
    return false
  }
}

// Decrement usage count when a profile stops using this category
export async function decrementCategoryUsage(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("profileCategories")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { usageCount: -1 } })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error decrementing category usage:", error)
    return false
  }
}

// Add these profile-related functions back to the file

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

// Get a single profile by ID
export async function getProfile(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profile = await db.collection("profiles").findOne({ _id: new ObjectId(id) })

    if (!profile) return null

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

    if (!profile) return null

    return JSON.parse(JSON.stringify(profile))
  } catch (error) {
    console.error("Error fetching profile by slug:", error)
    return null
  }
}

// Create a new profile
export async function createProfile(data: Omit<Profile, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db()

    const now = new Date()
    const result = await db.collection<Profile>("profiles").insertOne({
      ...data,
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
export async function updateProfile(id: string, data: Partial<Omit<Profile, "_id" | "createdAt" | "updatedAt">>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection<Profile>("profiles").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
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

    // Get the profile to check if it has a categoryId
    const profile = await getProfile(id)
    const categoryId = profile?.categoryId

    // Decrement category usage count if needed
    if (categoryId) {
      await decrementCategoryUsage(categoryId)
    }

    const result = await db.collection("profiles").deleteOne({
      _id: new ObjectId(id),
    })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting profile:", error)
    return false
  }
}

