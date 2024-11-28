'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from 'lucide-react'

export default function NavBarTop() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="w-full bg-white shadow-md">
      <div className="mx-auto px-0 sm:px-6 lg:px-0">
        <nav className="flex items-center justify-between h-24 px-6">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/variacion.png"
                height={60}
                width={160}
                alt="Logo Kpiras"
                className="h-12 w-auto ml-10"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 text-xl">
              <NavLink href="/">Inicio</NavLink>
              <NavLink href="/promociones">Promociones</NavLink>
              <NavLink href="/menu">Menú</NavLink>
              <NavLink href="/contacto">Contacto</NavLink>
              <NavLink href="/login">Ingresar</NavLink>
            </div>
          </div>
          <div className="md:hidden pr-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-mainyellow hover:text-white hover:bg-[#FFC300] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/" mobile>Inicio</NavLink>
            <NavLink href="/promociones" mobile>Promociones</NavLink>
            <NavLink href="/menu" mobile>Menú</NavLink>
            <NavLink href="/contact" mobile>Contacto</NavLink>
            <NavLink href="/login">Ingresar</NavLink>
          </div>
        </div>
      )}
    </div>
  )
}

function NavLink({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`${
        mobile
          ? 'block px-3 py-2 rounded-md text-base font-medium'
          : 'px-3 py-2 rounded-md text-sm font-medium'
      } text-mainblack/70 hover:bg-[#FFC300] hover:text-white text-xl font-black`}
    >
      {children}
    </Link>
  )
}
