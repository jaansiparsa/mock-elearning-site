import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
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

        const user = (await db.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            role: true,
          },
        })) as {
          id: string;
          email: string | null;
          firstName: string;
          lastName: string;
          password: string | null;
          role: string;
        } | null;

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub ?? "",
        role: (token as { role?: string }).role ?? "student",
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        (token as { role?: string }).role = (user as { role?: string }).role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
