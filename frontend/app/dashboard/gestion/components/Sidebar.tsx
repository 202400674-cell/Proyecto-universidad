'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  rol: string;
}

export default function Sidebar({ rol }: SidebarProps) {
  const [colapsado, setColapsado] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <aside
      className={`bg-dark text-white p-3 vh-100 d-flex flex-column transition-all`}
      style={{ width: colapsado ? '80px' : '250px', transition: '0.3s' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!colapsado && <h5 className="m-0 text-warning">LOGÍSTICA</h5>}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setColapsado(!colapsado)}
        >
          {colapsado ? '☰' : '◀'}
        </button>
      </div>

      <nav className="nav nav-pills flex-column mb-auto">
        <span className="text-muted small px-2 mb-2">
          {!colapsado && `ROL: ${rol.toUpperCase()}`}
        </span>

        {rol === 'operador' && (
          <Link href="/dashboard/operador/caseta" className="nav-link text-white my-1">
            📱 Caseta Arribos
          </Link>
        )}

        {(rol === 'coordinador' || rol === 'administrador') && (
          <>
            <Link href="/dashboard/coordinador/pedidos" className="nav-link text-white my-1">
              📦 Pedidos
            </Link>
            <Link href="/dashboard/coordinador/proveedores" className="nav-link text-white my-1">
              🚚 Proveedores
            </Link>
          </>
        )}
      </nav>

      <button className="btn btn-danger w-100 mt-auto" onClick={handleLogout}>
        {colapsado ? '🚪' : 'Cerrar Sesión'}
      </button>
    </aside>
  );
}