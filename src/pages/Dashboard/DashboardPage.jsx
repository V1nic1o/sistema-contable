import { useEffect, useState } from 'react';
import api from '../../services/api';
import './DashboardPage.css';
import ModalHistorial from './ModalHistorial';

export default function DashboardPage() {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const obtenerDatos = async () => {
    try {
      const ejercicios = await api.get('/ejercicios');
      const activo = ejercicios.data.find(e => e.activo);
      setEjercicioActivo(activo);

      if (!activo) return;

      const { data } = await api.get('/dashboard/resumen', {
        params: { ejercicioId: activo.id }
      });

      setIngresos(data.ingresos || 0);
      setEgresos(data.egresos || 0);
    } catch (err) {
      console.error('❌ Error al cargar el dashboard:', err);
      alert('❌ Error al cargar el dashboard');
    }
  };

  const abrirModalHistorial = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarModal(true);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <div className="page-wrapper dashboard-container">
      <h1 className="dashboard-title">Dashboard contable</h1>

      {ejercicioActivo ? (
        <div className="ejercicio-info">
          <p><strong>Ejercicio activo:</strong> {ejercicioActivo.nombre} ({ejercicioActivo.anio})</p>
        </div>
      ) : (
        <p className="no-ejercicio">No hay ejercicio activo actualmente.</p>
      )}

      <div className="kpi-grid">
        <div className="kpi-card ingresos" onClick={() => abrirModalHistorial('ingreso')}>
          <p className="kpi-label">Ingresos</p>
          <p className="kpi-value">Q{ingresos.toFixed(2)}</p>
        </div>
        <div className="kpi-card egresos" onClick={() => abrirModalHistorial('egreso')}>
          <p className="kpi-label">Egresos</p>
          <p className="kpi-value">Q{egresos.toFixed(2)}</p>
        </div>
        <div className="kpi-card balance">
          <p className="kpi-label">Balance</p>
          <p className="kpi-value">Q{(ingresos - egresos).toFixed(2)}</p>
        </div>
      </div>

      {mostrarModal && (
        <ModalHistorial
          tipo={tipoSeleccionado}
          ejercicioId={ejercicioActivo?.id}
          visible={mostrarModal}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}