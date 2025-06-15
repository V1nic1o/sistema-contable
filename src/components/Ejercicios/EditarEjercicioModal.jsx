import { useEffect, useState } from 'react';
import api from '../../services/api';
import './EditarEjercicioModal.css';

export default function EditarEjercicioModal({ visible, onClose, onGuardado, ejercicio }) {
  const [nombre, setNombre] = useState('');
  const [anio, setAnio] = useState('');
  const [activo, setActivo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && ejercicio) {
      setNombre(ejercicio.nombre || '');
      setAnio(ejercicio.anio || '');
      setActivo(ejercicio.activo || false);
      setError('');
    }
  }, [visible, ejercicio]);

  const actualizar = async () => {
    if (!nombre || !anio) {
      return setError('Todos los campos son obligatorios');
    }

    try {
      await api.put(`/ejercicios/${ejercicio.id}`, { nombre, anio, activo });
      onClose();
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al actualizar el ejercicio');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar ejercicio contable</h2>

        {error && <p className="modal-error">{error}</p>}

        <input
          type="text"
          placeholder="Nombre del ejercicio"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año (ej: 2024)"
          value={anio}
          onChange={e => setAnio(e.target.value)}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={activo}
            onChange={e => setActivo(e.target.checked)}
          />
          Ejercicio activo
        </label>

        <div className="modal-actions">
          <button onClick={onClose} className="btn cancelar">Cancelar</button>
          <button onClick={actualizar} className="btn actualizar">Actualizar</button>
        </div>
      </div>
    </div>
  );
}