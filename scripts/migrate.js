/**
 * Database Migration Runner
 * Executes SQL migration scripts to set up the conversations table
 */

// Load environment variables from .env file
require("dotenv").config();

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  // Get database URL from environment
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please add DATABASE_URL to your .env file");
    process.exit(1);
  }

  // Create database connection
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
  });

  try {
    console.log("🔌 Connecting to database...");

    // Test connection
    const testResult = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");
    console.log(`   Server time: ${testResult.rows[0].now}`);

    // Read migration file
    const migrationPath = path.join(__dirname, "..", "migrations", "001_create_conversations.sql");
    console.log(`\n📄 Reading migration file: ${migrationPath}`);

    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("⚙️  Executing migration...\n");

    // Execute migration
    await pool.query(migrationSQL);

    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Verifying table creation...");

    // Verify table exists
    const verifyResult = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'conversations'
      ORDER BY ordinal_position
    `);

    if (verifyResult.rows.length > 0) {
      console.log("✅ Conversations table created with columns:");
      verifyResult.rows.forEach((row) => {
        console.log(`   - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log("⚠️  Warning: Could not verify table creation");
    }

    console.log("\n🎉 Database setup complete!");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error.message);

    if (error.code === "42P07") {
      console.log("\n💡 Note: Table already exists. This is normal if you've run the migration before.");
    }

    process.exit(1);
  } finally {
    await pool.end();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration
console.log("🚀 Starting database migration...\n");
runMigration();
