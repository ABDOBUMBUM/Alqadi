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
          include: { branch: true }
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
          branchId: employee.branchId,
          branchName: employee.branch?.name || "الرئيسي",
          title: employee.title,
          shift: employee.shift,
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
        token.branchId = (user as any).branchId;
        token.branchName = (user as any).branchName;
        token.title = (user as any).title;
        token.shift = (user as any).shift;
        token.employeeId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).branchId = token.branchId;
        (session.user as any).branchName = token.branchName;
        (session.user as any).title = token.title;
        (session.user as any).shift = token.shift;
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
