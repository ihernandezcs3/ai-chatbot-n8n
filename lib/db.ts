import { Pool, PoolClient, QueryResult } from "pg";

// Global type for caching the pool in development
declare global {
  var postgresPool: Pool | undefined;
}

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 */
export function getPool(): Pool {
  // In development, use global variable to prevent multiple pools during HMR
  if (process.env.NODE_ENV === "development") {
    if (global.postgresPool) {
      return global.postgresPool;
    }
  }

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
      // Don't exit process on idle client error, just log it
      // process.exit(-1);
    });

    console.log("✅ PostgreSQL connection pool created");

    // Cache in global for development
    if (process.env.NODE_ENV === "development") {
      global.postgresPool = pool;
    }
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
  const currentPool = process.env.NODE_ENV === "development" ? global.postgresPool : pool;

  if (currentPool) {
    await currentPool.end();
    pool = null;
    if (process.env.NODE_ENV === "development") {
      global.postgresPool = undefined;
    }
    console.log("✅ PostgreSQL connection pool closed");
  }
}
