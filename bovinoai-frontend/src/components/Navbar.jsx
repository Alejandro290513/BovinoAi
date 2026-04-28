import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">BovinoAI</div>
      <ul className="navbar-links">
        <li><Link to="/">Resumen</Link></li>
        <li><Link to="/animales">Animales</Link></li>
        <li><Link to="/costos">Costos</Link></li>
        <li><Link to="/asistente-ia">Asistente IA</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;