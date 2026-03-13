import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { username: credentials.username as string },
        });

        if (!user || !user.password) return null;

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (isPasswordMatch) {
          return {
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            mobile: user.mobile ?? "",
            username: user.username,
            photoUrl: user.photoUrl ?? "", // Changed to empty string to match your .d.ts easier
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string; // Explicitly map ID
        token.username = user.username;
        token.mobile = user.mobile;
        token.photoUrl = user.photoUrl;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // Map from token.id
        session.user.username = token.username as string;
        session.user.mobile = token.mobile as string;
        session.user.photoUrl = token.photoUrl as string;
        session.user.role = token.role as any; // Cast to Role if needed
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  // Important for NextAuth v5
  secret: process.env.NEXTAUTH_SECRET,
});
