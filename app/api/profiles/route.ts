import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProfiles, createProfile } from "@/lib/db"
import { z } from "zod"
import type { Session } from "next-auth"

// GET /api/profiles - Get all profiles for the current user
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profiles = await getProfiles(session.user.id)

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/profiles - Create a new profile
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const profileSchema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      isPublic: z.boolean().default(false),
      theme: z.object({
        primaryColor: z.string(),
        secondaryColor: z.string(),
        backgroundColor: z.string(),
        textColor: z.string(),
        fontFamily: z.string(),
        customCSS: z.string().optional(),
      }),
      layout: z.string(),
      sections: z
        .array(
          z.object({
            _id: z.string(),
            type: z.enum(["bio", "attributes", "gallery", "videos", "markdown", "custom"]),
            title: z.string(),
            content: z.object({
              text: z.string().optional(),
              attributes: z.array(z.object({
                label: z.string(),
                value: z.string(),
              })).optional(),
              images: z.array(z.object({
                url: z.string(),
                caption: z.string().optional(),
              })).optional(),
              videos: z.array(z.object({
                url: z.string(),
                title: z.string().optional(),
              })).optional(),
              markdown: z.string().optional(),
              html: z.string().optional(),
            }),
            order: z.number(),
          }),
        )
        .default([]),
      socialLinks: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string().url(),
            icon: z.string().optional(),
          }),
        )
        .default([]),
    })

    const validatedData = profileSchema.parse(body)

    const profileId = await createProfile({
      ...validatedData,
      userId: session.user.id,
    })

    return NextResponse.json({ message: "Profile created successfully", profileId }, { status: 201 })
  } catch (error) {
    console.error("Error creating profile:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

