'use client'

import React, { useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import ClientSearch from './ui/client/searchClient'
import ProductList from './ui/products/productList'
import Cart from './ui/cart/cart'
import useStore from '@/stores/useStore'
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from '@/app/lib/utils'

export default function DeliveryModule() {
  const [showCart, setShowCart] = useState(false)
  const { carrito } = useStore()
  const { isOpen, isMobile } = useSidebar()

  const toggleCart = () => {
    setShowCart((prev) => !prev)
  }

  return (
    <div className={cn(
      "relative w-full transition-all duration-300",
      isOpen && !isMobile ? "ml-0" : "ml-0",
      "pt-4" // Add padding top to prevent content from being hidden under navbar
    )}>
      {/* Sección principal */}
      <div className="flex-1 px-4">
        <ClientSearch />
        <ProductList />
      </div>

      {/* Carrito (oculto inicialmente) */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          showCart ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Cart />
      </div>

      {/* Botón flotante para abrir/cerrar el carrito */}
      <Button
        onClick={toggleCart}
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-50"
        size="icon"
      >
        <FiShoppingCart className="h-5 w-5" />
        {carrito.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {carrito.length}
          </span>
        )}
      </Button>
    </div>
  )
}

