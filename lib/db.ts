import { MongoClient, ObjectId, MongoClientOptions } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const options: MongoClientOptions = {}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be safely reused across multiple
// functions.
export { clientPromise }

// Define the User type
interface User {
  _id: ObjectId
  username: string
  email: string
  // Add other user properties as needed
}

export interface Profile {
  _id?: string
  userId: string
  title: string
  slug: string
  description?: string
  isPublic: boolean
  categoryIds?: string[]
  viewCount?: number
  completionPercentage?: number
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
  layoutOptions?: {
    columnCount?: number
    sectionSpacing?: number
    fullWidth?: boolean
  }
  sections: ProfileSection[]
  socialLinks: Array<{
    platform: string
    url: string
  }>
  seo?: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: string
    twitterCard?: boolean
    indexed?: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface ProfileSection {
  _id: string
  type: "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom" | "links"
  title: string
  isVisible?: boolean
  content: {
    text: string
    attributes: ProfileAttribute[]
    images: ProfileImage[]
    videos: ProfileVideo[]
    markdown: string
    html: string
    customCSS?: string
    links?: LinkItem[]
  }
  order: number
}

export interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string
}

export interface ProfileAttribute {
  _id: string
  label: string
  value: string
}

export interface ProfileImage {
  _id: string
  url: string
  altText: string
  isPrimary: boolean
}

export interface ProfileVideo {
  _id: string
  url: string
  title: string
  description: string
}

export interface ProfileSocial {
  platform: string
  url: string
  icon?: string
}

// Get a profile by slug
export async function getProfileBySlug(slug: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profile = await db.collection<Profile>("profiles").findOne({ slug, isPublic: true })

    if (!profile) return null

    return JSON.parse(JSON.stringify(profile))
  } catch (error) {
    console.error("Error fetching profile by slug:", error)
    return null
  }
}

// Get a user by their username
export async function getUserByUsername(username: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne(
      { username: username },
      { projection: { password: 0 } }, // Exclude password
    )

    return user
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

// Get all public profiles for a specific user
export async function getUserPublicProfiles(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profiles = await db
      .collection<Profile>("profiles")
      .find({
        userId: userId,
        isPublic: true,
      })
      .sort({ updatedAt: -1 })
      .toArray()

    return profiles.map(profile => ({
      ...profile,
      _id: profile._id?.toString()
    }))
  } catch (error) {
    console.error("Error getting user public profiles:", error)
    return []
  }
}

// Update user information
export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { ...updates, updatedAt: new Date() } })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

// Category interface
export interface Category {
  _id?: string
  name: string
  description: string
  icon?: string
  color?: string
  isEnabled: boolean
  isOfficial: boolean
  isCorrect?: boolean
  createdBy: string
  usageCount: number
  createdAt?: Date
  updatedAt?: Date
}

// Get all categories
export async function getCategories(options?: { includeDisabled?: boolean; includeIncorrect?: boolean }) {
  try {
    const client = await clientPromise
    const db = client.db()

    const filter: Record<string, boolean> = {}
    
    // If not including disabled categories, only show enabled ones
    if (!options?.includeDisabled) {
      filter.isEnabled = true
    }
    
    // If not including incorrect categories, only show correct ones
    if (!options?.includeIncorrect) {
      filter.isCorrect = true
    }

    const categories = await db
      .collection<Category>("profileCategories")
      .find(filter)
      .sort({ name: 1 })
      .toArray()

    return categories.map(category => ({
      ...category,
      _id: category._id?.toString()
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get a single category by ID
export async function getCategory(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const objectId = new ObjectId(id)
    const category = await db
      .collection("profileCategories")
      .findOne({ _id: objectId })

    if (!category) return null
    return {
      ...category,
      _id: category._id.toString()
    } as Category
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

// Create a new category
export async function createCategory(category: Omit<Category, '_id'>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection<Category>("profileCategories").insertOne({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return result.insertedId
  } catch (error) {
    console.error("Error creating category:", error)
    return null
  }
}

// Update a category
export async function updateCategory(id: string, updates: Partial<Category>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("profileCategories")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
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

    const result = await db
      .collection("profileCategories")
      .deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting category:", error)
    return false
  }
}

// Get all profiles
export async function getProfiles(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const profiles = await db
      .collection<Profile>("profiles")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray()

    return profiles.map(profile => ({
      ...profile,
      _id: profile._id?.toString()
    }))
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

    const objectId = new ObjectId(id)
    const profile = await db
      .collection("profiles")
      .findOne({ _id: objectId })

    if (!profile) return null
    return {
      ...profile,
      _id: profile._id.toString()
    } as Profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

// Create a new profile
export async function createProfile(profile: Omit<Profile, '_id'>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection<Profile>("profiles").insertOne({
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return result.insertedId
  } catch (error) {
    console.error("Error creating profile:", error)
    return null
  }
}

// Update a profile
export async function updateProfile(id: string, updates: Partial<Profile>) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("profiles")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating profile:", error)
    return false
  }
}

// Delete a profile
export async function deleteProfile(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("profiles")
      .deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting profile:", error)
    return false
  }
}

