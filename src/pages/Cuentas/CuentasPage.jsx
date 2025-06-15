import { useEffect, useState } from 'react';
import api from '../../services/api';
import NuevaCuentaModal from './NuevaCuentaModal';
import EditarCuentaModal from './EditarCuentaModal';
import ImportarExcelModal from './ImportarExcelModal';
import './CuentasPage.css';

export default function CuentasPage() {
  const [cuentas, setCuentas] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [tipo, setTipo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editarVisible, setEditarVisible] = useState(false);
  const [importarVisible, setImportarVisible] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);

  const obtenerCuentas = async () => {
    try {
      console.log('🔄 Obteniendo cuentas...'); // Log para verificar refresco
      const res = await api.get('/cuentas', {
        params: { buscar, tipo }
      });
      console.log('📦 Cuentas cargadas:', res.data); // Log para ver los datos cargados
      setCuentas(res.data);
    } catch (err) {
      alert('❌ Error al cargar cuentas');
      console.error(err);
    }
  };

  const eliminarCuenta = async (id) => {
    if (confirm('¿Deseas eliminar esta cuenta?')) {
      try {
        await api.delete(`/cuentas/${id}`);
        console.log(`🗑️ Cuenta con ID ${id} eliminada`);
        obtenerCuentas();
      } catch (err) {
        alert('❌ Error al eliminar');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    obtenerCuentas();
  }, [buscar, tipo]);

  return (
    <div className="page-wrapper cuentas-page">
      <div className="cuentas-header">
        <h1>Cuentas contables</h1>
        <div className="cuentas-buttons">
          <button className="btn importar" onClick={() => setImportarVisible(true)}>
            📥 Importar Excel
          </button>
          <button className="btn agregar" onClick={() => setModalVisible(true)}>
            + Nueva cuenta
          </button>
        </div>
      </div>

      <div className="cuentas-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre o código"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="pasivo">Pasivo</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div className="cuentas-tabla">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map(cuenta => (
              <tr key={cuenta.id}>
                <td>{cuenta.codigo}</td>
                <td>{cuenta.nombre}</td>
                <td>{cuenta.tipo}</td>
                <td>{cuenta.descripcion || '-'}</td>
                <td className="acciones">
                  <button
                    className="accion editar"
                    onClick={() => {
                      setCuentaSeleccionada(cuenta);
                      setEditarVisible(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="accion eliminar"
                    onClick={() => eliminarCuenta(cuenta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NuevaCuentaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardado={obtenerCuentas}
      />
      <EditarCuentaModal
        visible={editarVisible}
        cuenta={cuentaSeleccionada}
        onClose={() => setEditarVisible(false)}
        onGuardado={obtenerCuentas}
      />
      <ImportarExcelModal
        visible={importarVisible}
        onClose={() => setImportarVisible(false)}
        onImportado={() => {
          console.log('✅ Importación completada. Refrescando...');
          obtenerCuentas();
        }}
      />
    </div>
  );
}