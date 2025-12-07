import { pool } from "@/lib/db";
import { checkSession } from "@/lib/validateLevel";
//check

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
    const { firstname, lastname, phone01, phone02, email, comments } = await req.json();

    if (!firstname || firstname.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "First name is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!lastname || lastname.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Last name is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!email || email.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await client.query(
      `INSERT INTO customers (firstname, lastname, phone01, phone02, email, comments, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [firstname.trim(), lastname.trim(), phone01, phone02, email.trim(), comments, 1]
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
