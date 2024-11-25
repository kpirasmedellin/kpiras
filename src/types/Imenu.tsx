export interface Product {
    id: number; // Identificador único del producto
    nombre: string; // Nombre del producto
    costo: number; // Costo del producto
    precio: number; // Precio de venta
    urlImagen: string; // URL de la imagen del producto
    categoria: {
      id: number; // Identificador único de la categoría
      nombre: string; // Nombre de la categoría
    };
    categoriaId: number; // ID de la categoría relacionada
    cantidad: number; // Cantidad en inventario
    estado: "ACTIVO" | "DESACTIVADO"; // Estado del producto
  }
  