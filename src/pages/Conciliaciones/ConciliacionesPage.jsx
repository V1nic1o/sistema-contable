// src/pages/Conciliaciones/ConciliacionesPage.jsx
import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import './ConciliacionesPage.css';
import EditarConciliacion from './EditarConciliacion';
import FormNuevaConciliacion from './FormNuevaConciliacion';

export default function ConciliacionesPage() {
  const fileInputRef = useRef(null);

  const [conciliaciones, setConciliaciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [resumenConciliacion, setResumenConciliacion] = useState(null);
  const [conciliacionEditando, setConciliacionEditando] = useState(null);
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);

  const [filtros, setFiltros] = useState({
    banco: '',
    estado: '',
    desde: '',
    hasta: ''
  });

  const obtenerConciliaciones = async () => {
    try {
      const filtrosValidos = {};
      if (filtros.banco) filtrosValidos.banco = filtros.banco;
      if (filtros.estado) filtrosValidos.estado = filtros.estado;
      if (filtros.desde && filtros.hasta) {
        filtrosValidos.desde = filtros.desde;
        filtrosValidos.hasta = filtros.hasta;
      }

      const res = await api.get('/conciliaciones', { params: filtrosValidos });
      setConciliaciones(res.data);
      setMensaje('');
    } catch {
      setMensaje('❌ Error al cargar conciliaciones');
    }
  };

  const eliminarConciliacion = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta conciliación?')) return;

    try {
      await api.delete(`/conciliaciones/${id}`);
      setMensaje('🗑️ Conciliación eliminada');
      obtenerConciliaciones();
    } catch {
      setMensaje('❌ Error al eliminar conciliación');
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/conciliaciones/${id}/estado`, { estado: nuevoEstado });
      setMensaje(`✅ Estado actualizado a ${nuevoEstado}`);
      obtenerConciliaciones();
    } catch {
      setMensaje('❌ Error al actualizar estado');
    }
  };

  const handleArchivoSeleccionado = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const res = await api.post('/conciliaciones/conciliar-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMensaje(res.data.mensaje);
      setResumenConciliacion(res.data.resumen);
      obtenerConciliaciones();
    } catch {
      setMensaje('❌ Error al procesar conciliación automática');
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    obtenerConciliaciones();
  }, []);

  return (
    <div className="page-wrapper conciliaciones-page">
      {/* ENCABEZADO */}
      <div className="header-conciliaciones">
        <h1>Conciliaciones Bancarias</h1>
        <div className="acciones-header">
          <button className="btn nueva" onClick={() => setMostrarFormNuevo(true)}>➕ Nueva conciliación</button>
          <button className="btn importar" onClick={() => fileInputRef.current.click()}>
            🧠 Conciliar desde Excel
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleArchivoSeleccionado}
            style={{ display: 'none' }}
            accept=".xlsx, .xls"
          />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros">
        <input
          type="text"
          name="banco"
          placeholder="Filtrar por nombre de banco"
          value={filtros.banco}
          onChange={handleFiltroChange}
        />
        <select name="estado" value={filtros.estado} onChange={handleFiltroChange}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="conciliado">Conciliado</option>
        </select>
        <input type="date" name="desde" value={filtros.desde} onChange={handleFiltroChange} />
        <input type="date" name="hasta" value={filtros.hasta} onChange={handleFiltroChange} />
        <button className="btn secundario" onClick={obtenerConciliaciones}>🔍 Buscar</button>
      </div>

      {/* MENSAJE */}
      {mensaje && <p className="mensaje" style={{ marginTop: '10px' }}>{mensaje}</p>}

      {/* RESUMEN */}
      {resumenConciliacion && (
        <div className="mensaje resumen">
          🧠 Conciliadas: {resumenConciliacion.conciliadas}, Pendientes: {resumenConciliacion.pendientes}
        </div>
      )}

      {/* TABLA */}
      <div className="tabla-conciliaciones">
        <h2>Historial de Conciliaciones</h2>
        <table>
          <thead>
            <tr>
              <th>Banco</th>
              <th>Fecha</th>
              <th>Cheque</th>
              <th>Referencia</th>
              <th>Monto Sistema</th>
              <th>Monto Banco</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {conciliaciones.map((c) => (
              <tr key={c.id}>
                <td>{c.banco}</td>
                <td>{new Date(c.fecha).toLocaleDateString()}</td>
                <td>{c.numeroCheque}</td>
                <td>{c.referenciaBancaria}</td>
                <td>Q{parseFloat(c.montoSistema).toFixed(2)}</td>
                <td>Q{parseFloat(c.montoBanco).toFixed(2)}</td>
                <td className={`estado-${c.estado}`}>{c.estado}</td>
                <td>
                  {c.estado === 'pendiente' && (
                    <button className="btn pequeño" onClick={() => cambiarEstado(c.id, 'conciliado')}>
                      ✅ Conciliar
                    </button>
                  )}
                  <button className="btn pequeño" onClick={() => setConciliacionEditando(c)}>✏️</button>
                  <button className="btn rojo" onClick={() => eliminarConciliacion(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {conciliacionEditando && (
        <EditarConciliacion
          conciliacion={conciliacionEditando}
          onClose={() => setConciliacionEditando(null)}
          onUpdate={obtenerConciliaciones}
        />
      )}

      {/* FORMULARIO NUEVO */}
      {mostrarFormNuevo && (
        <FormNuevaConciliacion
          onClose={() => setMostrarFormNuevo(false)}
          onCreate={() => {
            setMostrarFormNuevo(false); // cerrar
            obtenerConciliaciones();   // recargar
          }}
        />
      )}
    </div>
  );
}