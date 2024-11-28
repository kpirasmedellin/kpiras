import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./auth-provider";


export const metadata: Metadata = {
  title: "Kpiras",
  description: "El sitio de las papas ricas en Medellín",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
