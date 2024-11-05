import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("token");
  const token = tokenCookie?.value;

  console.log("Token found:", token); // Agrega esto para verificar el token

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error); // Agrega esto para errores de verificación
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configuración de las rutas que serán protegidas
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
