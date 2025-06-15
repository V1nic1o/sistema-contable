import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <main className="dashboard-main">
        <h1>Bienvenido al sistema contable</h1>
        <p>Aquí podrás administrar cuentas, transacciones y reportes.</p>
      </main>
    </div>
  );
}