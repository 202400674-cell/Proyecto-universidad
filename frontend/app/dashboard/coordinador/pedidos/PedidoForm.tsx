'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Proveedor {
  _id: string;
  razonSocial: string;
}

interface Alternativa {
  inicioVentana: string;
  finVentana: string;
}

export default function PedidoForm() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState({
    numeroPedido: '',
    proveedorId: '',
    tipoProducto: 'general',
    fecha: '',
    horaInicio: '',
    duracionEstimadaMinutos: 60,
  });
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/proveedores')
      .then((res) => res.json())
      .then((data) => setProveedores(data.proveedores || []))
      .catch(() => setProveedores([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatearHoraLocal = (isoString: string) =>
    new Date(isoString).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setAlternativas([]);

    try {
      // Combina fecha + hora en un solo Date, y calcula finVentana sumando la duración
      const inicioVentana = new Date(`${form.fecha}T${form.horaInicio}:00`);
      const duracionMs = Number(form.duracionEstimadaMinutos) * 60 * 1000;
      const finVentana = new Date(inicioVentana.getTime() + duracionMs);

      const body = {
        numeroPedido: form.numeroPedido,
        proveedorId: form.proveedorId,
        tipoProducto: form.tipoProducto,
        fechaHoraProgramada: inicioVentana.toISOString(),
        inicioVentana: inicioVentana.toISOString(),
        finVentana: finVentana.toISOString(),
        duracionEstimadaMinutos: Number(form.duracionEstimadaMinutos),
      };

      const response = await fetch('http://localhost:4000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alternativasSugeridas) {
          setAlternativas(data.alternativasSugeridas);
        }
        throw new Error(data.mensaje || 'Error al programar el pedido');
      }

      setMensaje({ tipo: 'exito', texto: `Pedido "${data.pedido.numeroPedido}" programado correctamente` });
      setForm({
        numeroPedido: '',
        proveedorId: '',
        tipoProducto: 'general',
        fecha: '',
        horaInicio: '',
        duracionEstimadaMinutos: 60,
      });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Programar Pedido</h2>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'exito' ? 'success' : 'danger'} py-2`}>
            {mensaje.texto}
          </div>
        )}

        {alternativas.length > 0 && (
          <div className="alert alert-warning py-2">
            <strong>Horarios alternativos disponibles ese día:</strong>
            <ul className="mb-0 mt-1">
              {alternativas.map((alt, i) => (
                <li key={i}>
                  {formatearHoraLocal(alt.inicioVentana)} - {formatearHoraLocal(alt.finVentana)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Número de Pedido</label>
              <input
                type="text"
                name="numeroPedido"
                className="form-control"
                value={form.numeroPedido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Proveedor</label>
              <select
                name="proveedorId"
                className="form-select"
                value={form.proveedorId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((p) => (
                  <option key={p._id} value={p._id}>{p.razonSocial}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Tipo de Producto</label>
              <select
                name="tipoProducto"
                className="form-select"
                value={form.tipoProducto}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="construcción">Construcción</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Hora de inicio</label>
              <input
                type="time"
                name="horaInicio"
                className="form-control"
                value={form.horaInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Duración estimada (minutos)</label>
              <input
                type="number"
                name="duracionEstimadaMinutos"
                className="form-control"
                min={1}
                value={form.duracionEstimadaMinutos}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Programando...' : 'Programar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}