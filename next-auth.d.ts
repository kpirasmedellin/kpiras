import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number; // Personalización del ID
    rol: string; // Rol del usuario
  }

  interface Session {
    user: {
      id: number;
      rol: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    userId: number; // Añade ID del usuario al token JWT
    rol: string;    // Añade rol del usuario al token JWT
  }
}
