export function obtenerRol() {
  return localStorage.getItem('rol');
}

export function tieneRol(requerido) {
  const rol = obtenerRol();
  return rol === requerido;
}