import { create } from 'zustand';

// Estado inicial del formulario
interface FormState {
  id: number;
  nombre: string;
  costo: number;
  precio: number;
  urlImagen: string;
  categoriaId: number;
}

// Métodos para modificar el estado
interface FormStore extends FormState {
  setId: (id: number) => void;
  setNombre: (nombre: string) => void;
  setCosto: (costo: number) => void;
  setPrecio: (precio: number) => void;
  setUrlImagen: (urlImagen: string) => void;
  setCategoriaId: (categoriaId: number) => void;
  resetForm: () => void; // Método para resetear el formulario
}

const useFormStore = create<FormStore>((set) => ({
  id: 0,
  nombre: '',
  costo: 0,
  precio: 0,
  urlImagen: '',
  categoriaId: 0,

  // Métodos para actualizar el estado
  setId: (id) => set({ id }),
  setNombre: (nombre) => set({ nombre }),
  setCosto: (costo) => set({ costo }),
  setPrecio: (precio) => set({ precio }),
  setUrlImagen: (urlImagen) => {
    set({ urlImagen });
    if (typeof window !== 'undefined') {
      localStorage.setItem('url-img', urlImagen);
    }
  },
  setCategoriaId: (categoriaId) => set({ categoriaId }),

  // Método para resetear el formulario
  resetForm: () =>
    set({
      id: 0,
      nombre: '',
      costo: 0,
      precio: 0,
      urlImagen: '',
      categoriaId: 0,
    }),
}));

export default useFormStore;
