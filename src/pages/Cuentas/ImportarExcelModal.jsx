import { useState, useRef } from 'react';
import api from '../../services/api';
import './ImportarExcelModal.css';

export default function ImportarExcelModal({ visible, onClose, onImportado }) {
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef();

  const handleArchivo = (e) => {
    const seleccionado = e.target.files[0];
    console.log('📁 Archivo seleccionado:', seleccionado);
    setArchivo(seleccionado);
    setError('');
  };

  const resetear = () => {
    console.log('🔁 Reiniciando modal...');
    setArchivo(null);
    setError('');
    setCargando(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleImportar = async () => {
    console.log('📨 Intentando importar...');
    if (!archivo) {
      console.warn('⚠️ No se ha seleccionado ningún archivo');
      return setError('Debes seleccionar un archivo .xlsx');
    }

    const formData = new FormData();
    formData.append('archivo', archivo);
    console.log('📦 Enviando archivo:', archivo.name);

    try {
      setCargando(true);
      const res = await api.post('/cuentas/importar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('✅ Importación exitosa:', res.data);

      // Esperamos que los datos se actualicen visualmente después del cierre
      resetear();
      onClose();

      // Delay para que el cierre visual se refleje antes de recargar tabla
      setTimeout(() => {
        onImportado(); // Refresca tabla
      }, 100);
    } catch (err) {
      console.error('❌ Error al importar:', err);
      const msg = err?.response?.data?.mensaje || '❌ Error al importar. Verifica el archivo.';
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Importar desde Excel</h2>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleArchivo}
          ref={inputRef}
        />

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button
            onClick={() => {
              console.log('❌ Cancelando importación');
              resetear();
              onClose();
            }}
            className="btn cancel"
          >
            Cancelar
          </button>
          <button
            onClick={handleImportar}
            disabled={cargando}
            className="btn import"
          >
            {cargando ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
}