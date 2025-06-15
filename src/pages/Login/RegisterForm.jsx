import { useState } from 'react';
import api from '../../services/api';
import './RegisterForm.css';

export default function RegisterForm() {
  const [datos, setDatos] = useState({
    nombre: '', correo: '', contrasena: '', rol: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    try {
      await api.post('/auth/register', datos);
      setMensaje({ tipo: 'success', texto: '✅ Registro exitoso. Inicia sesión ahora.' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: '❌ Error al registrar. Intenta con otro correo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="register-form">
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo === 'error' ? 'mensaje-error' : 'mensaje-success'}`}>
          {mensaje.texto}
        </div>
      )}
      <input
        name="nombre"
        placeholder="Nombre"
        value={datos.nombre}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="correo"
        placeholder="Correo"
        type="email"
        value={datos.correo}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="contrasena"
        placeholder="Contraseña"
        type="password"
        value={datos.contrasena}
        onChange={handleChange}
        className="input"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn"
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}