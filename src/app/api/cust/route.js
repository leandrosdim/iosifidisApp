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
    const result = await client.query("SELECT * FROM customers");

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result.rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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

export async function POST(req) {
  const client = await pool.connect();
  const { session, reason } = await checkSession(99);
  console.log("session ", session);

  if (!session) {
    const status = reason === "no-session" ? 401 : 403;
    const message =
      reason === "no-session" ? "Unauthorized" : "Insufficient permissions";

    return new Response(JSON.stringify({ success: false, message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (reason == "low-level") {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized..." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Name is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await client.query(
      `INSERT INTO customers (lastname) VALUES ($1) RETURNING *`,
      [name.trim()]
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
