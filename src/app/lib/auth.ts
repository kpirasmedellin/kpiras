import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import  prisma  from '@/app/lib/prisma';
import { JWT } from "next-auth/jwt";

// Define una interfaz explícita para el usuario
interface AuthUser {
  id: string; // Cambiado de number a string
  nombre: string;
  correo: string;
  rol: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(
        credentials: Record<"correo" | "contrasena", string> | undefined
      ): Promise<AuthUser | null> {
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
          id: user.id.toString(), // Convertir el ID a string
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
    async jwt({ token, user }: { token: JWT; user?: AuthUser }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          nombre: user.nombre,
          email: user.correo,
          userId: user.id,
          rol: user.rol,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user = {
        ...session.user,
        id: token.userId as string,
        nombre: token.nombre as string,
        email: token.email as string,
        rol: token.rol as string,
      };
      return session;
    },
  },
};
