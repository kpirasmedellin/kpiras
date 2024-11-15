import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Ajusta la ruta si es necesario
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Panel de Control</h1>
      <main>{children}</main>
    </div>
  );
}
