import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import readline from "readline"

const execAsync = promisify(exec)

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Promisify readline question
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function restoreDatabase(backupFile?: string) {
  try {
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

    // If no backup file is provided, list available backups
    if (!backupFile) {
      const backupDir = path.join(process.cwd(), "backups")
      if (!fs.existsSync(backupDir)) {
        throw new Error("Backups directory does not exist")
      }

      const backups = fs
        .readdirSync(backupDir)
        .filter((file) => file.endsWith(".gz"))
        .sort((a, b) => {
          // Sort by creation time, newest first
          return (
            fs.statSync(path.join(backupDir, b)).mtime.getTime() - fs.statSync(path.join(backupDir, a)).mtime.getTime()
          )
        })

      if (backups.length === 0) {
        throw new Error("No backup files found")
      }

      console.log("Available backups:")
      backups.forEach((file, index) => {
        const stats = fs.statSync(path.join(backupDir, file))
        console.log(`${index + 1}. ${file} (${new Date(stats.mtime).toLocaleString()})`)
      })

      const answer = await question("Enter the number of the backup to restore (or 'q' to quit): ")
      if (answer.toLowerCase() === "q") {
        console.log("Restoration cancelled")
        rl.close()
        return
      }

      const backupIndex = Number.parseInt(answer) - 1
      if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backups.length) {
        throw new Error("Invalid backup selection")
      }

      backupFile = path.join(backupDir, backups[backupIndex])
    }

    // Confirm restoration
    const confirm = await question(
      `⚠️ WARNING: This will overwrite the current database (${dbName}).\n` +
        `Are you sure you want to restore from ${backupFile}? (yes/no): `,
    )

    if (confirm.toLowerCase() !== "yes") {
      console.log("Restoration cancelled")
      rl.close()
      return
    }

    console.log(`🔄 Restoring database ${dbName} from ${backupFile}...`)

    // Execute mongorestore command
    const { stdout, stderr } = await execAsync(
      `mongorestore --uri="${mongoUri}" --gzip --archive="${backupFile}" --drop`,
    )

    if (stderr && !stderr.includes("done")) {
      console.warn("Warning during restoration:", stderr)
    }

    console.log(`✅ Database restoration completed`)
    console.log(stdout)

    rl.close()
  } catch (error) {
    console.error("❌ Database restoration failed:", error)
    rl.close()
    throw error
  }
}

// Run the restoration if this script is executed directly
if (require.main === module) {
  restoreDatabase(process.argv[2])
    .then(() => {
      console.log("🎉 Restoration process completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Restoration failed:", error)
      process.exit(1)
    })
}

export default restoreDatabase

