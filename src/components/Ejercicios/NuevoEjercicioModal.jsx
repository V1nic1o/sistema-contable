import { useState, useEffect } from 'react';
import api from '../../services/api';
import './NuevoEjercicioModal.css';

export default function NuevoEjercicioModal({ visible, onClose, onGuardado, ejercicio }) {
  const [descripcion, setDescripcion] = useState('');
  const [anio, setAnio] = useState('');
  const [activo, setActivo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setDescripcion(ejercicio?.descripcion || '');
      setAnio(ejercicio?.anio || '');
      setActivo(ejercicio?.activo || false);
      setError('');
    }
  }, [visible, ejercicio]);

  const guardar = async () => {
    if (!descripcion || !anio) {
      return setError('Todos los campos son obligatorios');
    }

    try {
      if (ejercicio) {
        // Actualizar
        await api.put(`/ejercicios/${ejercicio.id}`, { descripcion, anio, activo });
      } else {
        // Crear nuevo
        await api.post('/ejercicios', { descripcion, anio, activo });
      }

      onClose();
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el ejercicio');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{ejercicio ? 'Editar ejercicio' : 'Nuevo ejercicio contable'}</h2>

        {error && <p className="modal-error">{error}</p>}

        <input
          type="text"
          placeholder="Nombre del ejercicio"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
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
          Activar este ejercicio
        </label>

        <div className="modal-actions">
          <button onClick={onClose} className="btn cancel">Cancelar</button>
          <button onClick={guardar} className="btn guardar">
            {ejercicio ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}