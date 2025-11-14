import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import {pool} from "@/lib/db";
import { signOut } from "next-auth/react";

const authOptions = {
  session: {
    strategy: "jwt",
    jwt: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/login",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //connect to db
        const client = await pool.connect();

        //find user in db
        const userData = await client.query(
          "SELECT * FROM users WHERE username = $1",
          [credentials.username]
        );
        console.log('kalos irthate');

        //check if the user exists
        if (!userData || userData.rowCount === 0) {
          console.error("api/auth/[nextauth]: No user found!");
          throw new Error("No user found!");
        }

        //pass the value of row[0] to the user . Εάν κανω console.log(userData) ΠΙΟ ΠΑΝΩ θα δω ότι μου γυρνάει ένα τεράστιο object. Αν δεν βρει user γυρνάει πάλι μηδενικό object οπότε γιαυτό χρησιμοποιώ τις γραμμές.
        const user = userData.rows[0];
        console.log("user",user);

        //check if the password is valid
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          console.error("api/auth/[nextauth]: Invalid password");
          throw new Error("Invalid password by ...nextauth");
        }
        client.release();
        // Include user information in JWT token
        return user;
      },
    }),
  ],

  // Βάζω σε σχόλια τα callbacks. Πιθανόν να τα χρειαστούμε στο μέλλον!
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token.user;
      return session;
    },
  },
};

//export default NextAuth(authOptions);


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions }
//export { handler as GET, handler as POST }

