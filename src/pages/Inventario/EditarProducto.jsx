import { useState } from 'react';
import api from '../../services/api';
import './EditarProducto.css'; // Puedes usar o compartir estilos globales si prefieres

export default function EditarProducto({ producto, onClose, onUpdate }) {
  const [form, setForm] = useState({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    unidadMedida: producto.unidadMedida,
    precioUnitario: producto.precioUnitario,
    stockActual: producto.stockActual
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const guardarCambios = async () => {
    try {
      await api.put(`/productos/${producto.id}`, form);
      alert('✅ Producto actualizado');
      onClose();
      onUpdate();
    } catch (err) {
      alert('❌ Error al actualizar producto');
    }
  };

  return (
    <div className="editar-producto-card">
      <h3>✏️ Editar Producto</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
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
        placeholder="Stock actual"
        value={form.stockActual}
        onChange={handleChange}
      />
      <div className="acciones-editar">
        <button className="btn guardar" onClick={guardarCambios}>Guardar</button>
        <button className="btn cerrar" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}