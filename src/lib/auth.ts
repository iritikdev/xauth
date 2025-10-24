import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Credentials({
    credentials:{
      username:{},
      password:{}
    },
    authorize: async (credentials) => {
      const dbUser = {
        id: "1",
        name: "Ritik Sharma",
        email: "AMZ251000001@example.com",
        username: "AMZ251000001",
        password: "1234"
      }
      if(dbUser.username === credentials?.username && dbUser.password === credentials?.password){
        // Return user object conforming to NextAuth User interface
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          username: dbUser.username
        }
      }else{
        return null; // NextAuth expects null for failed auth
      }
    }
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    }
  }
})