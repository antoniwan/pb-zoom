import { connectToDatabase } from "../lib/mongodb"
import { migrate } from "../lib/migrations"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...")

    // Step 1: Connect to the database
    console.log("\n📡 Connecting to MongoDB...")
    await connectToDatabase()
    console.log("✅ Connected to MongoDB")

    // Step 2: Run migrations
    console.log("\n🔄 Running database migrations...")
    const migrationResult = await migrate()
    console.log(`✅ Applied ${migrationResult.appliedCount} migrations`)

    // Step 3: Seed categories
    console.log("\n🌱 Seeding initial data...")
    await execAsync("npx tsx scripts/seed-categories.ts")

    console.log("\n🎉 Database initialization complete!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

// Run the initialization
initializeDatabase()

