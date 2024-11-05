"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });
  
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error de autenticación");
      }
    } catch {
      setError("Error de red");
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">
          Iniciar Sesión
        </h2>
        
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
