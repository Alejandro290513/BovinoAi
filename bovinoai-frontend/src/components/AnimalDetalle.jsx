import { useState, useEffect } from 'react';
import { getAnimal, getPesajes, getCostos } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/AnimalDetalle.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnimalDetalle({ animalId, onClose }) {
  const [animal, setAnimal] = useState(null);
  const [pesajes, setPesajes] = useState([]);
  const [costos, setCostos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const [animalData, pesajesData, costosData] = await Promise.all([
          getAnimal(animalId).catch(() => null),
          getPesajes(animalId).catch(() => []),
          getCostos(animalId).catch(() => null)
        ]);
        
        if (!animalData) throw new Error("No se pudo cargar el animal");
        
        setAnimal(animalData);
        setPesajes(pesajesData || []);
        setCostos(costosData);
      } catch (error) {
        console.error('Error cargando detalle:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    cargarDetalle();
  }, [animalId]);

  if (loading) return <div className="modal-overlay"><div className="modal-content"><div className="modal-form">Cargando panel avanzado...</div></div></div>;
  if (error) return <div className="modal-overlay"><div className="modal-content"><div className="modal-form" style={{color: 'red'}}>{error}</div></div></div>;
  if (!animal) return null;

  // Cálculos seguros para el panel
  const primerPesaje = pesajes.length > 0 ? pesajes[0] : null;
  const ultimoPesaje = pesajes.length > 0 ? pesajes[pesajes.length - 1] : null;
  
  const calcularGDP = () => {
    if (pesajes.length < 2) return 0;
    
    // Aseguramos que pesoKg sea número (podría venir como cadena o objeto en algunos casos)
    const pesoInicial = typeof primerPesaje.pesoKg === 'object' ? primerPesaje.pesoKg.doubleValue || 0 : primerPesaje.pesoKg;
    const pesoFinal = typeof ultimoPesaje.pesoKg === 'object' ? ultimoPesaje.pesoKg.doubleValue || 0 : ultimoPesaje.pesoKg;
    
    const diffPeso = pesoFinal - pesoInicial;
    const fechaInicio = new Date(primerPesaje.fechaPesaje);
    const fechaFin = new Date(ultimoPesaje.fechaPesaje);
    const diffDias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
    
    return diffDias > 0 ? (diffPeso / diffDias).toFixed(3) : 0;
  };

  const chartData = {
    labels: pesajes.map(p => p.fechaPesaje),
    datasets: [{
      label: 'Peso (kg)',
      data: pesajes.map(p => typeof p.pesoKg === 'object' ? p.pesoKg.doubleValue || 0 : p.pesoKg),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      tension: 0.3
    }]
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content panel-avanzado">
        <header className="panel-header">
          <h2>Animal: {animal.chapeta}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </header>

        <div className="panel-body">
          <aside className="panel-sidebar">
            <h3>Indicadores Clave</h3>
            <div className="metric">
              <label>GDP Real</label>
              <p>{calcularGDP()} kg/día</p>
            </div>
            <div className="metric">
              <label>Inversión</label>
              <p>${costos?.costoAcumulado?.toLocaleString() || '0'}</p>
            </div>
            <div className="metric">
              <label>Punto Equilibrio</label>
              <p>{costos?.puntoEquilibrio ? costos.puntoEquilibrio.toFixed(2) : 'N/A'}</p>
            </div>
          </aside>

          <main className="panel-main">
            <h3>Evolución de Peso</h3>
            <div className="chart-wrapper">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </main>
        </div>

        <footer className="panel-footer">
          <h3>Observaciones</h3>
          <p>{animal.observaciones || 'Sin observaciones.'}</p>
        </footer>
      </div>
    </div>
  );
}
