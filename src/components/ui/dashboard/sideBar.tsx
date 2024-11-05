"use client";

import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Llamada a la API para eliminar la cookie
    await fetch("/api/auth/logout", { method: "GET" });
    // Redirigir al usuario a la página de login
    router.push("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Mi Dashboard</div>
      <nav className="flex-1 p-4 space-y-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-left px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
        >
          Dashboard
        </button>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
