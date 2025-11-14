import { pool } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { oldPassword, newPassword } = await req.json();
    const client = await pool.connect();

    try {
      // Fetch current password from the database
      const userData = await client.query("SELECT password FROM users WHERE username = $1", [session.user.username]);

      if (userData.rowCount === 0) {
        return new Response(JSON.stringify({ success: false, message: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const hashedCurrentPassword = userData.rows[0].password;

      // Verify old password
      const isPasswordValid = await verifyPassword(oldPassword, hashedCurrentPassword);
      if (!isPasswordValid) {
        return new Response(JSON.stringify({ success: false, message: "Incorrect old password" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password in the database
      await client.query("UPDATE users SET password = $1 WHERE username = $2", [hashedNewPassword, session.user.username]);

      return new Response(JSON.stringify({ success: true, message: "Password updated successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Password Update Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
