import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import NavBarAsideDashboard from "@/components/ui/dashboard/sideBar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-amber-50">
        <NavBarAsideDashboard />
        <main className="flex-1 ml-0 md:ml-20 transition-all duration-300">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

