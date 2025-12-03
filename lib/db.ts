import { Pool, PoolClient, QueryResult } from "pg";

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    pool = new Pool({
      connectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection not established
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
      },
    });

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
      process.exit(-1);
    });

    console.log("✅ PostgreSQL connection pool created");
  }

  return pool;
}

/**
 * Execute a query with automatic connection handling
 */
export async function query<T extends Record<string, any> = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    console.log("📊 Query executed", {
      text: text.substring(0, 100),
      duration: `${duration}ms`,
      rows: result.rowCount,
    });

    return result;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  const client = await pool.connect();
  return client;
}

/**
 * Close the pool (typically only needed for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✅ PostgreSQL connection pool closed");
  }
}
