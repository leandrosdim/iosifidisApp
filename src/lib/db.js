import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Limits to 20 concurrent connections
  idleTimeoutMillis: 30000, // Closes idle clients after 30 sec
  connectionTimeoutMillis: 2000, // Times out queries after 2 sec
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Database query failed"); // Prevent leaking DB info
  } finally {
    client.release();
  }
}

export { pool };
