import { pool } from "@/lib/db";
import { checkSession } from "@/lib/validateLevel";

export async function GET(req, context) {
  const client = await pool.connect();
  const { session, reason } = await checkSession(99);

  if (!session) {
    const status = reason === "no-session" ? 401 : 403;
    const message =
      reason === "no-session" ? "Unauthorized" : "Insufficient permissions";

    return new Response(JSON.stringify({ success: false, message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

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

export async function POST(req, context) {
  const client = await pool.connect();
  const { session, reason } = await checkSession(99);

  if (!session) {
    const status = reason === "no-session" ? 401 : 403;
    const message =
      reason === "no-session" ? "Unauthorized" : "Insufficient permissions";

    return new Response(JSON.stringify({ success: false, message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await context.params;
    const { action_type_id, notes, metadata } = await req.json();

    // Validate required fields
    if (!action_type_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Action type is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert new customer action
    const result = await client.query(
      `INSERT INTO customer_actions 
      (customer_id, action_type_id, notes, metadata) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [id, action_type_id, notes, metadata || null]
    );

    return new Response(
      JSON.stringify({ success: true, data: result.rows[0] }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("POST Error:", error);
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