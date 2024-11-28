'use client'
import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi'; // Ícono de carrito
import ClientSearch from './ui/client/searchClient';
import ProductList from './ui/products/productList';
import Cart from './ui/cart/cart';
import useStore from '@/stores/useStore'; // Importa el estado global

export default function MainPage() {
  const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el carrito
  const { carrito } = useStore(); // Obtén el carrito del estado global

  const toggleCart = () => {
    setShowCart((prev) => !prev); // Cambia el estado de `showCart`
  };

  return (
    <div className=" flex">
      {/* Sección principal */}
      <div className="w-full">
        <ClientSearch />
        <ProductList />
      </div>

      {/* Carrito (oculto inicialmente) */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Cart />
      </div>

      {/* Botón flotante para abrir/cerrar el carrito */}
      <button
        onClick={toggleCart}
        className="fixed top-4 right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        <FiShoppingCart size={24} />
        {carrito.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {carrito.length}
          </span>
        )}
      </button>
    </div>
  );
}
