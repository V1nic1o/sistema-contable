import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  // Obtener rol del usuario autenticado
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'admin';

  // Menú ordenado por flujo de uso contable
  const menu = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/ejercicios', label: 'Ejercicios' },            // Paso 1
    { path: '/cuentas', label: 'Cuentas' },                  // Paso 2
    { path: '/transacciones', label: 'Transacciones' },      // Paso 3
    { path: '/conciliaciones', label: 'Conciliaciones' },    // Paso 4
    { path: '/inventario', label: 'Inventario' },            // Paso 5
    { path: '/reportes', label: 'Reportes' },                // Paso 6
    { path: '/auditoria', label: 'Auditoría' },              // Paso 7
    ...(esAdmin ? [{ path: '/usuarios', label: 'Usuarios' }] : []) // Solo admin
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Contabilidad</div>
      <nav className="sidebar-nav">
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}