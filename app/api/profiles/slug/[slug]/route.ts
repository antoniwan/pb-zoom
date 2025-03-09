import { NextResponse } from "next/server"
import { getProfileBySlug } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const profile = await getProfileBySlug(slug)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile by slug:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

