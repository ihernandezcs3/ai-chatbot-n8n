/**
 * Database Diagnostic Script
 * Checks the current state of the database and available tables
 */

// Load environment variables from .env file
require("dotenv").config();

const { Pool } = require("pg");

async function diagnose() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔍 Running database diagnostics...\n");

    // Test connection
    console.log("1️⃣  Testing connection...");
    const testResult = await pool.query("SELECT NOW()");
    console.log("✅ Connected successfully");
    console.log(`   Server time: ${testResult.rows[0].now}\n`);

    // Check current database and schema
    console.log("2️⃣  Checking current database and schema...");
    const dbInfo = await pool.query("SELECT current_database(), current_schema()");
    console.log(`✅ Database: ${dbInfo.rows[0].current_database}`);
    console.log(`   Schema: ${dbInfo.rows[0].current_schema}\n`);

    // List all schemas
    console.log("3️⃣  Available schemas:");
    const schemas = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema_name
    `);
    schemas.rows.forEach((row) => {
      console.log(`   - ${row.schema_name}`);
    });
    console.log("");

    // Check if conversations table exists in any schema
    console.log('4️⃣  Searching for "conversations" table in all schemas...');
    const tableSearch = await pool.query(`
      SELECT table_schema, table_name, table_type
      FROM information_schema.tables
      WHERE table_name = 'conversations'
    `);

    if (tableSearch.rows.length > 0) {
      console.log("✅ Found conversations table:");
      tableSearch.rows.forEach((row) => {
        console.log(`   Schema: ${row.table_schema}`);
        console.log(`   Table: ${row.table_name}`);
        console.log(`   Type: ${row.table_type}`);
      });
    } else {
      console.log('❌ Table "conversations" NOT FOUND in any schema');
    }
    console.log("");

    // List all tables in public schema
    console.log('5️⃣  Tables in "public" schema:');
    const publicTables = await pool.query(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (publicTables.rows.length > 0) {
      publicTables.rows.forEach((row) => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    } else {
      console.log("   No tables found in public schema");
    }
    console.log("");

    // Check search_path
    console.log("6️⃣  Current search_path:");
    const searchPath = await pool.query("SHOW search_path");
    console.log(`   ${searchPath.rows[0].search_path}\n`);

    // Try to describe conversations table if it exists
    const conversationsCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'conversations'
      ORDER BY ordinal_position
    `);

    if (conversationsCheck.rows.length > 0) {
      console.log("7️⃣  Conversations table structure:");
      conversationsCheck.rows.forEach((row) => {
        console.log(`   - ${row.column_name}: ${row.data_type} ${row.is_nullable === "NO" ? "NOT NULL" : "NULLABLE"}`);
      });
    } else {
      console.log("7️⃣  Could not retrieve conversations table structure");
    }

    console.log("\n✅ Diagnostic complete!");
  } catch (error) {
    console.error("\n❌ Diagnostic failed:");
    console.error(error.message);
    console.error("\nFull error:", error);
  } finally {
    await pool.end();
  }
}

diagnose();
