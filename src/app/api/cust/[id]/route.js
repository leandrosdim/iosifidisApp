import { pool } from "@/lib/db";

export async function GET(req, context) {
  const client = await pool.connect();

  try {
    const { id } = await context.params; // ✅ Await the params object

    const result = await client.query("SELECT * FROM cust WHERE id = $1", [id]);

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
  
    try {
      const { id } = await context.params; 
      const { name, age, email, phone, active, startedYear,comments } = await req.json();
  
      await client.query("BEGIN");
  
      const updateResult = await client.query(
        `UPDATE cust 
         SET name = $1, age = $2, email = $3, phone = $4, active = $5, "startedYear"=$6, comments=$8
         WHERE id = $7`,
        [name, age, email, phone, active, startedYear, id, comments]
      );
  
      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return new Response(JSON.stringify({ success: false, message: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      await client.query("COMMIT");
  
      return new Response(JSON.stringify({ success: true, message: "User updated successfully" }), {
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
  
    try {
      const { id } = await context.params;
  
      await client.query("BEGIN");
  
      const result = await client.query("DELETE FROM cust WHERE id = $1", [id]);
  
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
  
