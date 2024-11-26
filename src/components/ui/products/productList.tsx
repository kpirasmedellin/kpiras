'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchProducts } from '@/services/apiServices'
import useStore from '@/stores/useStore'
import { Product } from '@/types/Imenu'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductSkeleton } from "@/components/ui/product-skeleton"

export default function ProductList() {
  const [productos, setProductos] = useState<Product[]>([])
  const [search, setSearch] = useState<string>('')
  const [categoriaId, setCategoriaId] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  const { addToCarrito } = useStore()

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

  const enabledProducts = productos.filter((p) => p.estado === "ACTIVO")

  const filteredProducts = enabledProducts.filter((p: Product) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 bg-amber-50">
      <div className="mb-4 space-y-4">
        <Input
          type="text"
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        
        <Select onValueChange={(value) => setCategoriaId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas las Categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            <SelectItem value="1">Categoría 1</SelectItem>
            <SelectItem value="2">Categoría 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : filteredProducts.map((producto: Product) => (
              <Card key={producto.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={producto.urlImagen || '/placeholder.png'}
                      alt={producto.nombre}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{producto.nombre}</CardTitle>
                  <p className="text-amber-700 font-bold mt-2">${producto.precio.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => addToCarrito(producto)}
                    className="w-full bg-amber-500 text-amber-950 hover:bg-amber-600"
                  >
                    Agregar al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))
        }
      </div>
    </div>
  )
}

  