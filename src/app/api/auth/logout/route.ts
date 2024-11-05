import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Eliminar la cookie 'token' configurándola con maxAge: 0
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expirar la cookie inmediatamente
    path: "/",
  });

  return response;
}
