import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req) {
  const client = await pool.connect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { firstname, lastname, email, phone } = await req.json();

    // Validate input
    if (!firstname || !lastname || !email || !phone) {
      return new Response(JSON.stringify({ success: false, message: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Start transaction
    await client.query("BEGIN");

    // Update user profile in the database
    await client.query(
      "UPDATE users SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE username = $5",
      [firstname, lastname, email, phone, session.user.username]
    );

    // Commit transaction
    await client.query("COMMIT");

    return new Response(JSON.stringify({ success: true, message: "Profile updated successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    await client.query("ROLLBACK"); // Rollback changes if an error occurs
    console.error("Profile Update Error:", error);

    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  } finally {
    client.release();
  }
}
