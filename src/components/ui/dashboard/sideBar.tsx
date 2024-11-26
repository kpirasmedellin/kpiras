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
import { cn } from "@/app/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  condition?: boolean
}

export default function NavBarAsideDashboard() {
  const { data: session } = useSession()
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
                  isActive && "bg-amber-200 hover:bg-amber-300"
                )}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span>{label}</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center p-4">
        <Image
          width={40}
          height={40}
          src="/isologo.png"
          alt="RestAdmin Logo"
          className="rounded-full"
        />
        <h1 className="font-bold text-lg ml-2">Kpiras</h1>
      </div>

      <div className="flex flex-col items-center mb-6 mt-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/user.jpg" alt={session.user.nombre} />
          <AvatarFallback>{session.user.nombre.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold mt-2">{session.user.nombre}</h3>
        <span className="text-sm text-muted-foreground">
          {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
        </span>
      </div>

      <div className="flex flex-col space-y-2 p-4">
        <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="Mesas" condition={isAdmin || isWaiter} />
        <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="Facturar" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="Cocina" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="Domicilios" condition={isAdmin || isCashier} />
        <NavItem href="/dashboard/sales" icon={RiStackOverflowFill} label="Movimientos" condition={isAdmin} />
        <NavItem href="/dashboard/stadistics" icon={ImStatsDots} label="Estadísticas" condition={isAdmin} />
        <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="Menú" condition={isAdmin} />
        <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="Empleados" condition={isAdmin} />
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <TbLogout2 className="h-5 w-5 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
