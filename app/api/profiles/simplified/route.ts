import { createApiHandler } from "@/lib/api/api-handler"
import { getProfiles, createProfile } from "@/lib/db"
import { z } from "zod"

// Schema for profile creation
const profileSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  isPublic: z.boolean().default(false),
  // ... other fields
})

// GET /api/profiles/simplified - Get all profiles for the current user
export const GET = createApiHandler(
  async (request, data, session) => {
    const profiles = await getProfiles(session.user.id)
    return profiles
  },
  {
    requireAuth: true,
    rateLimit: {
      limit: 50,
      window: 60, // 1 minute
    },
  },
)

// POST /api/profiles/simplified - Create a new profile
export const POST = createApiHandler(
  async (request, data, session) => {
    const now = new Date()
    const profileId = await createProfile({
      ...data,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    })

    return { profileId }
  },
  {
    requireAuth: true,
    validation: profileSchema,
    rateLimit: {
      limit: 10,
      window: 60 * 60, // 1 hour
    },
  },
)

