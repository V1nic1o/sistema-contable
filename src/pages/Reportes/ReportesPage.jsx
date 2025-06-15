// src/pages/Reportes/ReportesPage.jsx
import './ReportesPage.css';
import ReporteCard from './components/ReporteCard';

export default function ReportesPage() {
  return (
    <div className="page-wrapper reportes-container">
      <h1 className="reportes-title">Exportar reportes</h1>

      <div className="reportes-grid">
        <ReporteCard
          titulo="Balance General"
          endpointPdf="/reportes/pdf/balance-general"
        />

        <ReporteCard
          titulo="Estado de Resultados"
          endpointPdf="/reportes/pdf/estado-resultados"
        />

        <ReporteCard
          titulo="Libro Diario"
          endpointPdf="/reportes/pdf/libro-diario"
        />

        <ReporteCard
          titulo="Auditoría"
          endpointPdf="/reportes/pdf/auditoria"         // ✅ corregido
          endpointExcel="/reportes/excel/auditoria"     // ✅ corregido
          requiereFechas
        />
      </div>
    </div>
  );
}