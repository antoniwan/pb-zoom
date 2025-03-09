import clientPromise from "./mongodb"

export async function createIndexes() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Create indexes for profiles collection
    await db.collection("profiles").createIndexes([
      { key: { userId: 1 }, name: "userId_index" },
      { key: { slug: 1 }, name: "slug_index", unique: true },
      { key: { updatedAt: -1 }, name: "updatedAt_index" },
      { key: { isPublic: 1 }, name: "isPublic_index" },
      { key: { categoryId: 1 }, name: "categoryId_index" },
    ])

    // Create indexes for categories collection
    await db.collection("profileCategories").createIndexes([
      { key: { isEnabled: 1 }, name: "isEnabled_index" },
      { key: { isCorrect: 1 }, name: "isCorrect_index" },
      { key: { createdBy: 1 }, name: "createdBy_index" },
    ])

    // Create indexes for users collection
    await db.collection("users").createIndexes([{ key: { email: 1 }, name: "email_index", unique: true }])

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating database indexes:", error)
  }
}

