import { pool } from "@/lib/db";
import { checkSession } from "@/lib/validateLevel"; // Added for session check

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

    const result = await client.query("SELECT * FROM customers WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ success: false, message: "Customer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("GET Error:", error);

    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  } finally {
    client.release();
  }
}


export async function PUT(req, context) {
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
      const { id } = await context.params; 
      const { firstname, lastname, phone01, phone02, email, active, comments } = await req.json(); // Updated fields
  
      await client.query("BEGIN");
  
      const updateResult = await client.query(
        `UPDATE customers
         SET firstname = $1, lastname = $2, phone01 = $3, phone02 = $4, email = $5, active = $6, comments = $7
         WHERE id = $8`,
        [firstname, lastname, phone01, phone02, email, active, comments, id] // Updated parameters
      );
  
      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return new Response(JSON.stringify({ success: false, message: "Customer not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      await client.query("COMMIT");
  
      return new Response(JSON.stringify({ success: true, message: "Customer updated successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("PUT Error:", error);
  
      return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
  
    } finally {
      client.release();
    }
  }

export async function DELETE(req, context) {
    const client = await pool.connect();
    const { session, reason } = await checkSession(99); // Added for session check

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
      const { id } = await context.params;
  
      await client.query("BEGIN");
  
      const result = await client.query("DELETE FROM customers WHERE id = $1", [id]); // Changed table name
  
      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return new Response(JSON.stringify({ success: false, message: "Customer not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      await client.query("COMMIT");
  
      return new Response(JSON.stringify({ success: true, message: "Customer deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("DELETE Error:", error);
  
      return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
  
    } finally {
      client.release();
    }
  }
