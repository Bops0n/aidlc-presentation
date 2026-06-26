import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            is_delete: false,
          },
        });

        if (!user || !user.hash_password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hash_password
        );

        if (!isValid) {
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: { last_login_date: new Date() },
        });

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.display_name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          image: user.profile_img,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = parseInt(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
};
