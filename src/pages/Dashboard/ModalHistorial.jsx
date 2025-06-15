// src/pages/Dashboard/ModalHistorial.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ModalHistorial.css';

export default function ModalHistorial({ tipo, ejercicioId, visible, onClose }) {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDetalles = async () => {
      if (!visible || !tipo || !ejercicioId) return;

      try {
        setLoading(true);
        const res = await api.get('/dashboard/historial', {
          params: { tipo, ejercicioId }
        });
        setDetalles(res.data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [tipo, ejercicioId, visible]);

  if (!visible) return null;

  return (
    <div className="modal-historial-wrapper">
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>Detalle de {tipo === 'haber' ? 'Ingresos' : 'Egresos'}</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : detalles.length === 0 ? (
            <p>No hay datos disponibles.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Código</th>
                  <th>Cuenta</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.fecha}</td>
                    <td>{d.descripcion}</td>
                    <td>{d.codigo}</td>
                    <td>{d.cuenta}</td>
                    <td>Q{d.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={onClose} className="btn-cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  );
}