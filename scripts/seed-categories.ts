import { createCategory } from "../lib/db/categories"
import { connectToDatabase } from "../lib/mongodb"

const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "admin"

async function seedCategories() {
  try {
    // Ensure we're connected to the database
    await connectToDatabase()

    console.log("Seeding profile categories...")

    const categories = [
      {
        name: "Professional",
        description:
          "For work, career, and professional networking. Showcase your skills, experience, and achievements.",
        icon: "briefcase",
        color: "#1d4ed8", // blue-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
      {
        name: "Creative",
        description:
          "For artists, designers, writers, and other creative professionals to showcase their portfolio and work.",
        icon: "palette",
        color: "#7e22ce", // purple-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
      {
        name: "Gaming",
        description:
          "For gamers, streamers, and esports professionals. Share your gaming achievements and connect with other players.",
        icon: "gamepad",
        color: "#15803d", // green-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
      {
        name: "Academic",
        description:
          "For students, researchers, and educators. Share your academic achievements, research, and educational background.",
        icon: "graduation-cap",
        color: "#b91c1c", // red-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
      {
        name: "Social",
        description:
          "For personal use and social networking. Connect with friends and share your interests and activities.",
        icon: "users",
        color: "#0369a1", // sky-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
      {
        name: "Role-Playing",
        description:
          "For fictional characters, role-playing, and creative writing. Create profiles for your characters.",
        icon: "sparkles",
        color: "#c2410c", // orange-700
        isEnabled: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
        usageCount: 0,
      },
    ]

    const results = []

    for (const category of categories) {
      try {
        const categoryId = await createCategory(category)
        console.log(`✅ Created category: ${category.name} (${categoryId})`)
        results.push({ name: category.name, id: categoryId, success: true })
      } catch (error) {
        console.error(`❌ Failed to create category ${category.name}:`, error)
        results.push({ name: category.name, success: false, error: error.message })
      }
    }

    console.log("\nSeeding summary:")
    console.log(`Total categories: ${categories.length}`)
    console.log(`Successfully created: ${results.filter((r) => r.success).length}`)
    console.log(`Failed: ${results.filter((r) => !r.success).length}`)

    if (results.some((r) => !r.success)) {
      console.log("\nFailed categories:")
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`- ${r.name}: ${r.error}`)
        })
    }

    console.log("\nSeeding completed!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding categories:", error)
    process.exit(1)
  }
}

// Run the seed function
seedCategories()

