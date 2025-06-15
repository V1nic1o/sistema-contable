// src/pages/Inventario/HistorialMovimientos.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import './HistorialMovimientos.css';

export default function HistorialMovimientos({ productoId, onClose }) {
  const [movimientos, setMovimientos] = useState([]);

  const cargarHistorial = async () => {
    try {
      const res = await api.get(`/movimientos-inventario/producto/${productoId}`);
      setMovimientos(res.data);
    } catch {
      alert('❌ Error al cargar historial');
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

return (
  <div className="modal-overlay">
    <div className="card-historial-movimientos">
      <h3>📜 Historial de movimientos</h3>

      {movimientos.length === 0 ? (
        <p className="mensaje-vacio">No hay movimientos registrados para este producto.</p>
      ) : (
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}</td>
                <td>{m.cantidad}</td>
                <td>{new Date(m.fecha).toLocaleDateString()}</td>
                <td>{m.observacion || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="acciones">
        <button className="btn cerrar" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  </div>
);
}