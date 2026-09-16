import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },

        password: {
          label: "Password",
          type: "password",
        },

        name: {
          label: "Name",
          type: "text",
        },
      },

      async authorize(credentials: any) {
        console.log("========== AUTHORIZE DEBUG ==========");

        console.log("Phone received:", credentials?.phone);

        console.log(
          "Password received:",
          credentials?.password ? "YES" : "NO"
        );

        // Check phone and password
        if (!credentials?.phone || !credentials?.password) {
          console.log("ERROR: Phone or password missing");
          return null;
        }

        try {
          console.log("STEP 1: Connecting to database...");

          // Find existing user in PostgreSQL
          const existingUser = await db.user.findFirst({
            where: {
              number: credentials.phone,
            },
          });

          console.log("STEP 2: Database query completed");

          console.log(
            "User found:",
            existingUser ? "YES" : "NO"
          );

          // ==========================================
          // EXISTING USER → LOGIN
          // ==========================================

          if (existingUser) {
            console.log("STEP 3: Existing user login");

            console.log("User ID:", existingUser.id);

            console.log("User number:", existingUser.number);

            console.log(
              "Password hash exists:",
              existingUser.password ? "YES" : "NO"
            );

            // Compare entered password with stored bcrypt password
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );

            console.log(
              "Password correct:",
              passwordValidation
            );

            if (passwordValidation) {
              console.log("========== LOGIN SUCCESS ==========");

              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.number,
              };
            }

            console.log("========== LOGIN FAILED ==========");
            console.log("Reason: Wrong password");

            return null;
          }

          // ==========================================
          // NEW USER → SIGNUP
          // ==========================================

          console.log(
            "STEP 3: User does not exist. Creating new user..."
          );

          const hashedPassword = await bcrypt.hash(
            credentials.password,
            10
          );

          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
              name: credentials.name || null,
            },
          });

          console.log(
            "NEW USER CREATED:",
            user.id
          );

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };

        } catch (error) {
          console.error(
            "========== AUTHORIZE ERROR =========="
          );

          console.error(error);

          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // ==========================================
  // NEXTAUTH PAGES
  // ==========================================

  pages: {
    signIn: "/signin",
  },

  // ==========================================
  // NEXTAUTH CALLBACKS
  // ==========================================

  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};