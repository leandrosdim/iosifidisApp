import { pool } from "@/lib/db";

export async function GET(req, context) {
  const client = await pool.connect();

  try {

    const result = await client.query('SELECT * FROM cust ORDER BY active,id, name, "startedYear"');

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ success: false, message: "Customer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: result.rows }), {
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

export async function POST(req) {
  const client = await pool.connect();

  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ success: false, message: "Name is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      `INSERT INTO customers (lastname) VALUES ($1) RETURNING *`,
      [name.trim()]
    );

    return new Response(JSON.stringify({ success: true, data: result.rows[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    client.release();
  }
}
