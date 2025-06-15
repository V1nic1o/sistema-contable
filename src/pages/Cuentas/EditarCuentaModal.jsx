import { useEffect, useState } from 'react';
import api from '../../services/api';
import './EditarCuentaModal.css';

export default function EditarCuentaModal({ visible, cuenta, onClose, onGuardado }) {
  const [form, setForm] = useState({ ...cuenta });
  const [error, setError] = useState('');

  useEffect(() => {
    if (cuenta) setForm(cuenta);
  }, [cuenta]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const actualizarCuenta = async () => {
    try {
      if (!form.codigo || !form.nombre || !form.tipo) {
        return setError('Todos los campos requeridos');
      }
      await api.put(`/cuentas/${cuenta.id}`, form);
      onGuardado();
      onClose();
    } catch (err) {
      setError('❌ Error al actualizar cuenta');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Cuenta</h2>

        <input
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          placeholder="Código *"
        />
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre *"
        />
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="">Selecciona tipo *</option>
          <option value="activo">Activo</option>
          <option value="pasivo">Pasivo</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
        <textarea
          name="descripcion"
          value={form.descripcion || ''}
          onChange={handleChange}
          placeholder="Descripción"
        />

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose} className="btn cancel">Cancelar</button>
          <button onClick={actualizarCuenta} className="btn update">Actualizar</button>
        </div>
      </div>
    </div>
  );
}