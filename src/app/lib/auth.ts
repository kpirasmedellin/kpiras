import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from '@/app/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { correo, contrasena } = credentials;

        const user = await prisma.user.findUnique({
          where: { correo },
        });

        if (!user || user.estado === "DESACTIVADO") {
          throw new Error("Usuario desactivado o credenciales inválidas");
        }

        const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

        if (!isValidPassword) {
          throw new Error("Credenciales inválidas");
        }

        return {
          id: user.id, 
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          userId: Number(user.id),
          rol: user.rol,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.userId);
        session.user.rol = token.rol;
      }
      return session;
    },
  },
};