import Link from 'next/link';
import RoleDashboard from '../RoleDashboard';

export default function CoordinadorPage() {
  return (
    <RoleDashboard expectedRole="coordinador">
      <div className="row g-3">
        <div className="col-md-6">
          <Link href="/dashboard/coordinador/proveedores" className="card text-decoration-none h-100">
            <div className="card-body">
              <h2 className="h5">Registrar Proveedor</h2>
              <p className="text-secondary mb-0">Agregar un nuevo proveedor al sistema.</p>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link href="/dashboard/coordinador/pedidos" className="card text-decoration-none h-100">
            <div className="card-body">
              <h2 className="h5">Programar Pedido</h2>
              <p className="text-secondary mb-0">Agendar una cita de entrega para un proveedor.</p>
            </div>
          </Link>
        </div>
      </div>
    </RoleDashboard>
  );
}