import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: { strategy: "jwt" },
  ...authConfig,
  logger: {
    error(code, ...message) {
      console.error("❌ AUTH ERROR:", code, message);
    },
    warn(code, ...message) {
      console.warn("⚠️ AUTH WARN:", code, message);
    },
    debug(code, ...message) {
      console.log("🔵 AUTH DEBUG:", code, message);
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
