import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: { username: credentials?.username as string },
        });
        if (!user) return null;
        // Make sure `user` exists and has the expected properties before returning.
        const isPasswordMatch = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );
        if (user.username === credentials?.username && isPasswordMatch) {
          // Return a user object that definitely has a string `id` (no undefined).
          return {
            id: user.id,
            name: user.name as string,
            email: user.email as string,
            username: user.username as string,
          };
        }

        // Auth failed
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },
  },
});
