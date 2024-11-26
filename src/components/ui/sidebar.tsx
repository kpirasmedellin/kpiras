"use client"

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
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transform transition-all duration-300 ease-in-out",
        isOpen ? (isMobile ? "w-64" : "w-64") : (isMobile ? "w-16" : "w-20"),
        isMobile && !isOpen ? "bg-transparent" : "bg-amber-50 border-r border-amber-200",
        "text-amber-900",
        className
      )}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()
  return (
    <div className={cn(
      "flex items-center justify-between p-4",
      !isOpen && "justify-center",
      className
    )} 
    {...props} 
    />
  )
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, isMobile } = useSidebar()
  return (
    <div 
      className={cn(
        "flex flex-col gap-1",
        isOpen ? "px-4" : "px-2",
        "py-2",
        isMobile && !isOpen ? "hidden" : "",
        className
      )} 
      {...props} 
    />
  )
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, isMobile } = useSidebar()
  return (
    <div 
      className={cn(
        "mt-auto p-4",
        !isOpen && "px-2",
        isMobile && !isOpen ? "hidden" : "",
        className
      )} 
      {...props} 
    />
  )
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, isOpen, isMobile } = useSidebar()

  return (
    <button
      onClick={toggle}
      className={cn(
        "rounded-full bg-amber-200 p-2 text-amber-900 hover:bg-amber-300 transition-all",
        isMobile 
          ? (isOpen ? "absolute -right-3 top-4" : "fixed left-4 top-4 z-50") 
          : "absolute -right-3 top-4",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={cn("h-6 w-6 transition-transform", isOpen ? "rotate-180" : "")}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  )
}

