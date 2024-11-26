'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { MdTableRestaurant, MdDeliveryDining } from 'react-icons/md'
import { RiStackOverflowFill } from 'react-icons/ri'
import { ImStatsDots } from 'react-icons/im'
import { BiSolidFoodMenu } from 'react-icons/bi'
import { FaPeopleRobbery, FaKitchenSet, FaFileInvoiceDollar } from 'react-icons/fa6'
import { HiComputerDesktop } from 'react-icons/hi2'
import { TbLogout2 } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/app/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  condition?: boolean
}

export default function NavBarAsideDashboard() {
  const { data: session } = useSession()
  const { isOpen, isMobile } = useSidebar()
  const pathname = usePathname()

  if (!session) return null

  const isAdmin = session.user.rol === 'ADMINISTRADOR'
  const isCashier = session.user.rol === 'CAJERO'
  const isWaiter = session.user.rol === 'MESERO'

  const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, condition = true }) => {
    if (!condition) return null
  
    const isActive = pathname === href
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isOpen ? 'px-4' : 'px-2',
                  isActive && "bg-amber-200 hover:bg-amber-300"
                )}
              >
                <Icon className={cn("h-5 w-5", isOpen ? 'mr-2' : 'mx-auto')} />
                {isOpen && <span>{label}</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {!isOpen && !isMobile && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={cn(
          "flex items-center",
          isOpen ? "space-x-2" : "justify-center"
        )}>
          <Image
            width={40}
            height={40}
            src="/isologo.png"
            alt="RestAdmin Logo"
            className="rounded-full"
          />
          {isOpen && <h1 className="font-bold text-lg">Kpiras</h1>}
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      {(isOpen || !isMobile) && (
        <div className={cn(
          "flex flex-col items-center mb-6 mt-2",
          !isOpen && "scale-75"
        )}>
          <Avatar className="h-16 w-16">
            <AvatarImage src="/user.jpg" alt={session.user.nombre} />
            <AvatarFallback>{session.user.nombre.charAt(0)}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <>
              <h3 className="font-semibold mt-2">{session.user.nombre}</h3>
              <span className="text-sm text-muted-foreground">
                {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
              </span>
            </>
          )}
        </div>
      )}

      <SidebarContent>
        <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="Mesas" condition={isAdmin || isWaiter} />
        <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="Facturar" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="Cocina" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="Domicilios" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/sales" icon={RiStackOverflowFill} label="Movimientos" condition={isAdmin} />
        <NavItem href="/dashboard/stadistics" icon={ImStatsDots} label="Estadísticas" condition={isAdmin} />
        <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="Menú" condition={isAdmin} />
        <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="Empleados" condition={isAdmin} />
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            !isOpen && "px-2"
          )}
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <TbLogout2 className={cn("h-5 w-5", isOpen && "mr-2")} />
          {isOpen && 'Cerrar sesión'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

