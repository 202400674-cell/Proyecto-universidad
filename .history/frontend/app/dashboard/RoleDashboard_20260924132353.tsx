'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { esRolValido, type Rol } from './permisos';
import { RolProvider } from './RolContext';

interface DecodedToken {
  rol: Rol;
  exp: number;
}

const removeStoredSession = () => {
  localStorage.removeItem('token');
};

const getRoleLabel = (role: Rol) => role.charAt(0).toUpperCase() + role.slice(1);

const readRoleFromToken = (): Rol | null => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!esRolValido(decoded.rol) || decoded.exp * 1000 <= Date.now()) {
      return null;
    }

    return decoded.rol;
  } catch {
    return null;
  }
};

const subscribeToSession = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('sessionchange', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('sessionchange', callback);
  };
};

const handleBackNavigation = (router: ReturnType<typeof useRouter>) => {
  if (readRoleFromToken()) {
    window.history.pushState(null, '', window.location.href);
  } else {
    router.replace('/');
  }
};

interface RoleDashboardProps {
  children?: React.ReactNode;
}

/**
 * Dashboard ÚNICO para todos los roles autenticados (administrador,
 * coordinador, operador). No existe una interfaz distinta por rol: el rol
 * se decodifica del único JWT y se expone vía RolProvider para que los
 * componentes hijos limiten qué ACCIONES mostrar (ver permisos.ts),
 * en lugar de tener una pantalla completa por cada rol.
 */
export default function RoleDashboard({ children }: RoleDashboardProps) {
  const rol = useSyncExternalStore(subscribeToSession, readRoleFromToken, () => null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentRole = readRoleFromToken();

    if (!token || !currentRole) {
      removeStoredSession();
      router.replace('/');
      return;
    }

    window.history.pushState(null, '', window.location.href);
    const onPopState = () => handleBackNavigation(router);
    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, [router]);

  const handleLogout = () => {
    removeStoredSession();
    window.dispatchEvent(new Event('sessionchange'));
    window.history.replaceState(null, '', '/');
    router.replace('/');
  };

  if (!rol) return null;

  return (
    <RolProvider rol={rol}>
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="dashboard-header-inner">
            <div className="dashboard-brand-block">
              <span className="dashboard-kicker">Centro de distribución</span>
              <div className="dashboard-title-wrap">
                <h1>Sistema de Gestión Logística</h1>
                <p>Recepción y desembarque de proveedores</p>
              </div>
            </div>

            <div className="dashboard-user-panel">
              <div className="dashboard-user-meta">
                <span className="dashboard-rol-label">Rol</span>
                <strong>{getRoleLabel(rol)}</strong>
              </div>
              <button onClick={handleLogout} className="dashboard-logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar-brand">LOGÍSTICA</div>
            <nav className="dashboard-sidebar-nav">
              <button type="button" className="dashboard-nav-item active" onClick={() => window.dispatchEvent(new Event('dashboard:show-home'))}>
                Inicio
              </button>
              <button type="button" className="dashboard-nav-item" onClick={() => window.dispatchEvent(new CustomEvent('dashboard:select-tab', { detail: 'proveedores' }))}>
                Proveedores
              </button>
              <button type="button" className="dashboard-nav-item" onClick={() => window.dispatchEvent(new CustomEvent('dashboard:select-tab', { detail: 'pedidos' }))}>
                Pedidos
              </button>
              <button type="button" className="dashboard-nav-item" onClick={() => window.dispatchEvent(new CustomEvent('dashboard:select-tab', { detail: 'caseta' }))}>
                Caseta
              </button>
              <button type="button" className="dashboard-nav-item" onClick={() => window.dispatchEvent(new CustomEvent('dashboard:select-tab', { detail: 'parametros' }))}>
                Parámetros
              </button>
            </nav>
          </aside>

          <div className="dashboard-panel">{children}</div>
        </main>
      </div>
    </RolProvider>
  );
}