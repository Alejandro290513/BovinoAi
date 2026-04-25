import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css';
 
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="main-header">
        <h1>BovinoAI - Panel de Control</h1>
        <nav className="main-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/animales">Animales</Link>
          <Link to="/costos">Costos</Link>
          <Link to="/motor-ia">Motor IA</Link>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
 
export default Layout;