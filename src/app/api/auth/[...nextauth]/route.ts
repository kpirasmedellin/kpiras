import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

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
          id: user.id, // ID como número
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol, // Rol personalizado
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de que esto esté presente
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // Asigna ID del usuario
        token.rol = user.rol;   // Asigna rol del usuario
      }
      return token as JWT; // Forzar el tipo de token a JWT personalizado
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,  // Propaga propiedades predeterminadas
        id: token.userId as number, // Asegura tipo correcto para id
        rol: token.rol as string,   // Asegura tipo correcto para rol
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
