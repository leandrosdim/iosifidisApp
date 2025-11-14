import { hashPassword } from "@/lib/auth";
import { pool } from "@/lib/db"; // Import `pool` instead of `query`

export async function POST(req) {
  const client = await pool.connect(); // Start a new DB connection

  try {
    const { username, password, firstName, lastName } = await req.json();

    // Start transaction
    await client.query("BEGIN");

    // Check if user exists
    const existingUser = await client.query("SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)", [username]);

    if (existingUser.rows[0].exists) {
      await client.query("ROLLBACK"); // Rollback changes if user exists
      return new Response(JSON.stringify({ success: false, message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password before inserting
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    await client.query("INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)", 
                        [username, hashedPassword, firstName, lastName]);

    // Commit transaction
    await client.query("COMMIT");

    return new Response(JSON.stringify({ success: true, message: "User created successfully!" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    await client.query("ROLLBACK"); // Rollback changes if an error occurs
    console.error("Signup Error:", error);

    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  } finally {
    client.release(); // Always release the client
  }
}
