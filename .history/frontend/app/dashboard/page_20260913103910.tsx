'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [rol, setRol] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRol = localStorage.getItem('rol');

    // Si no hay token en localStorage, redirige de inmediato al login
    if (!token) {
      router.replace('/');
    } else {
      setRol(userRol);
    }
  }, [router]);

  const handleLogout = () => {
    // Elimina el token de localStorage y bloquea la navegación hacia atrás
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.replace('/');
  };

  if (!rol) return null;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Presenta únicamente el nombre del rol tomado del token */}
        <h1 className="display-6 text-capitalize fw-bold">{rol}</h1>
        
        {/* Botón de Logout seguro */}
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}