'use client';

import { useEffect, useState } from 'react';
import { useRol } from '../RolContext';
import { obtenerPedidos, obtenerProveedores } from './api';
import type { Pedido, Proveedor } from './types';
import ProveedorForm from './components/ProveedorForm';
import ProveedoresTable from './components/ProveedoresTable';
import PedidoForm from './components/PedidoForm';
import PedidosTable from './components/PedidosTable';
import CasetaArribosForm from './components/CasetaArribosForm';
import MantenimientosPanel from './components/MantenimientosPanel';
import AuditoriaPanel from './components/AuditoriaPanel';

type Pestana = 'proveedores' | 'pedidos' | 'caseta' | 'mantenimientos' | 'auditoria';

/**
 * Panel único de Proveedores/Pedidos/Caseta para TODOS los roles.
 *
 * No hay una interfaz distinta por rol: es el mismo componente para
 * administrador, coordinador y operador. Lo único que cambia es qué
 * ACCIONES puede ejecutar cada uno (crear proveedor, crear pedido, marcar arribos),
 * controlado centralmente en `permisos.ts` a través de `useRol().puede(...)`.
 */
export default function GestionPanel() {
  const { puede } = useRol();
  const [pestana, setPestana] = useState<Pestana>('proveedores');

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(true);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const [listaProveedores, listaPedidos] = await Promise.all([
          obtenerProveedores(),
          obtenerPedidos(),
        ]);
        if (!activo) return;
        setProveedores(listaProveedores);
        setPedidos(listaPedidos);
      } catch {
        if (!activo) return;
        setErrorCarga(
          'No se pudo conectar con el servidor backend (http://localhost:4000). Verifique que esté corriendo.'
        );
      } finally {
        if (!activo) return;
        setCargandoProveedores(false);
        setCargandoPedidos(false);
      }
    };

    cargarDatos();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div>
      {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${pestana === 'proveedores' ? 'active' : ''}`}
            onClick={() => setPestana('proveedores')}
          >
            Proveedores
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${pestana === 'pedidos' ? 'active' : ''}`}
            onClick={() => setPestana('pedidos')}
          >
            Pedidos
          </button>
        </li>

        {/* 👈 3. Pestaña condicional según el permiso 'caseta.registrar' */}
        {puede('caseta.registrar') && (
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${pestana === 'caseta' ? 'active' : ''}`}
              onClick={() => setPestana('caseta')}
            >
               Caseta de Arribos
            </button>
          </li>
        )}

        {puede('mantenimientos.ver') && (
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${pestana === 'mantenimientos' ? 'active' : ''}`}
              onClick={() => setPestana('mantenimientos')}
            >
               Mantenimientos
            </button>
          </li>
        )}

        {puede('auditoria.ver') && (
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${pestana === 'auditoria' ? 'active' : ''}`}
              onClick={() => setPestana('auditoria')}
            >
              🧾 Auditoría
            </button>
          </li>
        )}
      </ul>

      {pestana === 'proveedores' && (
        <>
          {puede('proveedores.crear') && (
            <ProveedorForm
              onProveedorCreado={(nuevo) =>
                setProveedores((prev) =>
                  [...prev, nuevo].sort((a, b) => a.razonSocial.localeCompare(b.razonSocial))
                )
              }
            />
          )}
          <ProveedoresTable proveedores={proveedores} cargando={cargandoProveedores} />
        </>
      )}

      {pestana === 'pedidos' && (
        <>
          {puede('pedidos.crear') && (
            <PedidoForm
              proveedores={proveedores}
              onPedidoCreado={(nuevo) =>
                setPedidos((prev) =>
                  [...prev, nuevo].sort(
                    (a, b) => new Date(a.inicioVentana).getTime() - new Date(b.inicioVentana).getTime()
                  )
                )
              }
            />
          )}
          <PedidosTable pedidos={pedidos} proveedores={proveedores} cargando={cargandoPedidos} />
        </>
      )}

      {/* 👈 4. Contenido renderizado para Caseta de Arribos */}
      {pestana === 'caseta' && (
        <CasetaArribosForm
          onArriboRegistrado={async () => {
            try {
              const listaPedidos = await obtenerPedidos();
              setPedidos(listaPedidos);
            } catch (err) {
              console.error('Error al actualizar pedidos tras arribo:', err);
            }
          }}
        />
      )}

      {pestana === 'mantenimientos' && <MantenimientosPanel />}

      {pestana === 'auditoria' && <AuditoriaPanel />}
    </div>
  );
}