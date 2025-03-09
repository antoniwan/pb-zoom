import type { Db } from "mongodb"
import clientPromise from "../mongodb"
import fs from "fs"
import path from "path"

// Interface for migration metadata
interface MigrationMeta {
  version: number
  name: string
  timestamp: Date
}

// Interface for a migration document in the database
interface MigrationDoc extends MigrationMeta {
  applied: Date
}

// Interface for a migration module
interface Migration {
  up: (db: Db) => Promise<void>
  down: (db: Db) => Promise<void>
}

const MIGRATIONS_COLLECTION = "migrations"

/**
 * Get all available migrations from the migrations directory
 */
async function getAvailableMigrations(): Promise<MigrationMeta[]> {
  const migrationsDir = path.join(process.cwd(), "lib/migrations/scripts")

  // Ensure the directory exists
  if (!fs.existsSync(migrationsDir)) {
    return []
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
    .sort()

  const migrations: MigrationMeta[] = []

  for (const file of files) {
    const match = file.match(/^(\d+)_(.+)\.(js|ts)$/)
    if (match) {
      const [, versionStr, name] = match
      const version = Number.parseInt(versionStr, 10)

      migrations.push({
        version,
        name,
        timestamp: new Date(),
      })
    }
  }

  return migrations
}

/**
 * Get migrations that have been applied to the database
 */
async function getAppliedMigrations(db: Db): Promise<MigrationDoc[]> {
  const collection = db.collection<MigrationDoc>(MIGRATIONS_COLLECTION)

  // Ensure the collection exists with an index
  try {
    await collection.createIndex({ version: 1 }, { unique: true })
  } catch (error) {
    console.warn("Failed to create index on migrations collection", error)
  }

  return collection.find().sort({ version: 1 }).toArray()
}

/**
 * Apply a specific migration
 */
async function applyMigration(db: Db, migration: MigrationMeta): Promise<void> {
  console.log(`Applying migration: ${migration.version}_${migration.name}`)

  try {
    // Import the migration module
    const migrationPath = path.join(
      process.cwd(),
      "lib/migrations/scripts",
      `${migration.version}_${migration.name}.ts`,
    )
    const migrationModule: Migration = require(migrationPath)

    // Apply the up migration
    await migrationModule.up(db)

    // Record the migration in the database
    await db.collection(MIGRATIONS_COLLECTION).insertOne({
      ...migration,
      applied: new Date(),
    })

    console.log(`Migration ${migration.version}_${migration.name} applied successfully`)
  } catch (error) {
    console.error(`Failed to apply migration ${migration.version}_${migration.name}:`, error)
    throw error
  }
}

/**
 * Revert a specific migration
 */
async function revertMigration(db: Db, migration: MigrationDoc): Promise<void> {
  console.log(`Reverting migration: ${migration.version}_${migration.name}`)

  try {
    // Import the migration module
    const migrationPath = path.join(
      process.cwd(),
      "lib/migrations/scripts",
      `${migration.version}_${migration.name}.ts`,
    )
    const migrationModule: Migration = require(migrationPath)

    // Apply the down migration
    await migrationModule.down(db)

    // Remove the migration record from the database
    await db.collection(MIGRATIONS_COLLECTION).deleteOne({ version: migration.version })

    console.log(`Migration ${migration.version}_${migration.name} reverted successfully`)
  } catch (error) {
    console.error(`Failed to revert migration ${migration.version}_${migration.name}:`, error)
    throw error
  }
}

/**
 * Run all pending migrations
 */
export async function migrate(): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  const availableMigrations = await getAvailableMigrations()
  const appliedMigrations = await getAppliedMigrations(db)

  const pendingMigrations = availableMigrations.filter(
    (migration) => !appliedMigrations.some((applied) => applied.version === migration.version),
  )

  if (pendingMigrations.length === 0) {
    console.log("No pending migrations to apply")
    return
  }

  console.log(`Applying ${pendingMigrations.length} pending migrations...`)

  for (const migration of pendingMigrations) {
    await applyMigration(db, migration)
  }

  console.log("All migrations applied successfully")
}

/**
 * Rollback the last applied migration
 */
export async function rollback(): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  const appliedMigrations = await getAppliedMigrations(db)

  if (appliedMigrations.length === 0) {
    console.log("No migrations to rollback")
    return
  }

  const lastMigration = appliedMigrations[appliedMigrations.length - 1]

  console.log(`Rolling back migration: ${lastMigration.version}_${lastMigration.name}`)

  await revertMigration(db, lastMigration)

  console.log("Rollback completed successfully")
}

/**
 * Create a new migration file
 */
export function createMigration(name: string): string {
  const migrationsDir = path.join(process.cwd(), "lib/migrations/scripts")

  // Ensure the migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true })
  }

  // Generate a version number based on the current timestamp
  const version = Date.now()

  // Create a snake_case name
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_")

  const filename = `${version}_${safeName}.ts`
  const filepath = path.join(migrationsDir, filename)

  // Create the migration file with a template
  const template = `import { Db } from 'mongodb';

/**
 * Migration: ${name}
 * 
 * Description: [Add a description of what this migration does]
 */

export async function up(db: Db): Promise<void> {
  // Implement the changes to apply in this migration
  // Example:
  // await db.collection('users').updateMany({}, { $set: { newField: 'default' } });
}

export async function down(db: Db): Promise<void> {
  // Implement how to revert the changes in this migration
  // Example:
  // await db.collection('users').updateMany({}, { $unset: { newField: '' } });
}
`

  fs.writeFileSync(filepath, template)

  console.log(`Created new migration: ${filepath}`)
  return filepath
}

