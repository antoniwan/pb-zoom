import { createApiHandler } from "@/lib/api/api-handler"
import { getProfiles, createProfile } from "@/lib/db"
import { z } from "zod"

// Schema for profile creation
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
  title: z.string().min(1, { message: "Title is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
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

// GET /api/profiles - Get all profiles for the current user
export const GET = createApiHandler(
  async (request, data, session) => {
    const profiles = await getProfiles(session.user.id)
    return profiles
  },
  {
    requireAuth: true,
    cache: {
      maxAge: 60, // 1 minute
      staleWhileRevalidate: 300, // 5 minutes
    },
  },
)

// POST /api/profiles - Create a new profile
export const POST = createApiHandler(
  async (request, data, session) => {
    const now = new Date()

    const profileId = await createProfile({
      ...data,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    })

    return {
      profileId,
      message: "Profile created successfully",
    }
  },
  {
    requireAuth: true,
    validation: profileSchema,
  },
)

