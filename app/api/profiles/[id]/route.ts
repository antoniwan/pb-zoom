import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfile, updateProfile, deleteProfile } from "@/lib/db"
import { z } from "zod"
import type { Session } from "next-auth"

// GET /api/profiles/[id] - Get a specific profile
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Properly await the params object
    const { id } = await params

    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(id)

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
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Properly await the params object
    const { id } = await params

    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(id)

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const profilePictureSchema = z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })

    const profileHeaderSchema = z.object({
      name: z.string(),
      title: z.string(),
      subtitle: z.string(),
      shortBio: z.string(),
      pictures: z.array(profilePictureSchema),
    })

    // Modify the profileSchema to handle sections without _id by generating one
    const profileSchema = z.object({
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      isPublic: z.boolean().optional(),
      header: profileHeaderSchema.optional(),
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
            _id: z
              .string()
              .default(() => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15))),
            type: z.enum(["bio", "attributes", "gallery", "videos", "markdown", "custom"]),
            title: z.string(),
            content: z.object({
              text: z.string().optional(),
              attributes: z
                .array(
                  z.object({
                    label: z.string(),
                    value: z.string(),
                  }),
                )
                .optional(),
              images: z
                .array(
                  z.object({
                    url: z.string(),
                    caption: z.string().optional(),
                  }),
                )
                .optional(),
              videos: z
                .array(
                  z.object({
                    url: z.string(),
                    title: z.string().optional(),
                  }),
                )
                .optional(),
              markdown: z.string().optional(),
              html: z.string().optional(),
            }),
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

    const success = await updateProfile(id, validatedData)

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
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Properly await the params object
    const { id } = await params

    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(id)

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteProfile(id)

    if (!success) {
      return NextResponse.json({ message: "Failed to delete profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Error deleting profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

