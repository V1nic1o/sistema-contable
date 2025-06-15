// src/pages/Conciliaciones/FormNuevaConciliacion.jsx
import { useState } from 'react';
import api from '../../services/api';
import './FormNuevaConciliacion.css';

export default function FormNuevaConciliacion({ onClose, onCreate }) {
  const [form, setForm] = useState({
    banco: '',
    fecha: '',
    numeroCheque: '',
    referenciaBancaria: '',
    observaciones: '',
    montoSistema: '',
    montoBanco: '',
    saldoInicial: '',
    saldoFinal: '',
    saldoContable: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    console.log('📤 Enviando conciliación:', form);
    try {
      await api.post('/conciliaciones', form);
      setMensaje('✅ Conciliación registrada correctamente');
      onCreate(); // recargar lista en el padre
      onClose();  // cerrar modal
    } catch (err) {
      console.error('❌ Error al registrar:', err.response?.data || err.message);
      setMensaje('❌ Error al registrar la conciliación');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card-nueva-conciliacion">
        <h3>➕ Nueva Conciliación</h3>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <input
          type="text"
          name="banco"
          placeholder="Nombre del banco"
          value={form.banco}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />
        <input
          type="text"
          name="numeroCheque"
          placeholder="Número de cheque"
          value={form.numeroCheque}
          onChange={handleChange}
        />
        <input
          type="text"
          name="referenciaBancaria"
          placeholder="Referencia bancaria"
          value={form.referenciaBancaria}
          onChange={handleChange}
        />
        <textarea
          name="observaciones"
          placeholder="Observaciones generales"
          value={form.observaciones}
          onChange={handleChange}
        />
        <input
          type="number"
          name="montoSistema"
          placeholder="Monto registrado en el sistema (Q)"
          value={form.montoSistema}
          onChange={handleChange}
        />
        <input
          type="number"
          name="montoBanco"
          placeholder="Monto según el banco (Q)"
          value={form.montoBanco}
          onChange={handleChange}
        />
        <input
          type="number"
          name="saldoInicial"
          placeholder="Saldo inicial (Q)"
          value={form.saldoInicial}
          onChange={handleChange}
        />
        <input
          type="number"
          name="saldoFinal"
          placeholder="Saldo final esperado (Q)"
          value={form.saldoFinal}
          onChange={handleChange}
        />
        <input
          type="number"
          name="saldoContable"
          placeholder="Saldo contable total (Q)"
          value={form.saldoContable}
          onChange={handleChange}
        />

        <div className="acciones">
          <button className="btn guardar" onClick={handleGuardar}>Guardar</button>
          <button className="btn cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}