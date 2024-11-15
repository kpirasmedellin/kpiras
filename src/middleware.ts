import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirige a la página de inicio de sesión si no está autenticado
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Especifica las rutas que deben protegerse
};
