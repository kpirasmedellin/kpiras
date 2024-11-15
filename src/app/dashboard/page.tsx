"use client"

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Bienvenido, {session.user?.rol}</h1>
      <p>Tu ID de usuario es: {session.user?.id}</p>
      <button onClick={()=>signOut({ callbackUrl: "/" })}>Logout</button>
    </div>
  );
}
