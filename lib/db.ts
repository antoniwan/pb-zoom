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
  altText?: string
  isPrimary: boolean
}

export interface ProfileVideo {
  _id: string
  url: string
  title: string
  description: string
}

export interface LinkItem {
  _id: string
  title: string
  url: string
  icon: string
  description?: string
}

export interface ProfileSocial {
  platform: string
  url: string
  icon?: string
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
    links?: LinkItem[]
    customCSS?: string
  }
  order: number
  isVisible?: boolean
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
    name: string
    title: string
    subtitle: string
    shortBio: string
    pictures: ProfileImage[]
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
  updatedAt?: string
  userId: string
  categoryIds?: string[]
  seo?: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: string
    twitterCard?: boolean
    indexed?: boolean
  }
}

export interface Category {
  _id?: string
  name: string
  description: string
  icon?: string
  color: string
  isEnabled: boolean
  isCorrect: boolean
  isOfficial: boolean
  createdBy: string
  usageCount: number
  createdAt?: Date
  updatedAt?: Date
}

export async function getCategories(options: { includeDisabled?: boolean; includeIncorrect?: boolean } = {}) {
  try {
    const client = await clientPromise
    const db = client.db()

    const query: any = {}

    if (!options.includeDisabled) {
      query.isEnabled = true
    }

    if (!options.includeIncorrect) {
      query.isCorrect = true
    }

    const categories = await db.collection("profileCategories").find(query).toArray()
    return categories as Category[]
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export async function createCategory(
  category: Omit<Category, "_id" | "createdAt" | "updatedAt">,
): Promise<string | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const now = new Date()
    const result = await db.collection("profileCategories").insertOne({
      ...category,
      createdAt: now,
      updatedAt: now,
    })

    return result.insertedId.toString()
  } catch (error) {
    console.error("Error creating category:", error)
    return null
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const category = (await db.collection("profileCategories").findOne(query)) as Category | null
    return category
  } catch (error) {
    console.error("Error getting category:", error)
    return null
  }
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("profileCategories").updateOne(query, { $set: updateData })
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating category:", error)
    return false
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const result = await db.collection("profileCategories").deleteOne(query)
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting category:", error)
    return false
  }
}

export async function getProfiles(userId: string): Promise<Profile[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const profiles = (await db.collection("profiles").find({ userId }).toArray()) as Profile[]
    return profiles
  } catch (error) {
    console.error("Error getting profiles:", error)
    return []
  }
}

export async function createProfile(profile: Omit<Profile, "_id">): Promise<string | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("profiles").insertOne(profile)
    return result.insertedId.toString()
  } catch (error) {
    console.error("Error creating profile:", error)
    return null
  }
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const profile = (await db.collection("profiles").findOne({ slug })) as Profile | null
    return profile
  } catch (error) {
    console.error("Error getting profile by slug:", error)
    return null
  }
}

export async function getProfile(id: string): Promise<Profile | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const profile = (await db.collection("profiles").findOne(query)) as Profile | null
    return profile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

export async function updateProfile(id: string, data: Partial<Profile>): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("profiles").updateOne(query, { $set: updateData })
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating profile:", error)
    return false
  }
}

export async function deleteProfile(id: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: id }
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const result = await db.collection("profiles").deleteOne(query)
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting profile:", error)
    return false
  }
}

export async function getUserByUsername(
  username: string,
): Promise<{ _id: ObjectId; name: string; email: string; username: string; image?: string; bio?: string } | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ username })

    if (!user) {
      return null
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      bio: user.bio,
    }
  } catch (error) {
    console.error("Error fetching user by username:", error)
    return null
  }
}

export async function getUserPublicProfiles(userId: string): Promise<Profile[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const profiles = (await db.collection("profiles").find({ userId, isPublic: true }).toArray()) as Profile[]
    return profiles
  } catch (error) {
    console.error("Error fetching user profiles:", error)
    return []
  }
}

export async function updateUser(
  userId: string,
  data: Partial<{ username: string; bio: string; name: string }>,
): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    let query = { _id: userId }
    try {
      if (ObjectId.isValid(userId)) {
        query = { _id: new ObjectId(userId) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("users").updateOne(query, { $set: updateData })
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

