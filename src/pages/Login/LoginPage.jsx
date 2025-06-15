import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './LoginPage.css';

export default function LoginPage() {
  const [modo, setModo] = useState('login');

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-tabs">
          <button
            onClick={() => setModo('login')}
            className={`tab-button ${modo === 'login' ? 'active' : ''}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setModo('register')}
            className={`tab-button ${modo === 'register' ? 'active' : ''}`}
          >
            Registrarse
          </button>
        </div>
        <div className="login-form-area">
          {modo === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}