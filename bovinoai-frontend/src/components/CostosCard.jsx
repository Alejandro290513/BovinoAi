import { useState, useEffect } from 'react';
import { getCostos } from '../services/api';
import './../styles/CostosCard.css';

export default function CostoCard({ idAnimal }) {
  const [costos, setCostos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [precioMercado, setPrecioMercado] = useState(9200);

  useEffect(() => {
    if (idAnimal) {
      cargarCostos();
    }
  }, [idAnimal]);

  const cargarCostos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCostos(idAnimal);
      setCostos(data);
    } catch (err) {
      setError('Error al cargar los costos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioChange = (e) => {
    setPrecioMercado(parseFloat(e.target.value) || 0);
  };

  if (loading) return <div className="costos-loading">Cargando costos...</div>;
  if (error) return <div className="costos-error">{error}</div>;
  if (!costos) return <div className="costos-vacio">No hay datos de costos</div>;

  // Calcular margen bruto estimado
  const margenBruto = costos.pesoActual * precioMercado - costos.costoAcumulado;
  const margenPorcentaje = ((margenBruto / (costos.pesoActual * precioMercado)) * 100).toFixed(2);
  const rentabilidad = margenBruto > 0 ? 'Rentable' : 'No Rentable';
  const colorRentabilidad = margenBruto > 0 ? 'positivo' : 'negativo';

  // Determinar semáforo de conversión
  let estadoConversion = 'excelente';
  if (costos.conversionAlimenticia > 8) estadoConversion = 'critico';
  else if (costos.conversionAlimenticia > 7.5) estadoConversion = 'malo';
  else if (costos.conversionAlimenticia > 7) estadoConversion = 'regular';
  else if (costos.conversionAlimenticia > 6) estadoConversion = 'bueno';

  return (
    <div className="costos-container">
      {/* SECCIÓN 1: CONTROL DE PRECIO */}
      <div className="precio-control">
        <label htmlFor="precioMercado">Precio de Mercado (COP/kg):</label>
        <div className="precio-input-group">
          <input
            type="number"
            id="precioMercado"
            value={precioMercado}
            onChange={handlePrecioChange}
            step="100"
            min="0"
          />
          <span className="precio-display">$ {precioMercado.toLocaleString('es-CO')}</span>
        </div>
        <p className="precio-hint">Actualiza el precio de mercado para recalcular rentabilidad</p>
      </div>

      {/* SECCIÓN 2: INDICADORES PRINCIPALES */}
      <div className="indicadores-grid">
        <div className="indicador-card">
          <div className="indicador-icono">💰</div>
          <div className="indicador-contenido">
            <div className="indicador-label">Costo Acumulado</div>
            <div className="indicador-valor">
              $ {costos.costoAcumulado.toLocaleString('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="indicador-sublabel">
              Costo/kg: ${(costos.costoAcumulado / costos.pesoActual).toLocaleString('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="indicador-card">
          <div className="indicador-icono">🎯</div>
          <div className="indicador-contenido">
            <div className="indicador-label">Conversión Alimenticia</div>
            <div className={`indicador-valor ${estadoConversion}`}>
              {costos.conversionAlimenticia.toFixed(2)}:1
            </div>
            <div className="indicador-sublabel">
              {estadoConversion === 'excelente' && 'Excelente desempeño'}
              {estadoConversion === 'bueno' && 'Buen desempeño'}
              {estadoConversion === 'regular' && 'Desempeño regular'}
              {estadoConversion === 'malo' && 'Bajo desempeño'}
              {estadoConversion === 'critico' && 'Crítico: revisar dieta'}
            </div>
          </div>
        </div>

        <div className="indicador-card">
          <div className="indicador-icono">📊</div>
          <div className="indicador-contenido">
            <div className="indicador-label">Punto de Equilibrio</div>
            <div className="indicador-valor">{costos.puntoEquilibrio.toFixed(2)} kg</div>
            <div className="indicador-sublabel">
              Peso mínimo para rentabilidad
            </div>
          </div>
        </div>

        <div className={`indicador-card ${colorRentabilidad}`}>
          <div className="indicador-icono">
            {margenBruto > 0 ? '✓' : '✗'}
          </div>
          <div className="indicador-contenido">
            <div className="indicador-label">Margen Bruto</div>
            <div className="indicador-valor">
              $ {margenBruto.toLocaleString('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="indicador-sublabel">
              {margenPorcentaje}% de margen
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: ANÁLISIS DETALLADO */}
      <div className="analisis-section">
        <h3>Análisis Detallado</h3>

        <div className="analisis-grid">
          <div className="analisis-card">
            <div className="analisis-titulo">Proyección de Ingresos</div>
            <div className="analisis-contenido">
              <div className="analisis-item">
                <span>Peso Actual:</span>
                <strong>{costos.pesoActual.toFixed(2)} kg</strong>
              </div>
              <div className="analisis-item">
                <span>Valor a Precio Actual:</span>
                <strong>
                  $ {(costos.pesoActual * precioMercado).toLocaleString('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </div>
            </div>
          </div>

          <div className="analisis-card">
            <div className="analisis-titulo">Eficiencia</div>
            <div className="analisis-contenido">
              <div className="analisis-item">
                <span>Días en Etapa:</span>
                <strong>{costos.diasEnEtapa} días</strong>
              </div>
              <div className="analisis-item">
                <span>Costo/Día Promedio:</span>
                <strong>
                  $ {(costos.costoAcumulado / costos.diasEnEtapa).toLocaleString('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </div>
            </div>
          </div>

          <div className="analisis-card">
            <div className="analisis-titulo">Rentabilidad</div>
            <div className="analisis-contenido">
              <div className={`rentabilidad-estado ${colorRentabilidad}`}>
                {rentabilidad}
              </div>
              <div className="analisis-item">
                <span>ROI (Retorno de Inversión):</span>
                <strong>
                  {((margenBruto / costos.costoAcumulado) * 100).toFixed(2)}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: ALERTAS */}
      {costos.alertasActivas && costos.alertasActivas.length > 0 && (
        <div className="alertas-section">
          <h3>Alertas Activas</h3>
          <div className="alertas-list">
            {costos.alertasActivas.map((alerta, idx) => (
              <div key={idx} className={`alerta ${alerta.tipo.toLowerCase()}`}>
                <div className="alerta-icono">⚠️</div>
                <div className="alerta-contenido">
                  <div className="alerta-titulo">{alerta.tipo}</div>
                  <div className="alerta-descripcion">{alerta.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 5: RECOMENDACIONES */}
      <div className="recomendaciones-section">
        <h3>Recomendaciones</h3>
        <ul className="recomendaciones-list">
          {costos.conversionAlimenticia > 7 && (
            <li>
              <strong>Dieta:</strong> La conversión alimenticia es alta. Considera aumentar el
              concentrado o mejorar la calidad del pasto.
            </li>
          )}
          {costos.pesoActual < costos.puntoEquilibrio && (
            <li>
              <strong>Venta:</strong> El animal aún no alcanza el punto de equilibrio. Sigue
              alimentándolo para mejorar margen.
            </li>
          )}
          {margenBruto < 0 && (
            <li>
              <strong>Urgente:</strong> El animal tiene margen negativo. Evalúa venderlo o
              ajustar costos inmediatamente.
            </li>
          )}
          {costos.diasEnEtapa > 180 && (
            <li>
              <strong>Tiempo:</strong> El animal lleva más de 6 meses en esta etapa. Considera
              cambiar de fase productiva.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}