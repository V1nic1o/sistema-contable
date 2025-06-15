import { useEffect, useState } from 'react';
import api from '../../services/api';
import NuevaTransaccionModal from '../../components/Transacciones/NuevaTransaccionModal';
import './TransaccionesPage.css';

export default function TransaccionesPage() {
  const [transacciones, setTransacciones] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    cuentaId: '',
    ejercicioId: '',
    buscar: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);

  const obtenerDatos = async () => {
    try {
      const [resTrans, resCuentas, resEjer] = await Promise.all([
        api.get('/transacciones', { params: filtros }),
        api.get('/cuentas'),
        api.get('/ejercicios')
      ]);
      setTransacciones(resTrans.data);
      setCuentas(resCuentas.data);
      setEjercicios(resEjer.data.filter(e => e.activo));
    } catch {
      alert('❌ Error al cargar transacciones');
    }
  };

  const eliminarTransaccion = async (id) => {
    if (!confirm('¿Deseas eliminar esta transacción?')) return;
    try {
      await api.delete(`/transacciones/${id}`);
      obtenerDatos();
    } catch {
      alert('❌ Error al eliminar transacción');
    }
  };

  const abrirModalEditar = (transaccion) => {
    setTransaccionSeleccionada(transaccion);
    setModalVisible(true);
  };

  useEffect(() => {
    obtenerDatos();
  }, [filtros]);

  return (
    <div className="page-wrapper transacciones-page">
      <div className="transacciones-header">
        <h1>Transacciones</h1>
        <button
          className="btn agregar"
          onClick={() => {
            setTransaccionSeleccionada(null);
            setModalVisible(true);
          }}
        >
          + Nueva transacción
        </button>
      </div>

      <div className="transacciones-filtros">
        <input
          type="date"
          value={filtros.desde}
          onChange={e => setFiltros({ ...filtros, desde: e.target.value })}
        />
        <input
          type="date"
          value={filtros.hasta}
          onChange={e => setFiltros({ ...filtros, hasta: e.target.value })}
        />
        <select
          value={filtros.cuentaId}
          onChange={e => setFiltros({ ...filtros, cuentaId: e.target.value })}
        >
          <option value="">Todas las cuentas</option>
          {cuentas.map(c => (
            <option key={c.id} value={c.id}>
              {c.codigo} - {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtros.ejercicioId}
          onChange={e => setFiltros({ ...filtros, ejercicioId: e.target.value })}
        >
          <option value="">Todos los ejercicios</option>
          {ejercicios.map(e => (
          <option key={e.id} value={e.id}>
            {e.descripcion} ({e.anio})
          </option>
        ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Buscar por descripción..."
        value={filtros.buscar}
        onChange={e => setFiltros({ ...filtros, buscar: e.target.value })}
        className="buscar-input"
      />

      <div className="transacciones-tabla">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Detalles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map(t => (
              <tr key={t.id}>
                <td>{t.fecha}</td>
                <td>{t.descripcion}</td>
                <td>
                  {t.detalles.map(d => (
                    <div key={d.id}>
                      [{d.tipo?.toUpperCase()}]{' '}
                      {d.cuentum
                        ? `${d.cuentum.codigo} - ${d.cuentum.nombre}`
                        : 'Sin cuenta'}: Q{d.monto}
                    </div>
                  ))}
                </td>
                <td>
                  <button
                    className="btn-link"
                    onClick={() => abrirModalEditar(t)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-link rojo"
                    onClick={() => eliminarTransaccion(t.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NuevaTransaccionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardado={obtenerDatos}
        transaccion={transaccionSeleccionada}
      />
    </div>
  );
}