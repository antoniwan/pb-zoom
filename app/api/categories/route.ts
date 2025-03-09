import { createApiHandler } from "@/lib/api/api-handler"
import { getCategories, createCategory } from "@/lib/db"
import { z } from "zod"

// Schema for category creation
const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  icon: z.string().optional(),
  color: z.string().optional(),
})

// Query parameters schema for GET request
const getCategoriesParamsSchema = z
  .object({
    includeDisabled: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true"),
    includeIncorrect: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true"),
  })
  .default({})

// GET /api/categories - Get all categories
export const GET = createApiHandler(
  async (request, data, session) => {
    const { includeDisabled, includeIncorrect } = data

    // Only admins should be able to see disabled or incorrect categories
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const categories = await getCategories({
      includeDisabled: isAdmin && includeDisabled,
      includeIncorrect: isAdmin && includeIncorrect,
    })

    return {
      categories,
      meta: {
        total: categories.length,
      },
    }
  },
  {
    validation: getCategoriesParamsSchema,
    cache: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 600, // 10 minutes
      isPublic: true, // Categories can be publicly cached
    },
  },
)

// POST /api/categories - Create a new category
export const POST = createApiHandler(
  async (request, data, session) => {
    // By default, user-created categories need approval
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    const categoryId = await createCategory({
      ...data,
      isEnabled: isAdmin, // Only enable immediately if created by admin
      isCorrect: isAdmin, // Only mark as correct immediately if created by admin
      isOfficial: isAdmin, // Only mark as official if created by admin
      createdBy: session.user.id,
      usageCount: 0,
    })

    return {
      categoryId,
      message: isAdmin ? "Category created successfully" : "Category submitted for approval",
    }
  },
  {
    requireAuth: true,
    validation: categorySchema,
  },
)

