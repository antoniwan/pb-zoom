"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getProfile, updateProfile, createProfile, deleteProfile } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Schema for profile creation/updates
const profileSchema = z.object({
  title: z.string().min(3).max(100),
  subtitle: z.string().optional(),
  bio: z.string().optional(),
  isPublic: z.boolean().default(false),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  header: z
    .object({
      avatarImage: z.string().optional(),
      coverImage: z.string().optional(),
    })
    .optional(),
  theme: z
    .object({
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      accentColor: z.string().optional(),
    })
    .optional(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        type: z.string(),
        title: z.string(),
        content: z.any(),
        order: z.number(),
      }),
    )
    .optional(),
})

// Type for action responses
type ActionResponse<T = void> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Create a new profile
 */
export async function createProfileAction(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: "unauthorized",
        message: "You must be logged in to create a profile",
      }
    }

    // Parse and validate the form data
    const rawData = Object.fromEntries(formData.entries())

    // Handle arrays and objects from form data
    if (rawData.tags) {
      rawData.tags = JSON.parse(rawData.tags as string)
    }
    if (rawData.socialLinks) {
      rawData.socialLinks = JSON.parse(rawData.socialLinks as string)
    }
    if (rawData.sections) {
      rawData.sections = JSON.parse(rawData.sections as string)
    }
    if (rawData.header) {
      rawData.header = JSON.parse(rawData.header as string)
    }
    if (rawData.theme) {
      rawData.theme = JSON.parse(rawData.theme as string)
    }

    // Validate with Zod
    const validationResult = profileSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: "validation_error",
        message: "Invalid profile data",
      }
    }

    // Add user ID to the profile data
    const profileData = {
      ...validationResult.data,
      userId: session.user.id,
    }

    // Create the profile
    const profile = await createProfile(profileData)

    // Revalidate the profiles page
    revalidatePath("/dashboard/profiles")

    return {
      success: true,
      data: { id: profile._id.toString() },
      message: "Profile created successfully",
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    return {
      success: false,
      error: "server_error",
      message: "Failed to create profile",
    }
  }
}

/**
 * Update an existing profile
 */
export async function updateProfileAction(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: "unauthorized",
        message: "You must be logged in to update a profile",
      }
    }

    // Get the existing profile
    const existingProfile = await getProfile(id)
    if (!existingProfile) {
      return {
        success: false,
        error: "not_found",
        message: "Profile not found",
      }
    }

    // Check ownership
    if (existingProfile.userId !== session.user.id && session.user.email !== process.env.ADMIN_EMAIL) {
      return {
        success: false,
        error: "forbidden",
        message: "You do not have permission to update this profile",
      }
    }

    // Parse and validate the form data
    const rawData = Object.fromEntries(formData.entries())

    // Handle arrays and objects from form data
    if (rawData.tags) {
      rawData.tags = JSON.parse(rawData.tags as string)
    }
    if (rawData.socialLinks) {
      rawData.socialLinks = JSON.parse(rawData.socialLinks as string)
    }
    if (rawData.sections) {
      rawData.sections = JSON.parse(rawData.sections as string)
    }
    if (rawData.header) {
      rawData.header = JSON.parse(rawData.header as string)
    }
    if (rawData.theme) {
      rawData.theme = JSON.parse(rawData.theme as string)
    }

    // Validate with Zod
    const validationResult = profileSchema.partial().safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: "validation_error",
        message: "Invalid profile data",
      }
    }

    // Update the profile
    await updateProfile(id, validationResult.data)

    // Revalidate the profile pages
    revalidatePath(`/dashboard/profiles/${id}`)
    revalidatePath(`/p/${existingProfile.slug}`)
    revalidatePath("/dashboard/profiles")

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      error: "server_error",
      message: "Failed to update profile",
    }
  }
}

/**
 * Delete a profile
 */
export async function deleteProfileAction(id: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: "unauthorized",
        message: "You must be logged in to delete a profile",
      }
    }

    // Get the existing profile
    const existingProfile = await getProfile(id)
    if (!existingProfile) {
      return {
        success: false,
        error: "not_found",
        message: "Profile not found",
      }
    }

    // Check ownership
    if (existingProfile.userId !== session.user.id && session.user.email !== process.env.ADMIN_EMAIL) {
      return {
        success: false,
        error: "forbidden",
        message: "You do not have permission to delete this profile",
      }
    }

    // Delete the profile
    await deleteProfile(id)

    // Revalidate the profiles page
    revalidatePath("/dashboard/profiles")

    return {
      success: true,
      message: "Profile deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return {
      success: false,
      error: "server_error",
      message: "Failed to delete profile",
    }
  }
}

