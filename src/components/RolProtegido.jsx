import { Navigate } from 'react-router-dom';
import { obtenerRol } from '../utils/auth';

export default function RolProtegido({ children, requerido }) {
  const rol = obtenerRol();

  if (rol !== requerido) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}