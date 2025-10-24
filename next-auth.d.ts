import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string
      email?: string
      image?: string
      username: string // ✅ Add this
    }
  }

  interface User {
    id: string
    name?: string
    email?: string
    username: string // ✅ Add this
  }

  interface JWT {
    username: string // ✅ Add this if you're using JWT strategy
  }
}

