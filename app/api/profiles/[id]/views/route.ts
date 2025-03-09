import { NextResponse } from "next/server"
import { clientPromise } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const profileId = params.id

    // Connect to the database and increment the view count
    const client = await clientPromise
    const db = client.db()

    // Try to convert the ID to ObjectId if it's in the right format
    let query = { _id: profileId }
    try {
      if (ObjectId.isValid(profileId)) {
        query = { _id: new ObjectId(profileId) }
      }
    } catch (e) {
      // If conversion fails, use the string ID
    }

    const result = await db.collection("profiles").updateOne(query, { $inc: { viewCount: 1 } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing profile views:", error)
    return NextResponse.json({ error: "Failed to increment profile views" }, { status: 500 })
  }
}

