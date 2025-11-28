// src/lib/checkSession.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Checks for a valid session and that session.user.level > minLevel.
 * 
 * @param {number} minLevel - minimum required user level (exclusive).
 * @returns {Promise<{ session: any | null, reason: "no-session" | "low-level" | null }>}
 */
export async function checkSession(minLevel = 0) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { session: null, reason: "no-session" };
  }

  const rawLevel = session.user?.level ?? 0;
  console.log('rawlevel', rawLevel);
  const userLevel =
    typeof rawLevel === "number" ? rawLevel : parseInt(rawLevel, 10) || 0;

  // you asked: session.user.level > param
  if (userLevel <= minLevel) {
    return { session: null, reason: "low-level" };
  }

  return { session, reason: null };
}
