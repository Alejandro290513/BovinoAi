import { useState } from 'react';
import PesajeForm from '../components/PesajeForm';
import '../styles/Pesaje.css';

export default function Pesaje() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePesajeCreado = () => {
    // Puede usarse para actualizar datos en otras secciones de la página
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="pesaje-page">
      <div className="page-banner">
        <h1>Módulo de Pesaje</h1>
        <p>Registra los pesajes de tus animales y el sistema calculará automáticamente el GDP</p>
      </div>

      <PesajeForm key={refreshKey} onPesajeCreado={handlePesajeCreado} />

      <div className="info-section">
        <div className="info-card">
          <h3>¿Qué es el GDP?</h3>
          <p>
            La Ganancia Diaria de Peso (GDP) es el aumento de peso promedio del animal por día.
            Se calcula automáticamente comparando el peso actual con el pesaje anterior.
          </p>
        </div>

        <div className="info-card">
          <h3>Recomendaciones</h3>
          <ul>
            <li>Realiza pesajes cada 7 a 14 días para mayor precisión</li>
            <li>Pesa a los animales a la misma hora del día</li>
            <li>Registra la condición corporal para mejor seguimiento</li>
            <li>Mantén el historial de nutrición completo</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Datos Opcionales</h3>
          <p>
            Los campos de temperatura, humedad y consumo de agua ayudan al sistema a analizar
            el impacto del ambiente en el crecimiento del animal. Complétalo cuando sea posible.
          </p>
        </div>
      </div>
    </div>
  );
}