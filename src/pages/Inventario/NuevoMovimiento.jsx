// src/pages/Inventario/NuevoMovimiento.jsx
import { useState } from 'react';
import api from '../../services/api';
import './NuevoMovimiento.css';

export default function NuevoMovimiento({ producto, onClose }) {
  const [form, setForm] = useState({
    tipo: 'entrada',
    cantidad: '',
    observacion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardar = async () => {
    const cantidadNum = parseInt(form.cantidad);

    // Validación estricta
    if (!producto?.id || isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('❌ Verifica los datos: producto inválido o cantidad no válida.');
      return;
    }

    try {
      const payload = {
        productoId: producto.id,
        tipo: form.tipo,
        cantidad: cantidadNum,
        observacion: form.observacion
      };

      console.log('🔍 Enviando movimiento:', payload); // Para depuración

      await api.post('/movimientos-inventario', payload);
      alert('✅ Movimiento registrado correctamente');
      onClose();
    } catch (error) {
      console.error('❌ Error en el registro:', error.response?.data || error.message || error);
      alert('❌ Error al registrar movimiento');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card-nuevo-movimiento">
        <h3>📦 Registrar movimiento</h3>
        <p className="producto-ref"><strong>Producto:</strong> {producto?.nombre || '—'}</p>

        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="entrada">📥 Entrada</option>
          <option value="salida">📤 Salida</option>
          <option value="ajuste">🛠️ Ajuste</option>
        </select>

        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad del movimiento"
          value={form.cantidad}
          onChange={handleChange}
        />

        <textarea
          name="observacion"
          placeholder="Observaciones (motivo, referencia, etc.)"
          value={form.observacion}
          onChange={handleChange}
        />

        <div className="acciones">
          <button className="btn guardar" onClick={guardar}>Guardar movimiento</button>
          <button className="btn cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}