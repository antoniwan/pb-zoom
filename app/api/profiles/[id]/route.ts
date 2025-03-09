import { createApiHandler } from "@/lib/api/api-handler"
import { getProfile, updateProfile, deleteProfile } from "@/lib/db"
import { errorResponse } from "@/lib/api/response"
import { z } from "zod"

// Schema for profile updates (partial schema)
const profileUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    isPublic: z.boolean().optional(),
    // ... other fields that can be updated
  })
  .strict() // Only allow fields defined in the schema

// GET /api/profiles/[id] - Get a specific profile
export const GET = createApiHandler(
  async (request, data, session) => {
    const id = request.nextUrl.pathname.split("/").pop()

    if (!id) {
      return errorResponse("bad_request", {
        status: 400,
        message: "Profile ID is required",
      })
    }

    const profile = await getProfile(id)

    if (!profile) {
      return errorResponse("not_found", {
        status: 404,
        message: "Profile not found",
      })
    }

    // Check if the user has permission to view this profile
    if (!profile.isPublic && profile.userId !== session?.user?.id) {
      return errorResponse("forbidden", {
        status: 403,
        message: "You do not have permission to view this profile",
      })
    }

    return profile
  },
  {
    cache: {
      maxAge: 60, // 1 minute
      staleWhileRevalidate: 300, // 5 minutes
      isPublic: false, // Private by default, public profiles are handled in the handler
    },
  },
)

// PATCH /api/profiles/[id] - Update a profile
export const PATCH = createApiHandler(
  async (request, data, session) => {
    const id = request.nextUrl.pathname.split("/").pop()

    if (!id) {
      return errorResponse("bad_request", {
        status: 400,
        message: "Profile ID is required",
      })
    }

    const profile = await getProfile(id)

    if (!profile) {
      return errorResponse("not_found", {
        status: 404,
        message: "Profile not found",
      })
    }

    // Check if the user has permission to update this profile
    if (profile.userId !== session?.user?.id && session?.user?.email !== process.env.ADMIN_EMAIL) {
      return errorResponse("forbidden", {
        status: 403,
        message: "You do not have permission to update this profile",
      })
    }

    const updatedProfile = await updateProfile(id, {
      ...data,
      updatedAt: new Date(),
    })

    return {
      profile: updatedProfile,
      message: "Profile updated successfully",
    }
  },
  {
    requireAuth: true,
    validation: profileUpdateSchema,
  },
)

// DELETE /api/profiles/[id] - Delete a profile
export const DELETE = createApiHandler(
  async (request, data, session) => {
    const id = request.nextUrl.pathname.split("/").pop()

    if (!id) {
      return errorResponse("bad_request", {
        status: 400,
        message: "Profile ID is required",
      })
    }

    const profile = await getProfile(id)

    if (!profile) {
      return errorResponse("not_found", {
        status: 404,
        message: "Profile not found",
      })
    }

    // Check if the user has permission to delete this profile
    if (profile.userId !== session?.user?.id && session?.user?.email !== process.env.ADMIN_EMAIL) {
      return errorResponse("forbidden", {
        status: 403,
        message: "You do not have permission to delete this profile",
      })
    }

    const success = await deleteProfile(id)

    if (!success) {
      return errorResponse("internal_error", {
        status: 500,
        message: "Failed to delete profile",
      })
    }

    return {
      message: "Profile deleted successfully",
    }
  },
  {
    requireAuth: true,
  },
)

