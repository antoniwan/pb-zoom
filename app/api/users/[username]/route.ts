import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateUser, getUserByUsername } from "@/lib/db"
import { handleApiError } from "@/lib/api/error-handler"
import { z } from "zod"
import type { Session } from "next-auth"

// PATCH /api/users/[username] - Update user information
export async function PATCH(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params

    const session = (await getServerSession(authOptions)) as Session

    // Get the user by username
    const user = await getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user is authenticated and is updating their own profile
    if (!session?.user?.id || session.user.id !== user._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const userSchema = z.object({
      username: z
        .string()
        .min(3)
        .regex(/^[a-zA-Z0-9_-]+$/, {
          message: "Username can only contain letters, numbers, underscores and hyphens",
        })
        .optional(),
      bio: z.string().max(500).optional(),
      name: z.string().min(2).optional(),
    })

    const validatedData = userSchema.parse(body)

    const updatedUser = await updateUser(user._id.toString(), validatedData)

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        bio: updatedUser.bio,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

