import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";

import { PrismaAdapter } from "@/app/lib/auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        },
      },
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: "",
          email: profile.email,
          avatar_url: profile.picture,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (
        account?.scope &&
        !account.scope.includes("https://www.googleapis.com/auth/calendar")
      ) {
        return "/register/connect-calendar?error=permissions";
      }

      return true; // Login bem-sucedido
    },

    async session({ session, user }) {
      return { ...session, user };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
