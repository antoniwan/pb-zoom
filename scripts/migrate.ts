import { migrate, rollback, createMigration } from "../lib/migrations"

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case "up":
      await migrate()
      break
    case "down":
      await rollback()
      break
    case "create":
      const name = args[1]
      if (!name) {
        console.error("Please provide a name for the migration")
        process.exit(1)
      }
      createMigration(name)
      break
    default:
      console.log(`
Migration CLI

Commands:
  up                  Run all pending migrations
  down                Rollback the most recent migration
  create [name]       Create a new migration file
      `)
      break
  }

  process.exit(0)
}

main().catch((error) => {
  console.error("Migration error:", error)
  process.exit(1)
})

