import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateUser, getUserByUsername } from "@/lib/db"
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

    // If username is being updated, check if it's already taken
    if (validatedData.username && validatedData.username !== username) {
      const existingUser = await getUserByUsername(validatedData.username)
      if (existingUser) {
        return NextResponse.json({ message: "Username is already taken" }, { status: 400 })
      }
    }

    const success = await updateUser(user._id.toString(), validatedData)

    if (!success) {
      return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

