import Link from 'next/link';
import RoleDashboard from '../../RoleDashboard';
import PedidoForm from './PedidoForm';
import HorarioOperativo from '../HorarioOperativo';

export default function PedidosPage() {
  return (
    <RoleDashboard expectedRole="coordinador">
      <Link href="/dashboard/coordinador" className="btn btn-outline-secondary btn-sm mb-3">
        ← Volver al menú
      </Link>
      <HorarioOperativo />
      <PedidoForm />
    </RoleDashboard>
  );
}