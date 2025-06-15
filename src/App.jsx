import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CuentasPage from './pages/Cuentas/CuentasPage';
import TransaccionesPage from './pages/TransaccionesPage/TransaccionesPage';
import EjerciciosPage from './pages/Ejercicios/EjerciciosPage';
import AuditoriaPage from './pages/Auditoria/AuditoriaPage';
import ReportesPage from './pages/Reportes/ReportesPage';
import UsuariosPage from './pages/Usuarios/UsuariosPage';
import ConciliacionesPage from './pages/Conciliaciones/ConciliacionesPage';
import InventarioPage from './pages/Inventario/InventarioPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginPage />} />

        {/* Área privada protegida */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 min-h-screen bg-gray-50">
                  <Navbar />
                  <main className="p-6">
                    <Routes>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="cuentas" element={<CuentasPage />} />
                      <Route path="transacciones" element={<TransaccionesPage />} />
                      <Route path="ejercicios" element={<EjerciciosPage />} />
                      <Route path="auditoria" element={<AuditoriaPage />} />
                      <Route path="reportes" element={<ReportesPage />} />
                      <Route path="conciliaciones" element={<ConciliacionesPage />} />
                      <Route path="inventario" element={<InventarioPage />} />
                      <Route
                        path="usuarios"
                        element={
                          <PrivateRoute roles={['admin']}>
                            <UsuariosPage />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}