import { NextResponse } from "next/server"
import { clientPromise } from "@/lib/db"

const predefinedCategories = [
  {
    name: "Professional",
    description: "Career-focused profiles for professional networking and job seeking",
    color: "#0ea5e9",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Creative Portfolio",
    description: "Showcase your artistic work, designs, and creative projects",
    color: "#f43f5e",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Gaming",
    description: "Gaming profiles for streamers, esports players, and gaming enthusiasts",
    color: "#8b5cf6",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Academic",
    description: "Academic profiles for researchers, students, and educators",
    color: "#10b981",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Personal",
    description: "Personal profiles for social networking and dating",
    color: "#f59e0b",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Community",
    description: "Community profiles for groups, clubs, and organizations",
    color: "#6366f1",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Blog",
    description: "Blog profiles for writers and content creators",
    color: "#ec4899",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
  {
    name: "Business",
    description: "Business profiles for companies and entrepreneurs",
    color: "#14b8a6",
    isEnabled: true,
    isOfficial: true,
    isCorrect: true,
    createdBy: "system",
    usageCount: 0,
  },
]

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db()

    const operations = predefinedCategories.map((category) => ({
      updateOne: {
        filter: { name: category.name },
        update: {
          $setOnInsert: {
            ...category,
            createdAt: new Date(),
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }))

    const result = await db.collection("profileCategories").bulkWrite(operations)

    return NextResponse.json({
      success: true,
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    })
  } catch (error) {
    console.error("Error seeding categories:", error)
    return NextResponse.json({ error: "Failed to seed categories" }, { status: 500 })
  }
}

