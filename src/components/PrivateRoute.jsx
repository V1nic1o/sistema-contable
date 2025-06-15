import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const usuarioRaw = localStorage.getItem('usuario');

  if (!token || !usuarioRaw) {
    return <Navigate to="/" replace />;
  }

  const usuario = JSON.parse(usuarioRaw);

  // Si se especificaron roles y el rol del usuario no está incluido, redirigir
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}