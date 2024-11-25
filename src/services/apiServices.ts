const API_BASE_URL = '/api';

// Servicios para categorías
export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categorias`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json();
};

// Servicios para productos
export const fetchProducts = async (categoriaId?: number) => {
  const url = categoriaId ? `${API_BASE_URL}/productos?categoriaId=${categoriaId}` : `${API_BASE_URL}/productos`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
};

// Servicios para clientes
export const fetchClients = async () => {
  const response = await fetch(`${API_BASE_URL}/client`);
  if (!response.ok) throw new Error('Error al obtener clientes');
  return response.json();
};

export const createClient = async (data: { nombre: string; telefono: string; direccion: string }) => {
  const response = await fetch(`${API_BASE_URL}/client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear cliente');
  return response.json();
};

export const updateClient = async (data: { id: number; nombre?: string; telefono?: string; direccion?: string }) => {
  const response = await fetch(`${API_BASE_URL}/client`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar cliente');
  return response.json();
};

// Servicios para facturas
export const fetchInvoices = async (params?: { fechaInicio?: string; fechaFin?: string; tipo?: string }) => {
  const query = params ? new URLSearchParams(params as any).toString() : '';
  const response = await fetch(`${API_BASE_URL}/invoice${query ? `?${query}` : ''}`);
  if (!response.ok) throw new Error('Error al obtener facturas');
  return response.json();
};

export const createInvoice = async (data: {
  clientId: number | null; // Opcional
  products: { id: number; cantidad: number; costo: number; precio: number }[]; // Incluye detalles de productos
  descuento?: number;
  total: number;
  estado: string;
  observaciones?: string;
  turnoId?: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear factura');
  return response.json();
};

// Servicios para cocina
export const fetchKitchens = async () => {
  const response = await fetch(`${API_BASE_URL}/kitchen`);
  if (!response.ok) throw new Error('Error al obtener tickets de cocina');
  return response.json();
};

export const createKitchen = async (data: {
  clientId: number | null; // Opcional
  products: { id: number; cantidad: number; costo: number; precio: number }[]; // Incluye detalles de productos
  observaciones?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/kitchen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear ticket de cocina');
  return response.json();
};

// Servicios para turnos
export const fetchTurnos = async () => {
  const response = await fetch(`${API_BASE_URL}/turno`);
  if (!response.ok) throw new Error('Error al obtener turnos');
  return response.json();
};

export const createTurno = async (data: { codigo: string; estado: string }) => {
  const response = await fetch(`${API_BASE_URL}/turno`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear turno');
  return response.json();
};
