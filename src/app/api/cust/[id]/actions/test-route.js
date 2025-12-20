// Test API endpoint without authentication for development
import { pool } from "@/lib/db";

export async function GET(req, context) {
  const client = await pool.connect();

  try {
    const { id } = await context.params;

    // Fetch customer actions with action type information
    const result = await client.query(
      `SELECT 
        ca.id,
        ca.customer_id,
        ca.action_type_id,
        at.name as action_type,
        ca.timestamp,
        ca.notes,
        ca.metadata,
        ca.created_at
      FROM customer_actions ca
      JOIN action_types at ON ca.action_type_id = at.id
      WHERE ca.customer_id = $1
      ORDER BY ca.timestamp DESC`,
      [id]
    );

    return new Response(
      JSON.stringify({ success: true, data: result.rows }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("GET Error:", error);

    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    client.release();
  }
}