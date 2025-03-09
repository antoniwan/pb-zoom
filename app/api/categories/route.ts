import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getCategories, createCategory } from "@/lib/db"
import { z } from "zod"
import type { Session } from "next-auth"

// GET /api/categories - Get all categories
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const includeDisabled = url.searchParams.get("includeDisabled") === "true"
    const includeIncorrect = url.searchParams.get("includeIncorrect") === "true"

    // Only admins should be able to see disabled or incorrect categories
    const session = (await getServerSession(authOptions)) as Session
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const categories = await getCategories({
      includeDisabled: isAdmin && includeDisabled,
      includeIncorrect: isAdmin && includeIncorrect,
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/categories - Create a new category
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const categorySchema = z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters" }),
      description: z.string().min(10, { message: "Description must be at least 10 characters" }),
      icon: z.string().optional(),
      color: z.string().optional(),
    })

    const validatedData = categorySchema.parse(body)

    // By default, user-created categories need approval
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const categoryId = await createCategory({
      ...validatedData,
      isEnabled: isAdmin, // Only enable immediately if created by admin
      isCorrect: isAdmin, // Only mark as correct immediately if created by admin
      isOfficial: isAdmin, // Only mark as official if created by admin
      createdBy: session.user.id,
      usageCount: 0,
    })

    if (!categoryId) {
      return NextResponse.json({ message: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: isAdmin ? "Category created successfully" : "Category submitted for approval",
        categoryId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

