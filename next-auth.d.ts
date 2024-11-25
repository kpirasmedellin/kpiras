import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string; // ID debe ser string para NextAuth
    rol: string;
    nombre: string;
    correo: string;
  }

  interface Session {
    user: {
      id: string;
      rol: string;
      nombre: string;
      correo: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string; // Asegúrate de que el ID sea string
    rol: string;
    nombre: string;
    email: string;
  }
}
