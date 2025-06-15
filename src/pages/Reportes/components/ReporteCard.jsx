import { useState } from 'react';
import api from '../../../services/api';

export default function ReporteCard({ titulo, endpointPdf, endpointExcel, requiereFechas = false }) {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const exportar = async (formato) => {
    try {
      const params = requiereFechas ? { desde, hasta } : {};
      const endpoint = formato === 'pdf' ? endpointPdf : endpointExcel;

      const res = await api.get(endpoint, {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${titulo.replace(/\s+/g, '_')}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('❌ Error al generar reporte:', err);
      alert('❌ Error al generar el reporte');
    }
  };

  return (
    <div className="reporte-card">
      <h3>{titulo}</h3>

      {requiereFechas && (
        <div className="fechas">
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
      )}

      <div className="botones">
        {endpointPdf && (
          <button className="btn btn-pdf" onClick={() => exportar('pdf')}>PDF</button>
        )}
        {endpointExcel && (
          <button className="btn btn-excel" onClick={() => exportar('excel')}>Excel</button>
        )}
      </div>
    </div>
  );
}