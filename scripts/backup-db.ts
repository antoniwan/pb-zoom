import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

async function backupDatabase() {
  try {
    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    // Generate timestamp for the backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(backupDir, `backup-${timestamp}.gz`)

    // Get MongoDB URI from environment
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    // Parse MongoDB URI to get database name
    const dbName = mongoUri.split("/").pop()?.split("?")[0]
    if (!dbName) {
      throw new Error("Could not parse database name from MongoDB URI")
    }

    console.log(`🔄 Backing up database ${dbName}...`)

    // Execute mongodump command
    const { stdout, stderr } = await execAsync(`mongodump --uri="${mongoUri}" --archive="${backupFile}" --gzip`)

    if (stderr && !stderr.includes("done dumping")) {
      console.warn("Warning during backup:", stderr)
    }

    console.log(`✅ Database backup completed: ${backupFile}`)
    console.log(stdout)

    return backupFile
  } catch (error) {
    console.error("❌ Database backup failed:", error)
    throw error
  }
}

// Run the backup if this script is executed directly
if (require.main === module) {
  backupDatabase()
    .then((backupFile) => {
      console.log(`🎉 Backup saved to: ${backupFile}`)
      process.exit(0)
    })
    .catch((error) => {
      console.error("Backup failed:", error)
      process.exit(1)
    })
}

export default backupDatabase

