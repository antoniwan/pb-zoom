import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { Profile } from "./models"

export async function getProfiles(userId: string) {
  const client = await clientPromise
  const db = client.db()

  const profiles = await db.collection("profiles").find({ userId }).sort({ updatedAt: -1 }).toArray()

  return JSON.parse(JSON.stringify(profiles))
}

export async function getProfile(id: string) {
  const client = await clientPromise
  const db = client.db()

  const profile = await db.collection("profiles").findOne({ _id: new ObjectId(id) })

  return profile ? JSON.parse(JSON.stringify(profile)) : null
}

export async function getProfileBySlug(slug: string) {
  const client = await clientPromise
  const db = client.db()

  const profile = await db.collection("profiles").findOne({ slug, isPublic: true })

  return profile ? JSON.parse(JSON.stringify(profile)) : null
}

export async function createProfile(profile: Omit<Profile, "_id" | "createdAt" | "updatedAt">) {
  const client = await clientPromise
  const db = client.db()

  const now = new Date()
  const result = await db.collection("profiles").insertOne({
    ...profile,
    createdAt: now,
    updatedAt: now,
  })

  return result.insertedId.toString()
}

export async function updateProfile(id: string, profile: Partial<Profile>) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("profiles").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...profile,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteProfile(id: string) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("profiles").deleteOne({ _id: new ObjectId(id) })

  return result.deletedCount > 0
}

