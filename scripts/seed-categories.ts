import { createCategory } from "../lib/db"

const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "admin"

const seedCategories = async () => {
  try {
    console.log("Seeding profile categories...")

    const categories = [
      {
        name: "Professional",
        description:
          "For work, career, and professional networking. Showcase your skills, experience, and achievements.",
        icon: "briefcase",
        color: "#1d4ed8", // blue-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
      {
        name: "Creative",
        description:
          "For artists, designers, writers, and other creative professionals to showcase their portfolio and work.",
        icon: "palette",
        color: "#7e22ce", // purple-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
      {
        name: "Gaming",
        description:
          "For gamers, streamers, and esports professionals. Share your gaming achievements and connect with other players.",
        icon: "gamepad",
        color: "#15803d", // green-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
      {
        name: "Academic",
        description:
          "For students, researchers, and educators. Share your academic achievements, research, and educational background.",
        icon: "graduation-cap",
        color: "#b91c1c", // red-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
      {
        name: "Social",
        description:
          "For personal use and social networking. Connect with friends and share your interests and activities.",
        icon: "users",
        color: "#0369a1", // sky-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
      {
        name: "Role-Playing",
        description:
          "For fictional characters, role-playing, and creative writing. Create profiles for your characters.",
        icon: "sparkles",
        color: "#c2410c", // orange-700
        isEnabled: true,
        isCorrect: true,
        isOfficial: true,
        createdBy: ADMIN_USER_ID,
      },
    ]

    for (const category of categories) {
      const categoryId = await createCategory(category)
      console.log(`Created category: ${category.name} (${categoryId})`)
    }

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding categories:", error)
  }
}

// Run the seed function
seedCategories()

