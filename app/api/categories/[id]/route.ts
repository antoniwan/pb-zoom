import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getCategory, updateCategory, deleteCategory } from "@/lib/db"
import { z } from "zod"
import type { Session } from "next-auth"

// GET /api/categories/[id] - Get a specific category
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const category = await getCategory(id)

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/categories/[id] - Update a category
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const category = await getCategory(id)

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Only allow the creator or an admin to update the category
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
    const isCreator = category.createdBy === session.user.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const categorySchema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(10).optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      isEnabled: z.boolean().optional(),
      isCorrect: z.boolean().optional(),
      isOfficial: z.boolean().optional(),
    })

    const validatedData = categorySchema.parse(body)

    // Only admins can change moderation fields
    if (!isAdmin) {
      delete validatedData.isEnabled
      delete validatedData.isCorrect
      delete validatedData.isOfficial
    }

    const success = await updateCategory(id, validatedData)

    if (!success) {
      return NextResponse.json({ message: "Failed to update category" }, { status: 500 })
    }

    return NextResponse.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const category = await getCategory(id)

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Only allow an admin to delete categories
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteCategory(id)

    if (!success) {
      return NextResponse.json({ message: "Failed to delete category" }, { status: 500 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

