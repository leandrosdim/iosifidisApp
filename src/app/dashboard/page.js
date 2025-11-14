import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <p>Unauthorized. Please <a href="/users/login">log in</a>.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user.username}!</h1>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}
