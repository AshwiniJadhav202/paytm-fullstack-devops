import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
pages: {
  signIn: "/signin",
},

  callbacks: {
    async signIn({ user }: any) {
      try {
        if (!user.email) {
          return false;
        }

        await db.merchant.upsert({
          where: {
            email: user.email,
          },
          update: {
            name: user.name,
          },
          create: {
            email: user.email,
            name: user.name,
            auth_type: "Google",
          },
        });

        return true;
      } catch (error) {
        console.error("Merchant database error:", error);
        return false;
      }
    },
  },
};