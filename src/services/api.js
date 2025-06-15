import axios from 'axios';

// Dirección del backend desde variable de entorno o localhost por defecto
const API_URL = import.meta.env.VITE_API_URL ;

// Cliente Axios preconfigurado
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // ✅ (opcional) para evitar que se cuelgue si el backend no responde
});

// Interceptor para adjuntar token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// (opcional) Interceptor de respuesta para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    // Puedes centralizar el manejo de 401, 500, etc.
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizada');
      // redirección automática si deseas
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;