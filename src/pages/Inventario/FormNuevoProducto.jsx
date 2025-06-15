// src/pages/Inventario/FormNuevoProducto.jsx
import { useState } from 'react';
import api from '../../services/api';
import './FormNuevoProducto.css';

export default function FormNuevoProducto({ onClose, onGuardado }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    precioUnitario: '',
    stockActual: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/productos', form);
      alert('✅ Producto creado correctamente');
      onGuardado();
      onClose();
    } catch {
      alert('❌ Error al crear producto');
    }
  };

  return (
    <div className="form-nuevo-producto">
      <h3>Registrar nuevo producto</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción breve"
        value={form.descripcion}
        onChange={handleChange}
      />
      <input
        type="text"
        name="unidadMedida"
        placeholder="Unidad de medida (ej. kg, unid, litro)"
        value={form.unidadMedida}
        onChange={handleChange}
      />
      <input
        type="number"
        name="precioUnitario"
        placeholder="Precio unitario"
        value={form.precioUnitario}
        onChange={handleChange}
      />
      <input
        type="number"
        name="stockActual"
        placeholder="Stock inicial"
        value={form.stockActual}
        onChange={handleChange}
      />
      <button className="btn guardar" onClick={handleSubmit}>
        Guardar producto
      </button>
      <button className="btn cancelar" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
}