'use client';

import { useState, FormEvent } from 'react';

export default function ProveedorForm() {
  const [form, setForm] = useState({
    razonSocial: '',
    identificacionTributaria: '',
    categoria: 'general',
    contactoNombre: '',
    telefono: '',
    emailContacto: '',
  });
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const response = await fetch('http://localhost:4000/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar el proveedor');
      }

      setMensaje({ tipo: 'exito', texto: `Proveedor "${data.proveedor.razonSocial}" registrado correctamente` });
      setForm({
        razonSocial: '',
        identificacionTributaria: '',
        categoria: 'general',
        contactoNombre: '',
        telefono: '',
        emailContacto: '',
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
        <h2 className="h5 mb-3">Registrar Proveedor</h2>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'exito' ? 'success' : 'danger'} py-2`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Razón Social</label>
              <input
                type="text"
                name="razonSocial"
                className="form-control"
                value={form.razonSocial}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Identificación Tributaria</label>
              <input
                type="text"
                name="identificacionTributaria"
                className="form-control"
                value={form.identificacionTributaria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                className="form-select"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="construcción">Construcción</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Nombre de Contacto</label>
              <input
                type="text"
                name="contactoNombre"
                className="form-control"
                value={form.contactoNombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo de Contacto</label>
              <input
                type="email"
                name="emailContacto"
                className="form-control"
                value={form.emailContacto}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar Proveedor'}
          </button>
        </form>
      </div>
    </div>
  );
}