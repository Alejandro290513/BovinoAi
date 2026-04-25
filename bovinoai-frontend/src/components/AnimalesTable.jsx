import { useState, useEffect } from 'react';
import { getAnimales } from '../services/api';
import '../styles/AnimalesTable.css';

export default function AnimalesTable({ onSelectAnimal, onRefresh }) {
  const [animales, setAnimales] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarAnimales();
  }, [onRefresh]);

  const cargarAnimales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnimales();
      setAnimales(data);
      setFiltrados(data);
    } catch (err) {
      setError('Error al cargar los animales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    const resultado = animales.filter((animal) =>
      animal.chapeta.toLowerCase().includes(valor.toLowerCase()) ||
      animal.raza.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    setFiltrados(resultado);
  };

  const getAlertaColor = (alerta) => {
    if (!alerta) return 'alerta-normal';
    if (alerta.includes('CRITICO')) return 'alerta-roja';
    if (alerta.includes('BAJO')) return 'alerta-amarilla';
    return 'alerta-naranja';
  };

  if (loading) return <div className="tabla-loading">Cargando animales...</div>;
  if (error) return <div className="tabla-error">{error}</div>;

  return (
    <div className="animales-table-container">
      <div className="tabla-header">
        <h2>Registro de Animales</h2>
        <input
          type="text"
          placeholder="Buscar por chapeta o raza..."
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          className="tabla-busqueda"
        />
      </div>

      <div className="tabla-wrapper">
        <table className="animales-tabla">
          <thead>
            <tr>
              <th>Chapeta</th>
              <th>Raza</th>
              <th>Etapa</th>
              <th>Sexo</th>
              <th>Último Peso (kg)</th>
              <th>GDP (kg/día)</th>
              <th>Alerta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((animal) => (
                <tr key={animal.id} className="tabla-row">
                  <td className="chapeta">{animal.chapeta}</td>
                  <td>{animal.raza.nombre}</td>
                  <td>{animal.etapa}</td>
                  <td>{animal.sexo === 'M' ? 'Macho' : 'Hembra'}</td>
                  <td className="peso">
                    {animal.ultimoPeso ? animal.ultimoPeso.toFixed(2) : 'N/A'}
                  </td>
                  <td className="gdp">
                    {animal.gdpUltimo ? animal.gdpUltimo.toFixed(3) : 'N/A'}
                  </td>
                  <td className={`alerta ${getAlertaColor(animal.alerta)}`}>
                    {animal.alerta ? animal.alerta : '✓ Normal'}
                  </td>
                  <td className="acciones">
                    <button
                      className="btn-ver"
                      onClick={() => onSelectAnimal(animal.id)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="tabla-vacia">
                  No se encontraron animales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tabla-footer">
        <p>Total: {filtrados.length} de {animales.length} animales</p>
        <button className="btn-reload" onClick={cargarAnimales}>
          ↻ Actualizar
        </button>
      </div>
    </div>
  );
}