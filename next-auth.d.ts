import NextAuth, { DefaultSession } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      mobile: string
      photoUrl: string | null; // Allow null to match Prisma
      expiresAt?: number;
      // role: Role; // Use the actual Enum type from Prisma
    } & DefaultSession["user"]
  }

  interface User {
    // id is already in DefaultUser, but we can override it
    username: string
    mobile: string
    photoUrl: string | null;
    expiresAt?: number;
    // role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    username: string
    mobile: string
    photoUrl: string | null;
    expiresAt?: number;
    // role: Role;
  }
}