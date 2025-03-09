import { NextResponse } from "next/server"
import { getUserByUsername, getUserPublicProfiles } from "@/lib/db"

// GET /api/users/[username]/profiles - Get all public profiles for a user
export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params

    // Get the user by username
    const user = await getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get all public profiles for this user
    const profiles = await getUserPublicProfiles(user._id.toString())

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("Error fetching user profiles:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

