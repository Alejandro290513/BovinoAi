import { useState, useEffect } from 'react';
import { getAnimales, crearPesaje } from '../services/api';
import '../styles/PesajeForm.css';

export default function PesajeForm({ onPesajeCreado }) {
  const [animales, setAnimales] = useState([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [gdpCalculado, setGdpCalculado] = useState(null);

  const [formData, setFormData] = useState({
    fechaPesaje: new Date().toISOString().split('T')[0],
    pesoKg: '',
    condicionCorporal: '3',
    tipoPasto: 'pasto_natural',
    concentradoKg: '',
    mineralesG: '',
    consumoAguaLt: '',
    temperaturaCelsius: '',
    humedadPct: '',
    costoDiaCop: '',
  });

  useEffect(() => {
    cargarAnimales();
  }, []);

  const cargarAnimales = async () => {
    try {
      const data = await getAnimales();
      setAnimales(data);
    } catch (error) {
      console.error('Error loading animales:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar los animales' });
    }
  };

  const handleAnimalChange = (e) => {
    const id = parseInt(e.target.value);
    const animal = animales.find((a) => a.id === id);
    setAnimalSeleccionado(animal);
    setGdpCalculado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalSeleccionado) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un animal' });
      return;
    }

    if (!formData.pesoKg || !formData.concentradoKg) {
      setMensaje({ tipo: 'error', texto: 'Completa los campos obligatorios' });
      return;
    }

    try {
      setLoading(true);
      setMensaje(null);

      const payload = {
        fechaPesaje: formData.fechaPesaje,
        pesoKg: parseFloat(formData.pesoKg),
        condicionCorporal: parseFloat(formData.condicionCorporal),
        tipoPasto: formData.tipoPasto,
        concentradoKg: parseFloat(formData.concentradoKg),
        mineralesG: parseFloat(formData.mineralesG || 0),
        consumoAguaLt: parseFloat(formData.consumoAguaLt || 0),
        temperaturaCelsius: parseFloat(formData.temperaturaCelsius || 0),
        humedadPct: parseFloat(formData.humedadPct || 0),
        costoDiaCop: parseFloat(formData.costoDiaCop || 0),
      };

      const resultado = await crearPesaje(animalSeleccionado.id, payload);

      setGdpCalculado(resultado.gdpCalculado);
      setMensaje({
        tipo: 'exito',
        texto: `Pesaje registrado. GDP calculado: ${resultado.gdpCalculado?.toFixed(3)} kg/día`,
      });

      // Limpiar formulario
      setTimeout(() => {
        setFormData({
          fechaPesaje: new Date().toISOString().split('T')[0],
          pesoKg: '',
          condicionCorporal: '3',
          tipoPasto: 'pasto_natural',
          concentradoKg: '',
          mineralesG: '',
          consumoAguaLt: '',
          temperaturaCelsius: '',
          humedadPct: '',
          costoDiaCop: '',
        });
        setAnimalSeleccionado(null);
        setGdpCalculado(null);
        if (onPesajeCreado) onPesajeCreado();
      }, 2000);
    } catch (error) {
      console.error('Error creating pesaje:', error);
      setMensaje({ tipo: 'error', texto: 'Error al registrar el pesaje' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pesaje-form-container">
      <div className="form-header">
        <h2>Registrar Pesaje</h2>
        <p>Ingresa los datos del pesaje y el sistema calculará automáticamente el GDP</p>
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.tipo === 'exito' ? '✓' : '✕'} {mensaje.texto}
        </div>
      )}

      {gdpCalculado !== null && (
        <div className="gdp-resultado">
          <p>GDP calculado:</p>
          <div className="gdp-valor">{gdpCalculado.toFixed(3)} kg/día</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="pesaje-form">
        <div className="form-seccion">
          <h3>Datos del Animal</h3>

          <div className="form-group">
            <label htmlFor="animalSelect">Animal *</label>
            <select
              id="animalSelect"
              value={animalSeleccionado?.id || ''}
              onChange={handleAnimalChange}
              required
            >
              <option value="">-- Seleccionar animal --</option>
              {animales.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.chapeta} - {animal.raza.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaPesaje">Fecha del Pesaje *</label>
              <input
                type="date"
                id="fechaPesaje"
                name="fechaPesaje"
                value={formData.fechaPesaje}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pesoKg">Peso (kg) *</label>
              <input
                type="number"
                id="pesoKg"
                name="pesoKg"
                value={formData.pesoKg}
                onChange={handleInputChange}
                placeholder="Ej: 450.5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="condicionCorporal">Condición Corporal (1-5)</label>
              <select
                id="condicionCorporal"
                name="condicionCorporal"
                value={formData.condicionCorporal}
                onChange={handleInputChange}
              >
                <option value="1">1 - Muy Flaco</option>
                <option value="2">2 - Flaco</option>
                <option value="3">3 - Normal</option>
                <option value="4">4 - Gordo</option>
                <option value="5">5 - Muy Gordo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-seccion">
          <h3>Nutrición</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoPasto">Tipo de Pasto</label>
              <select
                id="tipoPasto"
                name="tipoPasto"
                value={formData.tipoPasto}
                onChange={handleInputChange}
              >
                <option value="pasto_natural">Pasto Natural</option>
                <option value="pasto_mejorado">Pasto Mejorado</option>
                <option value="ensilaje">Ensilaje</option>
                <option value="heno">Heno</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="concentradoKg">Concentrado (kg/día) *</label>
              <input
                type="number"
                id="concentradoKg"
                name="concentradoKg"
                value={formData.concentradoKg}
                onChange={handleInputChange}
                placeholder="Ej: 3.5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mineralesG">Minerales (g/día)</label>
              <input
                type="number"
                id="mineralesG"
                name="mineralesG"
                value={formData.mineralesG}
                onChange={handleInputChange}
                placeholder="Ej: 50"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="consumoAguaLt">Consumo de Agua (lt/día)</label>
            <input
              type="number"
              id="consumoAguaLt"
              name="consumoAguaLt"
              value={formData.consumoAguaLt}
              onChange={handleInputChange}
              placeholder="Ej: 40"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-seccion">
          <h3>Ambiente</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="temperaturaCelsius">Temperatura (°C)</label>
              <input
                type="number"
                id="temperaturaCelsius"
                name="temperaturaCelsius"
                value={formData.temperaturaCelsius}
                onChange={handleInputChange}
                placeholder="Ej: 28"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="humedadPct">Humedad (%)</label>
              <input
                type="number"
                id="humedadPct"
                name="humedadPct"
                value={formData.humedadPct}
                onChange={handleInputChange}
                placeholder="Ej: 75"
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="costoDiaCop">Costo del Día (COP)</label>
              <input
                type="number"
                id="costoDiaCop"
                name="costoDiaCop"
                value={formData.costoDiaCop}
                onChange={handleInputChange}
                placeholder="Ej: 45000"
                step="100"
              />
            </div>
          </div>
        </div>

        <div className="form-acciones">
          <button
            type="submit"
            className="btn-registrar"
            disabled={loading || !animalSeleccionado}
          >
            {loading ? 'Registrando...' : '✓ Registrar Pesaje'}
          </button>
        </div>
      </form>
    </div>
  );
}