'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [rol, setRol] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRol = localStorage.getItem('rol');

    // Protección de ruta client-side: Si no hay token, redirige al Login
    if (!token) {
      router.replace('/');
    } else {
      setRol(userRol);
    }
  }, [router]);

  const handleLogout = () => {
    // Cierre de sesión seguro: Limpiar storage y redirigir bloqueando el historial
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    router.replace('/');
  };

  if (!rol) {
    return (
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Panel Principal</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Cerrar Sesión
          </button>
        </div>
        <hr />
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">¡Bienvenido!</h4>
          <p className="mb-0">
            Has iniciado sesión exitosamente con el rol de: <strong>{rol}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}