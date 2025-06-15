import { useState } from 'react';
import api from '../../services/api';
import './NuevaCuentaModal.css';

export default function NuevaCuentaModal({ visible, onClose, onGuardado }) {
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    tipo: '',
    descripcion: ''
  });

  const [error, setError] = useState('');
  const tipos = ['activo', 'pasivo', 'ingreso', 'egreso'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCuenta = async () => {
    try {
      if (!form.codigo || !form.nombre || !form.tipo) {
        return setError('Todos los campos obligatorios deben completarse.');
      }
      await api.post('/cuentas', form);
      onGuardado();
      onClose();
    } catch (err) {
      setError('❌ Error al guardar la cuenta');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nueva Cuenta</h2>

        <input
          type="text"
          name="codigo"
          placeholder="Código *"
          value={form.codigo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre *"
          value={form.nombre}
          onChange={handleChange}
        />
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
        >
          <option value="">Selecciona tipo *</option>
          {tipos.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Cancelar</button>
          <button className="btn save" onClick={guardarCuenta}>Guardar</button>
        </div>
      </div>
    </div>
  );
}