import { useState, useEffect } from 'react';
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
import { getPesajes } from '../services/api';
import '../styles/GraficaCrecimiento.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraficaCrecimiento({ idAnimal, raza }) {
  const [pesajes, setPesajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idAnimal) {
      cargarPesajes();
    }
  }, [idAnimal]);

  const cargarPesajes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPesajes(idAnimal);
      setPesajes(data.sort((a, b) => new Date(a.fechaPesaje) - new Date(b.fechaPesaje)));
    } catch (err) {
      setError('Error al cargar los pesajes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="grafica-loading">Cargando datos...</div>;
  if (error) return <div className="grafica-error">{error}</div>;
  if (pesajes.length === 0)
    return <div className="grafica-vacia">No hay pesajes registrados</div>;

  // Preparar datos para la gráfica
  const labels = pesajes.map((p) =>
    new Date(p.fechaPesaje).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
    })
  );

  const pesoReal = pesajes.map((p) => p.pesoKg);

  // Calcular peso esperado basado en la curva de crecimiento de la raza
  const pesoEsperado = pesajes.map((p, idx) => {
    if (!raza || !raza.curvasCrecimiento) return null;

    const fechaPesaje = new Date(p.fechaPesaje);
    const fechaNacimiento = new Date(p.animal?.fechaNacimiento || 0);
    const diasVida = Math.floor(
      (fechaPesaje - fechaNacimiento) / (1000 * 60 * 60 * 24)
    );
    const meses = Math.floor(diasVida / 30);

    // Interpolación simple de la curva
    if (meses <= 1) return raza.curvasCrecimiento[0]?.kg || pesoReal[idx];
    if (meses >= 24) return raza.curvasCrecimiento[23]?.kg || pesoReal[idx];

    const curve = raza.curvasCrecimiento[meses - 1];
    return curve?.kg || pesoReal[idx];
  });

  const chart = {
    labels,
    datasets: [
      {
        label: 'Peso Real',
        data: pesoReal,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
      {
        label: 'Peso Esperado (Raza)',
        data: pesoEsperado.filter((p) => p !== null),
        borderColor: '#bdc3c7',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: '600' },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Curva de Crecimiento',
        font: { size: 18, weight: 'bold' },
        padding: 20,
        color: '#2c3e50',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: '#fff',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          afterLabel(context) {
            if (context.datasetIndex === 0 && pesajes[context.dataIndex]) {
              const pesaje = pesajes[context.dataIndex];
              return `GDP: ${pesaje.gdpCalculado?.toFixed(3) || 'N/A'} kg/día`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Peso (kg)',
          font: { size: 14, weight: '600' },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha de Pesaje',
          font: { size: 14, weight: '600' },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  // Calcular estadísticas
  const ultimoPesaje = pesajes[pesajes.length - 1];
  const gdpPromedio =
    pesajes.reduce((sum, p) => sum + (p.gdpCalculado || 0), 0) / pesajes.length;
  const gananciaTotal = pesoReal[pesoReal.length - 1] - pesoReal[0];

  return (
    <div className="grafica-crecimiento-container">
      <div className="grafica-card">
        <Line data={chart} options={options} height={300} />
      </div>

      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <div className="estadistica-label">Peso Actual</div>
          <div className="estadistica-valor">{ultimoPesaje.pesoKg.toFixed(2)} kg</div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-label">GDP Promedio</div>
          <div className="estadistica-valor">{gdpPromedio.toFixed(3)} kg/día</div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-label">Ganancia Total</div>
          <div className="estadistica-valor">{gananciaTotal.toFixed(2)} kg</div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-label">Pesajes Registrados</div>
          <div className="estadistica-valor">{pesajes.length}</div>
        </div>
      </div>

      <div className="pesajes-recientes">
        <h3>Últimos 5 Pesajes</h3>
        <table className="tabla-pesajes">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Peso (kg)</th>
              <th>GDP (kg/día)</th>
              <th>Condición</th>
            </tr>
          </thead>
          <tbody>
            {pesajes.slice(-5).reverse().map((pesaje, idx) => (
              <tr key={idx}>
                <td>{new Date(pesaje.fechaPesaje).toLocaleDateString('es-CO')}</td>
                <td className="peso">{pesaje.pesoKg.toFixed(2)}</td>
                <td className={pesaje.gdpCalculado > 0 ? 'gdp-positivo' : 'gdp-negativo'}>
                  {pesaje.gdpCalculado?.toFixed(3) || 'N/A'}
                </td>
                <td>{pesaje.condicionCorporal.toFixed(1)}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}