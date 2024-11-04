import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

async function generateUserId(userId: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(userId);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)).slice(0, 8);
  const base64url = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64url;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const userId = token.sub as string;
      session.userId = await generateUserId(userId);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    verifyRequest: "/login",
  },
});
