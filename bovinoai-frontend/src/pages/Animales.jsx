import React from 'react';
import '../styles/AnimalesPage.css';
import '../styles/AnimalesTable.css';

const Animales = () => {
  return (
    <div className="animales-page">
      <div className="page-header">
        <h1>Gestión de Animales</h1>
        <button className="btn-nuevo-animal">+ Nuevo Animal</button>
      </div>
      
      {/* Aquí irá tu componente AnimalesTable */}
      <div className="animales-table-container">
        <p className="tabla-vacia">No hay animales registrados aún.</p>
      </div>
    </div>
  );
};

export default Animales;