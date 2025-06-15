import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AuditoriaPage.css';

export default function AuditoriaPage() {
  const [auditorias, setAuditorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    usuarioId: '',
    entidad: '',
    accion: '',
    desde: '',
    hasta: ''
  });

  const obtenerAuditoria = async () => {
    try {
      const res = await api.get('/auditoria', { params: filtros });
      setAuditorias(res.data);
    } catch {
      alert('❌ Error al cargar auditoría');
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get('/auth/usuarios');
      setUsuarios(res.data);
    } catch {
      console.log('⚠️ No se pudieron cargar los usuarios');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    obtenerAuditoria();
  }, [filtros]);

  return (  
        <div className="page-wrapper auditoria-container">
        <div className="auditoria-header">
        <h1>Historial de auditoría</h1>
      </div>

      <div className="auditoria-filtros">
        <select
          value={filtros.usuarioId}
          onChange={e => setFiltros({ ...filtros, usuarioId: e.target.value })}
        >
          <option value="">Todos los usuarios</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>

        <select
          value={filtros.entidad}
          onChange={e => setFiltros({ ...filtros, entidad: e.target.value })}
        >
          <option value="">Todas las entidades</option>
          <option value="cuenta">Cuenta</option>
          <option value="transaccion">Transacción</option>
          <option value="ejercicio">Ejercicio</option>
          <option value="usuario">Usuario</option>
        </select>

        <select
          value={filtros.accion}
          onChange={e => setFiltros({ ...filtros, accion: e.target.value })}
        >
          <option value="">Todas las acciones</option>
          <option value="create">Creación</option>
          <option value="update">Actualización</option>
          <option value="delete">Eliminación</option>
          <option value="activate">Activación</option>
        </select>

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
      </div>

      <div className="auditoria-tabla">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Entidad</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {auditorias.map(a => (
              <tr key={a.id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.usuario?.nombre || '—'}</td>
                <td className="capitalize">{a.accion}</td>
                <td className="capitalize">{a.entidad}</td>
                <td>{a.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}