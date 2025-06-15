import { useEffect, useState } from 'react';
import api from '../../services/api';
import './UsuariosPage.css';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', rol: 'admin' });
  const [mensaje, setMensaje] = useState('');

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get('/auth/usuarios');
      setUsuarios(res.data);
    } catch {
      alert('❌ Error al obtener usuarios');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const abrirModalNuevo = () => {
    setModoEdicion(null);
    setForm({ nombre: '', correo: '', contrasena: '', rol: 'admin' });
    setMensaje('');
    setModalVisible(true);
  };

  const abrirModalEditar = (usuario) => {
    setModoEdicion(usuario.id);
    setForm({ ...usuario, contrasena: '' });
    setMensaje('');
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    try {
      if (!form.nombre || !form.correo || (!modoEdicion && !form.contrasena)) {
        return setMensaje('⚠️ Todos los campos obligatorios deben completarse.');
      }

      if (modoEdicion) {
        await api.put(`/auth/usuarios/${modoEdicion}`, form);
      } else {
        await api.post('/auth/register', form);
      }

      setModalVisible(false);
      obtenerUsuarios();
    } catch (err) {
      setMensaje('❌ Error al guardar usuario');
    }
  };

  const eliminarUsuario = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await api.delete(`/auth/usuarios/${id}`);
        obtenerUsuarios();
      } catch {
        alert('❌ Error al eliminar');
      }
    }
  };

  return (
    <div className=" page-wrapper usuarios-page">
      <div className="usuarios-header">
        <h1>Gestión de usuarios</h1>
        <button className="btn agregar" onClick={abrirModalNuevo}>
          + Nuevo usuario
        </button>
      </div>

      <div className="usuarios-tabla">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>
                  <button className="btn-link editar" onClick={() => abrirModalEditar(u)}>
                    Editar
                  </button>
                  <button className="btn-link eliminar" onClick={() => eliminarUsuario(u.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

            {mensaje && <p className="modal-error">{mensaje}</p>}

            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
            {!modoEdicion && (
              <input
                type="password"
                placeholder="Contraseña"
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              />
            )}
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
            >
              <option value="admin">Administrador</option>
              <option value="lector">Lector</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setModalVisible(false)} className="btn cancel">
                Cancelar
              </button>
              <button onClick={guardarUsuario} className="btn guardar">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}