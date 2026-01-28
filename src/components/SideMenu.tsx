import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <nav className="space-y-2">
      <Link to="/dashboard">Inicio</Link>
      <Link to="/dashboard/properties">Propiedades</Link>
      <Link to="/dashboard/catalogs">Catálogos</Link>
      <Link to="/dashboard/appointments">Citas</Link>
      <Link to="/dashboard/contracts">Contratos</Link>
      <Link to="/dashboard/transactions">Transacciones</Link>
    </nav>
  );
}
