import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Facturacion from './pages/Facturacion';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import logo from './assets/LOGO_AREPASAURIOS.png'; // Importa el logo

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo-container">
            <img src={logo} alt="Logo de la empresa" className="logo" />
          </div>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/inventario">Inventario</Link>
            </li>
            <li>
              <Link to="/facturacion">Facturación</Link>
            </li>
            <li>
              <Link to="/usuarios">Usuarios</Link>
            </li>
            <li>
              <Link to="/reportes">Reportes</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
