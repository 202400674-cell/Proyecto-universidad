export default function HorarioOperativo() {
  return (
    <div className="alert alert-info py-2 mb-4">
      <strong>Horario operativo del centro de distribución:</strong>
      <ul className="mb-0 mt-1">
        <li>Lunes a viernes: 6:30 a.m. – 5:00 p.m.</li>
        <li>Sábado: 6:30 a.m. – 2:00 p.m.</li>
        <li>Domingo: cerrado</li>
      </ul>
    </div>
  );
}