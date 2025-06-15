import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [usuario, setUsuario] = useState({ nombre: 'Administrador' });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const userObj = JSON.parse(usuarioGuardado);
        setUsuario(userObj);
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <header className="navbar">
      <span className="navbar-title">Panel Administrativo</span>

      <div className="navbar-right">
        <div className="usuario-info">
          <FaUserCircle className="icono-perfil" />
          <span className="usuario-nombre">{usuario.nombre}</span>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}