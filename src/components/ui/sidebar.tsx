'use client'

import * as React from "react"
import { cn } from "@/app/lib/utils"

type SidebarContextType = {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }
    checkMobile() // Ejecutar una vez al cargar la página
    window.addEventListener('resize', checkMobile) // Escuchar cambios de tamaño
    return () => window.removeEventListener('resize', checkMobile)
  }, []) // Solo ejecuta en el cliente

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
