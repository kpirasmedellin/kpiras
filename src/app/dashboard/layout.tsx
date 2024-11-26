import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Ajusta la ruta si es necesario
import { redirect } from "next/navigation";
import NavBarAsideDashboard from "@/components/ui/dashboard/sideBar";

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex-none h-full overflow-y-auto absolute z-[500] lg:relative lg:z-auto">
        <NavBarAsideDashboard />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto ml-0 lg:ml-0 relative">
        <div>{children}</div>
      </main>
    </div>
  );
}
