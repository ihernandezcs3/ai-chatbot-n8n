/**
 * Database Migration Runner
 * Executes SQL migration scripts to set up database tables
 * Usage: npm run migrate [migration_file]
 */

require("dotenv").config();

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please add DATABASE_URL to your .env file");
    process.exit(1);
  }

  // Get migration file from command line args or use default
  const migrationArg = process.argv[2];
  const migrationsDir = path.join(__dirname, "..", "migrations");

  let migrationFiles = [];

  if (migrationArg) {
    // Run specific migration
    const filePath = path.join(migrationsDir, migrationArg);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Migration file not found: ${migrationArg}`);
      process.exit(1);
    }
    migrationFiles = [migrationArg];
  } else {
    // Run all migrations in order
    migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to database...");
    const testResult = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");
    console.log(`   Server time: ${testResult.rows[0].now}\n`);

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      console.log(`📄 Running migration: ${file}`);

      const migrationSQL = fs.readFileSync(migrationPath, "utf8");
      await pool.query(migrationSQL);

      console.log(`✅ ${file} completed\n`);
    }

    console.log("🎉 All migrations completed successfully!");

    // Verify tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log("\n📊 Current tables:");
    tables.rows.forEach((row) => console.log(`   - ${row.table_name}`));
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.code === "42P07") {
      console.log("💡 Note: Table already exists.");
    }
    process.exit(1);
  } finally {
    await pool.end();
    console.log("\n🔌 Database connection closed");
  }
}

console.log("🚀 Starting database migration...\n");
runMigration();
