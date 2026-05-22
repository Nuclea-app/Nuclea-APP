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
    async signIn({ user }) {
      // Vincular entregas previas al email del usuario (cubre Google + credentials)
      if (user.id && user.email) {
        await prisma.capsuleDelivery.updateMany({
          where: { email: user.email, recipientUserId: null },
          data: { recipientUserId: user.id },
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
