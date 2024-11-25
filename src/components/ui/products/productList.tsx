'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/apiServices';
import useStore from '@/stores/useStore';
import { Product } from '@/types/Imenu'; // Importa el tipo Product

export default function ProductList() {
  // Estado para almacenar los productos y filtros
  const [productos, setProductos] = useState<Product[]>([]); // Estado tipado explícitamente
  const [search, setSearch] = useState<string>(''); // Busca productos por nombre
  const [categoriaId, setCategoriaId] = useState<number | null>(null); // Filtra por categoría

  const { addToCarrito } = useStore(); // Usa Zustand para manejar el carrito

  useEffect(() => {
    // Función para cargar productos
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(categoriaId || undefined); // Carga productos según la categoría
        setProductos(data); // Actualiza el estado
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    loadProducts();
  }, [categoriaId]); // Vuelve a cargar productos cuando cambia la categoría

  // Filtra productos según la búsqueda
  const filteredProducts = productos.filter((p: Product) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar producto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full"
      />
      
      {/* Selector de categorías */}
      <select
        onChange={(e) => setCategoriaId(Number(e.target.value) || null)}
        className="border p-2 w-full mt-2"
      >
        <option value="">Todas las Categorías</option>
        <option value="1">Categoría 1</option>
        <option value="2">Categoría 2</option>
      </select>

      {/* Lista de productos */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filteredProducts.map((producto: Product) => (
          <div key={producto.id} className="border p-4">
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <button
              onClick={() => addToCarrito(producto)} // Agrega el producto al carrito
              className="bg-green-500 text-white px-4 py-2 mt-2"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
