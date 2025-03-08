import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProfile, updateProfile, deleteProfile } from "@/lib/db"
import { z } from "zod"

// GET /api/profiles/[id] - Get a specific profile
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(params.id)

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/profiles/[id] - Update a profile
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(params.id)

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const profileSchema = z.object({
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      isPublic: z.boolean().optional(),
      theme: z
        .object({
          primaryColor: z.string(),
          secondaryColor: z.string(),
          backgroundColor: z.string(),
          textColor: z.string(),
          fontFamily: z.string(),
          customCSS: z.string().optional(),
        })
        .optional(),
      layout: z.string().optional(),
      sections: z
        .array(
          z.object({
            type: z.enum(["bio", "attributes", "gallery", "videos", "markdown", "custom"]),
            title: z.string(),
            content: z.any(),
            order: z.number(),
          }),
        )
        .optional(),
      socialLinks: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string().url(),
            icon: z.string().optional(),
          }),
        )
        .optional(),
    })

    const validatedData = profileSchema.parse(body)

    const success = await updateProfile(params.id, validatedData)

    if (!success) {
      return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/profiles/[id] - Delete a profile
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(params.id)

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteProfile(params.id)

    if (!success) {
      return NextResponse.json({ message: "Failed to delete profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Error deleting profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

