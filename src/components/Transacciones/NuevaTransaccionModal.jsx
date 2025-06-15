import { useEffect, useState } from 'react';
import api from '../../services/api';
import './NuevaTransaccionModal.css';

export default function NuevaTransaccionModal({ visible, onClose, onGuardado, transaccion }) {
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ejercicioId, setEjercicioId] = useState('');
  const [ejercicios, setEjercicios] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [detalles, setDetalles] = useState([
    { cuentaId: '', monto: '', tipo: 'debe' },
    { cuentaId: '', monto: '', tipo: 'haber' }
  ]);
  const [error, setError] = useState('');

  const obtenerDatos = async () => {
    try {
      const [resCuentas, resEjer] = await Promise.all([
        api.get('/cuentas'),
        api.get('/ejercicios')
      ]);
      setCuentas(resCuentas.data);
      setEjercicios(resEjer.data.filter(e => e.activo));
    } catch {
      alert('❌ Error al cargar datos');
    }
  };

  useEffect(() => {
    if (visible) {
      obtenerDatos();

      if (transaccion) {
        setDescripcion(transaccion.descripcion || '');
        setFecha(transaccion.fecha || '');
        setEjercicioId(transaccion.ejercicioId || '');
        setDetalles(
          transaccion.detalles?.map(d => ({
            cuentaId: d.cuentaId,
            monto: d.monto,
            tipo: d.tipo
          })) || []
        );
      } else {
        setDescripcion('');
        setFecha('');
        setEjercicioId('');
        setDetalles([
          { cuentaId: '', monto: '', tipo: 'debe' },
          { cuentaId: '', monto: '', tipo: 'haber' }
        ]);
      }

      setError('');
    }
  }, [visible, transaccion]);

  const agregarDetalle = () => {
    setDetalles([...detalles, { cuentaId: '', monto: '', tipo: 'debe' }]);
  };

  const actualizarDetalle = (i, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[i][campo] = valor;
    setDetalles(nuevos);
  };

  const eliminarDetalle = (i) => {
    const nuevos = detalles.filter((_, index) => index !== i);
    setDetalles(nuevos);
  };

  const guardar = async () => {
    if (!fecha || !descripcion || detalles.length < 2) {
      return setError('Todos los campos son obligatorios y se requieren al menos dos movimientos.');
    }

    const tieneDebe = detalles.some(d => d.tipo === 'debe');
    const tieneHaber = detalles.some(d => d.tipo === 'haber');
    if (!tieneDebe || !tieneHaber) {
      return setError('Debe incluir al menos un "debe" y un "haber".');
    }

    try {
      if (transaccion?.id) {
        // Edición
        await api.put(`/transacciones/${transaccion.id}`, {
          fecha,
          descripcion,
          ejercicioId,
          detalles
        });
      } else {
        // Nueva
        await api.post('/transacciones', {
          fecha,
          descripcion,
          ejercicioId,
          detalles
        });
      }

      onClose();
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <h2>{transaccion ? 'Editar transacción' : 'Nueva transacción'}</h2>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-row">
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
          <select
            value={ejercicioId}
            onChange={e => setEjercicioId(e.target.value)}
          >
            <option value="">Ejercicio contable</option>
            {ejercicios.map(e => (
              <option key={e.id} value={e.id}>{e.descripcion}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="full-width"
        />

        <div className="detalles-container">
          {detalles.map((detalle, i) => (
            <div key={i} className="detalle-row">
              <select
                value={detalle.cuentaId}
                onChange={e => actualizarDetalle(i, 'cuentaId', e.target.value)}
              >
                <option value="">Cuenta</option>
                {cuentas.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={detalle.monto}
                onChange={e => actualizarDetalle(i, 'monto', e.target.value)}
                placeholder="Q"
              />
              <select
                value={detalle.tipo}
                onChange={e => actualizarDetalle(i, 'tipo', e.target.value)}
              >
                <option value="debe">Debe</option>
                <option value="haber">Haber</option>
              </select>
              <button onClick={() => eliminarDetalle(i)} className="btn eliminar">✕</button>
            </div>
          ))}
          <button onClick={agregarDetalle} className="btn texto-link">+ Agregar línea</button>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn cancel">Cancelar</button>
          <button onClick={guardar} className="btn guardar">
            {transaccion ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}