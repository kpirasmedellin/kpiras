import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Ajusta la ruta si es necesario
import { redirect } from "next/navigation";
import NavBarAsideDashboard from "@/components/ui/dashboard/sideBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kpiras",
  description: "El sitio de las papas ricas en Medellín",
};
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
    <div className="flex h-screen w-full justify-end">
      {/* Sidebar */}
      <aside className="flex-none h-full overflow-y-auto absolute z-[500] lg:relative lg:z-auto">
        <NavBarAsideDashboard />
      </aside>

      {/* Main content */}
      <main className="w-full lg:w-[95%]">
        <div>{children}</div>
      </main>
    </div>
  );
}
