import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
 
const prisma = new PrismaClient()
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({token}){
      console.log("JWT Callback", token);
      return token;
    },
    async session({session, token}) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }
      console.log("Session Callback", session);
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})