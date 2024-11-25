'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MdTableRestaurant, MdDeliveryDining } from 'react-icons/md'
import { RiStackOverflowFill } from 'react-icons/ri'
import { ImStatsDots } from 'react-icons/im'
import { BiSolidFoodMenu } from 'react-icons/bi'
import { FaPeopleRobbery, FaKitchenSet, FaFileInvoiceDollar } from 'react-icons/fa6'
import { HiComputerDesktop } from 'react-icons/hi2'
import { TbLogout2 } from "react-icons/tb"
import { GiKnifeFork, GiForkKnifeSpoon } from "react-icons/gi"
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

const SkeletonLoader = () => (
  <div className="flex items-center justify-center h-screen bg-amber-50">
    <div className="w-32 h-32 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function NavBarAsideDashboard() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setIsOpen(!isMobileView)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <SkeletonLoader />
      </div>
    )
  }

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
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors",
                  isOpen ? 'px-4' : 'px-2',
                  isActive
                    ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                    : "hover:bg-amber-100 hover:text-amber-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isOpen ? 'mr-2' : 'mx-auto')} />
                {isOpen && <span>{label}</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  }

  const toggleNavbar = () => setIsOpen(!isOpen)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: isOpen ? 256 : (isMobile ? 64 : 80) }}
        animate={{ width: isOpen ? 256 : (isMobile ? 64 : 80) }}
        transition={{ duration: 0.3 }}
        className={cn(
          "bg-amber-50 text-amber-900 h-screen overflow-hidden",
          isMobile && !isOpen ? 'fixed top-4 left-4 rounded-full z-50 h-16 w-16' : 'fixed top-0 left-0 z-50'
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "p-4 flex items-center",
            isOpen ? "justify-between" : "justify-center"
          )}>
            {isOpen && (
              <div className="flex items-center space-x-2">
                <Image
                  width={40}
                  height={40}
                  src="/isologo.png"
                  alt="RestAdmin Logo"
                  className="rounded-full"
                />
                <h1 className="font-bold text-lg">Kpiras</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNavbar}
              className="rounded-full hover:bg-amber-200"
            >
              {isOpen ? <GiForkKnifeSpoon className="h-5 w-5" /> : <GiKnifeFork className="h-5 w-5" />}
            </Button>
          </div>

          {isOpen && (
            <div className="flex flex-col items-center mb-6 mt-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/user.jpg" alt={session.user.nombre} />
                <AvatarFallback>{session.user.nombre.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold mt-2">{session.user.nombre}</h3>
              <span className="text-sm text-amber-700">
                {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
              </span>
            </div>
          )}

          <nav className={cn(
            "flex-1 overflow-y-auto py-2 space-y-1",
            isOpen ? "px-3" : "px-2"
          )}>
            <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="Mesas" condition={isAdmin || isWaiter} />
            <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="Facturar" condition={isAdmin || isCashier} />
            <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} />
            <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="Cocina" condition={isAdmin || isCashier} />
            <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="Domicilios" condition={isAdmin || isCashier} />
            <NavItem href="/dashboard/sales" icon={RiStackOverflowFill} label="Movimientos" condition={isAdmin} />
            <NavItem href="/dashboard/stadistics" icon={ImStatsDots} label="Estadísticas" condition={isAdmin} />
            <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="Menú" condition={isAdmin} />
            <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="Empleados" condition={isAdmin} />
          </nav>

          {isOpen && (
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-amber-200"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <TbLogout2 className="mr-2 h-5 w-5" />
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

