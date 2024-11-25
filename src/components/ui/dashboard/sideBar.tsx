'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { MdTableRestaurant, MdDeliveryDining } from 'react-icons/md';
import { RiStackOverflowFill } from 'react-icons/ri';
import { ImStatsDots } from 'react-icons/im';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { FaPeopleRobbery, FaKitchenSet, FaFileInvoiceDollar } from 'react-icons/fa6';
import { HiComputerDesktop } from 'react-icons/hi2';
import { TbLogout2 } from "react-icons/tb";
import { GiKnifeFork, GiForkKnifeSpoon } from "react-icons/gi";

interface NavItemProps {
  href: string; // La ruta del enlace
  icon: React.ElementType; // El componente del ícono
  label: string; // El texto del enlace
  condition?: boolean; // Condición opcional para mostrar el ítem
}

// Animación del botón pulsante
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34, 73, 229, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

const PulsingButton = styled(motion.button)`
  animation: ${pulseAnimation} 2s infinite;
`;

// Loader de carga
const SkeletonLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="relative">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amarillo"></div>
    </div>
  </div>
);

export default function NavBarAsideDashboard() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Manejar tamaño de pantalla
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-mainyellow flex items-center justify-center">
        <SkeletonLoader />
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session.user.rol === 'ADMINISTRADOR';
  const isCashier = session.user.rol === 'CAJERO';
  const isWaiter = session.user.rol === 'MESERO';

  // Componente para ítems de navegación
  const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, condition = true }) => {
    if (!condition) return null; // No renderizar si la condición no se cumple
  
    const isActive = pathname === href; // Determinar si el enlace está activo
  
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`group flex items-center p-2 rounded-s-xl transition-all ${
            isActive ? 'bg-azulclaro text-azuloscuro' : 'hover:bg-azulclaro hover:text-azuloscuro'
          }`}
        >
          <Icon className="text-3xl group-hover:text-amarillo" />
          {isOpen && <span className="ml-2">{label}</span>}
        </motion.div>
      </Link>
    );
  };

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: isOpen ? (isMobile ? '55%' : 256) : (isMobile ? 0 : 80) }}
        animate={{ width: isOpen ? (isMobile ? '55%' : 256) : (isMobile ? 0 : 80) }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col bg-mainyellow text-black h-full overflow-hidden ${
          isMobile ? 'fixed top-0 left-0 z-50' : ''
        }`}
        style={{ minHeight: '100vh' }}
      >
        {/* Header del Navbar */}
        <div className="flex text-center items-center justify-between p-4">
          {isOpen && (
            <div className="flex items-center gap-3">
              <Image
                width={40}
                height={40}
                src="/isologo.png"
                alt="RestAdmin Logo"
                quality={15}
                priority
              />
              <h1 className="font-bold ml-9 text-lg">
                Kpiras
              </h1>
            </div>
          )}
          <button
            onClick={toggleNavbar}
            className={`p-2 flex text-center m-auto rounded-full hover:bg-azulmedio text-2xl ${
              isOpen ? 'mr-0' : 'm-auto'
            }`}
          >
            {isOpen ? <GiForkKnifeSpoon /> : <GiKnifeFork />}
          </button>
        </div>

        {/* Información del Usuario */}
        {isOpen && (
          <div className="flex flex-col items-center mb-4">
            <Image
              width={60}
              height={60}
              className="rounded-full object-cover"
              src="/user.jpg"
              alt="User Avatar"
              quality={85}
              priority={false}
            />
            <h3 className="font-bold mt-2">{session.user.nombre}</h3>
            <h3 className="text-xs">
              {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
            </h3>
          </div>
        )}

        {/* Opciones de Navegación */}
        <nav className={`flex-1 overflow-y-auto ${isOpen ? 'ml-4' : 'ml-0 py-16'} `}>
          <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="Mesas" condition={isAdmin || isWaiter} />
          <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="Facturar" condition={isAdmin || isCashier} />
          <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} />
          <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="Cocina" condition={isAdmin || isCashier} />
          <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="Domicilios" condition={isAdmin || isCashier} />
          <NavItem href="/dashboard/sales" icon={RiStackOverflowFill} label="Movimientos" condition={isAdmin} />
          <NavItem href="/dashboard/stadistics" icon={ImStatsDots} label="Estadísticas" condition={isAdmin} />
          <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="Menú" condition={isAdmin} />
          <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="Empleados" condition={isAdmin} />
        </nav>

        {/* Botón de Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`my-2 m-auto text-blanco p-2 flex items-center ${
            isOpen ? 'text-left ml-3' : 'text-center justify-center w-full ml-0'
          }`}
        >
          <TbLogout2 className="text-3xl mr-2" />
          {isOpen && 'Cerrar sesión'}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
