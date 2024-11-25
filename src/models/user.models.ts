export interface Company {
    id: number;
    nombre: string;
    telefono: string;
    paginaWeb: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
    logoUrl: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    users: User[];
  }
  
  export interface User {
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    rol: Rol;
    estado: EstadoUser;
    companyId: number;
    company: Company;
  }
  
  export enum Rol {
    ADMINISTRADOR = "ADMINISTRADOR",
    CAJERO = "CAJERO",
  }
  
  export enum EstadoUser {
    ACTIVO = "ACTIVO",
    DESACTIVADO = "DESACTIVADO",
  }
  
  export interface Product {
    id: number;
    nombre: string;
    urlImagen: string;
    costo: number;
    precio: number;
    categoriaId: number;
    estado: string; // Puedes usar un enum si necesitas validación estricta
    cantidad: number;
    categoria: Category;
    Kitchen: Kitchen[];
    Invoice: Invoice[];
  }
  
  export enum EstadoProducto {
    ACTIVO = "ACTIVO",
    DESACTIVADO = "DESACTIVADO",
  }
  
  export interface Category {
    id: number;
    nombre: string;
    estado: string;
    productos: Product[];
  }
  
  export interface Client {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    kitchens: Kitchen[];
    invoices: Invoice[];
  }
  
  export interface Kitchen {
    id: number;
    clientId: number;
    client: Client;
    products: Product[];
    observaciones?: string; // Campo opcional
  }
  
  export interface Invoice {
    id: number;
    consecutivo: number;
    clientId?: number; // Campo opcional
    client?: Client; // Campo opcional
    products: Product[];
    descuento?: number; // Campo opcional
    total: number;
    fecha: Date;
    estado: EstadoFactura;
    observaciones?: string; // Campo opcional
    turnoId?: number; // Campo opcional
    turno?: Turno; // Campo opcional
  }
  
  export enum EstadoFactura {
    FACTURADO = "FACTURADO",
    ANULADO = "ANULADO",
  }
  
  export interface Turno {
    id: number;
    codigo: string;
    horaInicio: Date;
    horaFin?: Date; // Campo opcional
    estado: EstadoTurno;
    invoices: Invoice[];
  }
  
  export enum EstadoTurno {
    PENDIENTE = "PENDIENTE",
    CERRADO = "CERRADO",
  }
  