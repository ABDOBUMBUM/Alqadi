import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "بوابة الموظفين",
      credentials: {
        username: { label: "اسم المستخدم", type: "text" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("يرجى إدخال اسم المستخدم وكلمة المرور");
        }

        const employee = await prisma.employee.findUnique({
          where: { username: credentials.username },
        });

        if (!employee || !employee.active) {
          throw new Error("اسم المستخدم غير صحيح أو الحساب معطّل");
        }

        const isValid = await compare(credentials.password, employee.password);
        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email || employee.username,
          role: employee.role,
          branch: employee.branch,
          title: employee.title,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.branch = (user as any).branch;
        token.title = (user as any).title;
        token.employeeId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).branch = token.branch;
        (session.user as any).title = token.title;
        (session.user as any).employeeId = token.employeeId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/portal/login",
    error: "/portal/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
