import { useEffect, useState } from 'react';
import api from '../../services/api';
import NuevoEjercicioModal from '../../components/Ejercicios/NuevoEjercicioModal';
import './EjerciciosPage.css';

export default function EjerciciosPage() {
  const [ejercicios, setEjercicios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

  const obtenerEjercicios = async () => {
    try {
      const res = await api.get('/ejercicios');
      setEjercicios(res.data);
    } catch {
      alert('❌ Error al cargar ejercicios');
    }
  };

  const activarEjercicio = async (id) => {
    if (!confirm('¿Deseas activar este ejercicio contable?')) return;
    try {
      await api.put(`/ejercicios/${id}/activar`);
      obtenerEjercicios();
    } catch {
      alert('❌ Error al activar el ejercicio');
    }
  };

  const eliminarEjercicio = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return;
    try {
      await api.delete(`/ejercicios/${id}`);
      obtenerEjercicios();
    } catch {
      alert('❌ Error al eliminar ejercicio');
    }
  };

  const abrirModalNuevo = () => {
    setEjercicioSeleccionado(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (ejercicio) => {
    setEjercicioSeleccionado(ejercicio);
    setModalVisible(true);
  };

  useEffect(() => {
    obtenerEjercicios();
  }, []);

  return (
    <div className="page-wrapper ejercicios-page">
      <div className="ejercicios-header">
        <h1>Ejercicios contables</h1>
        <button className="btn nuevo" onClick={abrirModalNuevo}>
          + Nuevo ejercicio
        </button>
      </div>

      <div className="ejercicios-tabla">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Año</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ejercicios.map((e) => (
              <tr key={e.id}>
                <td>{e.descripcion}</td>
                <td>{e.anio}</td>
                <td>
                  {e.activo ? (
                    <span className="activo">✔ Activo</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <button className="btn-link" onClick={() => abrirModalEditar(e)}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => eliminarEjercicio(e.id)} className="btn-link eliminar">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NuevoEjercicioModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardado={obtenerEjercicios}
        ejercicio={ejercicioSeleccionado}
      />
    </div>
  );
}