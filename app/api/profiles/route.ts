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

    // Add cache control headers for better performance
    return NextResponse.json(profiles, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error fetching profiles:", error)

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "Internal server error",
          error: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 },
      )
    }

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

    const profilePictureSchema = z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })

    const profileHeaderSchema = z.object({
      name: z.string().default(""),
      title: z.string().default(""),
      subtitle: z.string().default(""),
      shortBio: z.string().default(""),
      pictures: z.array(profilePictureSchema).default([]),
    })

    const profileSchema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      isPublic: z.boolean().default(false),
      header: profileHeaderSchema.default({
        name: "",
        title: "",
        subtitle: "",
        shortBio: "",
        pictures: [],
      }),
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
              text: z.string(),
              attributes: z.array(
                z.object({
                  _id: z.string(),
                  label: z.string(),
                  value: z.string(),
                }),
              ),
              images: z.array(
                z.object({
                  _id: z.string(),
                  url: z.string(),
                  altText: z.string(),
                  isPrimary: z.boolean(),
                }),
              ),
              videos: z.array(
                z.object({
                  _id: z.string(),
                  url: z.string(),
                  title: z.string(),
                  description: z.string(),
                }),
              ),
              markdown: z.string(),
              html: z.string(),
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
    const now = new Date()

    const profileId = await createProfile({
      ...validatedData,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
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

