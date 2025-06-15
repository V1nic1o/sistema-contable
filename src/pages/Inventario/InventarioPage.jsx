// src/pages/Inventario/InventarioPage.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import './InventarioPage.css';
import NuevoMovimiento from './NuevoMovimiento';
import HistorialMovimientos from './HistorialMovimientos';
import FormNuevoProducto from './FormNuevoProducto';
import EditarProducto from './EditarProducto';

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [mostrarMovimiento, setMostrarMovimiento] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const obtenerProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch {
      alert('❌ Error al cargar productos');
    }
  };

  const abrirMovimiento = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarMovimiento(true);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      alert('🗑️ Producto eliminado');
      obtenerProductos();
    } catch {
      alert('❌ Error al eliminar producto');
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const totalValorizado = productos.reduce(
    (acc, p) => acc + p.precioUnitario * p.stockActual, 0
  );

  return (
    <div className="page-wrapper inventario-page">
      <h1>📦 Inventario de Productos</h1>

      <button className="btn agregar" onClick={() => setMostrarNuevo(true)}>
        + Nuevo producto
      </button>

      {/* NUEVO PRODUCTO */}
      {mostrarNuevo && (
        <div className="modal-carta">
          <FormNuevoProducto
            onClose={() => setMostrarNuevo(false)}
            onGuardado={() => {
              obtenerProductos();
              setMostrarNuevo(false);
            }}
          />
        </div>
      )}

      {/* TABLA */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Unidad</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.unidadMedida}</td>
              <td>Q{parseFloat(p.precioUnitario).toFixed(2)}</td>
              <td>{p.stockActual}</td>
              <td>
                <button className="btn pequeño" onClick={() => abrirMovimiento(p)}>➕ Movimiento</button>
                <button className="btn editar" onClick={() => setProductoEditando(p)}>✏️ Editar</button>
                <button className="btn eliminar" onClick={() => eliminarProducto(p.id)}>🗑️ Eliminar</button>
                <button className="btn historial" onClick={() => {
                  setProductoSeleccionado(p);
                  setMostrarHistorial(true);
                }}>📜 Historial</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3"><strong>Total valorizado:</strong></td>
            <td colSpan="3"><strong>Q{totalValorizado.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      {/* MODAL MOVIMIENTO EN CARTA */}
      {mostrarMovimiento && productoSeleccionado && (
        <div className="modal-carta">
          <NuevoMovimiento
            producto={productoSeleccionado}
            onClose={() => {
              setMostrarMovimiento(false);
              obtenerProductos();
            }}
          />
        </div>
      )}

      {/* MODAL HISTORIAL EN CARTA */}
      {mostrarHistorial && productoSeleccionado && (
        <div className="modal-carta">
          <HistorialMovimientos
            productoId={productoSeleccionado.id}
            onClose={() => setMostrarHistorial(false)}
          />
        </div>
      )}

      {/* MODAL EDICIÓN EN CARTA */}
      {productoEditando && (
        <div className="modal-carta">
          <EditarProducto
            producto={productoEditando}
            onClose={() => setProductoEditando(null)}
            onUpdate={obtenerProductos}
          />
        </div>
      )}
    </div>
  );
}