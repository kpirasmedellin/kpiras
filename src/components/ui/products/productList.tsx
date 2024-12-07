'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchProducts } from '@/services/apiServices'
import useStore from '@/stores/useStore'
import { Product } from '@/types/Imenu'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductSkeleton } from "@/components/ui/product-skeleton"
import Swal from 'sweetalert2'

export default function ProductList() {
  const [productos, setProductos] = useState<Product[]>([])
  const [search, setSearch] = useState<string>('')
  const [categoriaId, setCategoriaId] = useState<string>("all")
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { addToCarrito, carrito } = useStore()

  // Cargar las categorías desde la API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categorias')
        const data = await res.json()
        setCategorias(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    loadCategories()
  }, [])

  // Cargar productos según la categoría seleccionada
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const data = await fetchProducts(categoriaId !== "all" ? Number(categoriaId) : undefined)
        setProductos(data)
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [categoriaId])

  // Filtrar productos activos
  const enabledProducts = productos.filter((p) => p.estado === "ACTIVO")

  // Filtrar productos por búsqueda
  const filteredProducts = enabledProducts.filter((p: Product) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  // Determinar qué productos ya están en el carrito
  const productosEnCarrito = new Set(carrito.map(prod => prod.id))

  // Manejar el clic en la tarjeta del producto
  const handleCardClick = (producto: Product) => {
    if (productosEnCarrito.has(producto.id)) {
      // Informar al usuario que el producto ya está en el carrito
      Swal.fire({
        title: 'Producto ya agregado',
        text: 'Este producto ya está en el carrito. Puedes ajustar la cantidad desde el carrito.',
        icon: 'info',
      })
      return
    }

    // Mostrar confirmación para agregar al carrito
    Swal.fire({
      title: 'Agregar al carrito',
      text: `¿Quieres agregar "${producto.nombre}" al carrito?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        addToCarrito(producto)
        Swal.fire({
          title: 'Agregado',
          text: `"${producto.nombre}" ha sido agregado al carrito.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  return (
    <div className="p-4 bg-amber-50 min-h-screen">
      <div className="mb-4 space-y-4">
        {/* Barra de búsqueda */}
        <Input
          type="text"
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        
        {/* Botones de categorías */}
        <div className="flex overflow-x-auto gap-3 mb-4 pb-2 scrollbar-hide sm:flex-wrap sm:overflow-x-visible">
          <button
            className={`px-4 py-1 rounded font-bold transition-all duration-200 ${categoriaId === "all" ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-700'}`}
            onClick={() => setCategoriaId("all")}
          >
            Todas las Categorías
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className={`px-4 py-1 rounded font-bold transition-all duration-200 ${categoriaId === categoria.id ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-500'}`}
              onClick={() => setCategoriaId(categoria.id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : filteredProducts.map((producto: Product) => {
              const isAdded = productosEnCarrito.has(producto.id)
              return (
                <Card 
                  key={producto.id} 
                  className={`overflow-hidden transform transition-transform duration-300 hover:scale-105 z-0 cursor-pointer relative ${isAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCardClick(producto)}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={producto.urlImagen || '/placeholder.png'}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    <CardTitle className="text-lg font-semibold">{producto.nombre}</CardTitle>
                    <p className="text-amber-700 font-bold mt-2">{`$${(producto.precio)}`}</p>
                  </CardContent>
                  
                  {/* Indicador de que el producto ya está en el carrito */}
                  {isAdded && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      En el carrito
                    </div>
                  )}
                </Card>
              )
            })
        }
      </div>
    </div>
  )
}
