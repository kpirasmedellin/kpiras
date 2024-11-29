'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchProducts } from '@/services/apiServices'
import useStore from '@/stores/useStore'
import { Product } from '@/types/Imenu'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductSkeleton } from "@/components/ui/product-skeleton"

export default function ProductList() {
  const [productos, setProductos] = useState<Product[]>([])
  const [search, setSearch] = useState<string>('')
  const [categoriaId, setCategoriaId] = useState<string>("all")
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { addToCarrito } = useStore()

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
          : filteredProducts.map((producto: Product) => (
                    <Card key={producto.id} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 z-0">
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={producto.urlImagen || '/placeholder.png'}
                                    alt={producto.nombre}
                                    layout="fill"
                                    className="object-cover"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 text-center">
                            <CardTitle className="text-lg font-semibold">{producto.nombre}</CardTitle>
                            <p className="text-amber-700 font-bold mt-2">{`$${(producto.precio)}`}</p>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            <button
                                onClick={() => addToCarrito(producto)}
                                className="w-full bg-amber-500 text-amber-950 hover:bg-amber-600 py-2 px-4 rounded-lg font-semibold"
                            >
                                Agregar al Carrito
                            </button>
                        </CardFooter>
                    </Card>
            ))
        }
      </div>
    </div>
  )
}
