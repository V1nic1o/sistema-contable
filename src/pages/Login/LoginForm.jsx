import { useState } from 'react';
import api from '../../services/api';
import './LoginForm.css';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMensaje(null);

  try {
    const res = await api.post('/auth/login', { correo, contrasena });

    // ✅ Guardar datos del usuario
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

    setMensaje({ tipo: 'success', texto: '✅ Login exitoso, redirigiendo...' });

    setTimeout(() => window.location.href = '/dashboard', 1500);
  } catch (err) {
    setMensaje({ tipo: 'error', texto: '❌ Credenciales incorrectas' });
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleLogin} className="login-form">
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo === 'error' ? 'mensaje-error' : 'mensaje-success'}`}>
          {mensaje.texto}
        </div>
      )}
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="input"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        className="input"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}