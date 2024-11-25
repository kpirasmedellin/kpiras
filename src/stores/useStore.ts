import { create } from 'zustand';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  costo: number;
  cantidad: number; // Añadimos cantidad para manejarla
}

interface Client {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

interface StoreState {
  cliente: Client | null;
  carrito: Product[];
  observaciones: string;
  cartCount: number; // Número de productos únicos en el carrito
  totalCarrito: number; // Precio total del carrito
  setCliente: (cliente: Client | null) => void;
  addToCarrito: (producto: Product) => void;
  removeFromCarrito: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  clearCarrito: () => void;
  setObservaciones: (observaciones: string) => void;
  calcularCarrito: () => void; // Actualiza `cartCount` y `totalCarrito`
}

const useStore = create<StoreState>((set) => ({
  cliente: null,
  carrito: [],
  observaciones: '',
  cartCount: 0,
  totalCarrito: 0,

  setCliente: (cliente) => set({ cliente }),

  // Agregar producto al carrito (con manejo de cantidad)
  addToCarrito: (producto) =>
    set((state) => {
      const existingProduct = state.carrito.find((p) => p.id === producto.id);
      const nuevoCarrito = existingProduct
        ? state.carrito.map((p) =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
          )
        : [...state.carrito, { ...producto, cantidad: 1 }];
      return { carrito: nuevoCarrito };
    }),

  // Incrementar cantidad del producto
  incrementQuantity: (id) =>
    set((state) => {
      const nuevoCarrito = state.carrito.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      return { carrito: nuevoCarrito };
    }),

  // Decrementar cantidad del producto (y eliminar si llega a 0)
  decrementQuantity: (id) =>
    set((state) => {
      const nuevoCarrito = state.carrito
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0); // Eliminar productos con cantidad 0
      return { carrito: nuevoCarrito };
    }),

  removeFromCarrito: (id) =>
    set((state) => {
      const nuevoCarrito = state.carrito.filter((p) => p.id !== id);
      return { carrito: nuevoCarrito };
    }),

  clearCarrito: () => set({ carrito: [], cartCount: 0, totalCarrito: 0 }),

  setObservaciones: (observaciones) => set({ observaciones }),

  calcularCarrito: () =>
    set((state) => {
      const cartCount = state.carrito.reduce((count, prod) => count + prod.cantidad, 0);
      const totalCarrito = state.carrito.reduce(
        (sum, prod) => sum + prod.precio * prod.cantidad,
        0
      );
      return { cartCount, totalCarrito };
    }),
}));

export default useStore;
