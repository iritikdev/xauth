import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Credentials({
    credentials:{
      email:{},
      password:{}
    },
    authorize: async (credentials) => {
      const dbUser = {
        email : "iritikdev@gmail.com",
        password : "1234"
      }
      if(dbUser.email === credentials?.email && dbUser.password === credentials?.password){
        return dbUser
      }else{
        throw new Error("Invalid email or password");
      }
    }
  })],
})