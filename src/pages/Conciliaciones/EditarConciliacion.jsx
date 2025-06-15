// src/pages/ConciliacionesPage/EditarConciliacion.jsx
import { useState } from 'react';
import api from '../../services/api';
import './EditarConciliacion.css';

export default function EditarConciliacion({ conciliacion, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...conciliacion });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/conciliaciones/${conciliacion.id}`, form);
      alert('✅ Conciliación actualizada');
      onUpdate();
      onClose();
    } catch {
      alert('❌ Error al actualizar conciliación');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card-editar-conciliacion">
        <h3>✏️ Editar Conciliación</h3>

        <input
          type="text"
          name="banco"
          placeholder="Nombre del banco"
          value={form.banco}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />
        <input
          type="text"
          name="numeroCheque"
          placeholder="Número de cheque"
          value={form.numeroCheque}
          onChange={handleChange}
        />
        <input
          type="text"
          name="referenciaBancaria"  // ✅ Campo corregido
          placeholder="Referencia bancaria"
          value={form.referenciaBancaria}
          onChange={handleChange}
        />
        <input
          type="number"
          name="montoSistema"
          placeholder="Monto registrado en el sistema"
          value={form.montoSistema}
          onChange={handleChange}
        />
        <input
          type="number"
          name="montoBanco"
          placeholder="Monto según el banco"
          value={form.montoBanco}
          onChange={handleChange}
        />
        <textarea
          name="observaciones"
          placeholder="Observaciones generales"
          value={form.observaciones}
          onChange={handleChange}
        />

        <div className="acciones">
          <button className="btn guardar" onClick={handleGuardar}>Guardar</button>
          <button className="btn cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}