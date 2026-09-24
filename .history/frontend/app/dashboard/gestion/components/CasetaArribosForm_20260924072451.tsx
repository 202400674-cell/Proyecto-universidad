'use client';
import React, { useState } from 'react';
import { registrarArribo } from '../api';

// 1. Declarar la prop en la interfaz
interface CasetaArribosFormProps {
  onArriboRegistrado?: () => void;
}

// 2. Recibir la prop en el componente
export default function CasetaArribosForm({ onArriboRegistrado }: CasetaArribosFormProps) {
  const [numPedido, setNumPedido] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setCargando(true);

    try {
      const data = await registrarArribo(numPedido, 'Operador Caseta');
      setResultado(data);
      setNumPedido('');

      // 3. Llamar la función al terminar con éxito
      if (onArriboRegistrado) {
        onArriboRegistrado();
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar el arribo');
    } finally {
      setCargando(false);
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'A TIEMPO': return 'bg-success';
      case 'ANTICIPADO': return 'bg-warning text-dark';
      case 'TARDÍO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="d-flex justify-content-center p-2">
      <div className="card shadow-sm p-3" style={{ maxWidth: '360px', width: '100%' }}>
        <h5 className="text-center font-weight-bold mb-3">📱 Control de Arribos</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label font-weight-bold">Número de Pedido</label>
            <input
              type="text"
              className="form-control form-control-lg text-center"
              placeholder="Ej. PED-1001"
              value={numPedido}
              onChange={(e) => setNumPedido(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-100 fw-bold"
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : 'MARCAR LLEGADA'}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3 text-center small">{error}</div>}

        {resultado && (
          <div className="card mt-3 p-3 text-center border-2">
            <h6 className="small text-muted">Resultado del Arribo:</h6>
            <span className={`badge ${getBadgeColor(resultado.estadoCalculado)} fs-5 py-2`}>
              {resultado.estadoCalculado}
            </span>
            <small className="text-muted mt-2 d-block">
              Llegada: {new Date(resultado.pedido.fechaHoraLlegadaReal).toLocaleTimeString()}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}