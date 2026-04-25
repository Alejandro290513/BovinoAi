import { useState } from 'react';
import { getAnimales } from '../services/api';
import CostosCard from './CostosCard';
import './../styles/Costos.css';

export default function Costos() {
  const [animales, setAnimales] = useState([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnimalesList, setShowAnimalesList] = useState(false);

  const cargarAnimales = async () => {
    try {
      setLoading(true);
      const data = await getAnimales();
      setAnimales(data);
      setShowAnimalesList(true);
    } catch (error) {
      console.error('Error loading animales:', error);
      alert('Error al cargar los animales');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarAnimal = (animal) => {
    setAnimalSeleccionado(animal);
    setShowAnimalesList(false);
  };

  return (
    <div className="costos-page">
      <div className="page-header">
        <h1>Análisis de Costos y Rentabilidad</h1>
        <p>Visualiza el desempeño financiero de tus animales</p>
      </div>

      {/* SECCIÓN: SELECCIÓN DE ANIMAL */}
      <div className="animal-selector">
        <div className="selector-header">
          {animalSeleccionado ? (
            <div className="animal-seleccionado">
              <div className="animal-info">
                <span className="animal-chapeta">{animalSeleccionado.chapeta}</span>
                <span className="animal-raza">{animalSeleccionado.raza.nombre}</span>
              </div>
              <button className="btn-cambiar" onClick={cargarAnimales}>
                Cambiar Animal
              </button>
            </div>
          ) : (
            <button className="btn-seleccionar" onClick={cargarAnimales} disabled={loading}>
              {loading ? 'Cargando...' : 'Seleccionar Animal'}
            </button>
          )}
        </div>

        {showAnimalesList && (
          <div className="animales-dropdown-list">
            {animales.length > 0 ? (
              animales.map((animal) => (
                <div
                  key={animal.id}
                  className="dropdown-item"
                  onClick={() => seleccionarAnimal(animal)}
                >
                  <div className="dropdown-item-main">
                    <strong>{animal.chapeta}</strong>
                    <span className="dropdown-item-raza">{animal.raza.nombre}</span>
                  </div>
                  <div className="dropdown-item-meta">
                    {animal.etapa} • {animal.peso || 'Sin pesaje'}kg
                  </div>
                </div>
              ))
            ) : (
              <div className="dropdown-item disabled">No hay animales disponibles</div>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN: ANÁLISIS DE COSTOS */}
       {animalSeleccionado ? (
         <CostosCard idAnimal={animalSeleccionado.id} />
       ) : (
        <div className="sin-seleccion">
          <div className="sin-seleccion-icono">📊</div>
          <h2>Selecciona un animal</h2>
          <p>Elige un animal del hato para ver su análisis de costos y rentabilidad</p>
        </div>
      )}
    </div>
  );
}