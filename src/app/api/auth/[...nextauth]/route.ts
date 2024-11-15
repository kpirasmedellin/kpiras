import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

const prisma = new PrismaClient();

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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User | AdapterUser; account?: any }) {
      if (user) {
        token.userId = user.id; // Asigna ID
        token.rol = (user as User).rol || ''; // Asigna rol si está disponible
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        ...session.user,
        id: token.userId,
        rol: token.rol,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
