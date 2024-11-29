'use client';
import React, { useState, useEffect } from 'react';
import { fetchClients, createClient } from '@/services/apiServices';
import useStore from '@/stores/useStore';

export default function ClientSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', direccion: '' });
  const [filteredClients, setFilteredClients] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const { setCliente } = useStore();

  const buscarCliente = async (value: string) => {
    try {
      const clients = await fetchClients();
      const matches = clients.filter((c: { telefono: string; nombre: string }) =>
        c.telefono.startsWith(value) || c.nombre.toLowerCase().includes(value.toLowerCase())
      );

      if (matches.length > 0) {
        setFilteredClients(matches);
        setError('');
      } else {
        setFilteredClients([]);
        setError('Sin coincidencias. ¿Desea crear un cliente?');
        if (value.length >= 3) {
          setFormData((prev) => ({ ...prev, telefono: /^\d+$/.test(value) ? value : '', nombre: !/^\d+$/.test(value) ? value : '' }));
          setIsModalOpen(true);
        }
      }
    } catch (e) {
      console.error('Error al buscar cliente:', e);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);

    // Debounce para optimizar la búsqueda
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      buscarCliente(value);
    }, 300);
    setDebounceTimeout(timeout);
  };

  const handleSelectClient = (client: { id: number; nombre: string; telefono: string; direccion: string }) => {
    setCliente(client);
    setSearchValue('');
    setFilteredClients([]);
    setError('');
  };

  const handleCreateClient = async () => {
    try {
      const clients = await fetchClients();
      const clienteExistente = clients.find((c: { telefono: string }) => c.telefono === formData.telefono);
      if (clienteExistente) {
        setError('El cliente ya existe con este número de teléfono');
        return;
      }

      const newClient = await createClient(formData);
      setCliente(newClient);
      setIsModalOpen(false);
      setError('');
      setFormData({ nombre: '', telefono: '', direccion: '' });
    } catch (e) {
      console.error('Error al crear cliente:', e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setFormData({ nombre: '', telefono: '', direccion: '' });
  };

  return (
    <div className="p-4 bg-amber-50">
      <input
        type="text"
        placeholder="Buscar por nombre o teléfono"
        value={searchValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm ring-offset-amber-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {filteredClients.length > 0 && (
        <ul className="border border-gray-300 mt-2 max-h-40 overflow-auto">
          {filteredClients.map((client: { id: number; nombre: string; telefono: string; direccion: string }) => (
            <li
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {client.nombre} - {client.telefono}
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className="fixed z-30 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Crear Cliente</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateClient}
                className="bg-green-500 text-white px-4 py-2"
              >
                Crear Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
