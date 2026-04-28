import { useState, useEffect } from 'react';
import { crearAnimal, actualizarAnimal, getAnimal, getRazas } from '../services/api';
import { Calendar, Info, Weight, RotateCw } from 'lucide-react';

export default function AnimalForm({ onClose, onCreated, animalId }) {
  const [razas, setRazas] = useState([]);
  const [formData, setFormData] = useState({
    chapeta: '',
    idRaza: '',
    fechaNacimiento: '',
    sexo: 'M',
    etapa: 'cria',
    fechaIngreso: new Date().toISOString().split('T')[0],
    observaciones: '',
    pesoInicial: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        const razasData = await getRazas();
        setRazas(razasData);

        if (animalId) {
          const animal = await getAnimal(animalId);
          setFormData({
            chapeta: animal.chapeta,
            idRaza: animal.raza?.id || '',
            fechaNacimiento: animal.fechaNacimiento,
            sexo: animal.sexo,
            etapa: animal.etapa,
            fechaIngreso: animal.fechaIngreso,
            observaciones: animal.observaciones || '',
            pesoInicial: ''
          });
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosIniciales();
  }, [animalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const dataToSend = { ...formData, idRaza: parseInt(formData.idRaza) };
      if (!animalId && formData.pesoInicial) {
          dataToSend.pesoInicial = parseFloat(formData.pesoInicial);
      }
      
      if (animalId) {
        await actualizarAnimal(animalId, dataToSend);
      } else {
        await crearAnimal(dataToSend);
      }
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error guardando animal:', error.response?.data);
      alert('Error al guardar el animal. Verifique los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <div className="animate-spin mb-4 text-primary-600">
        <RotateCw size={32} />
      </div>
      <p>Cargando datos del formulario...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            Identificación (Chapeta)
          </label>
          <input 
            type="text" 
            value={formData.chapeta} 
            onChange={e => setFormData({...formData, chapeta: e.target.value})} 
            required 
            placeholder="Ej: B-102"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Raza</label>
          <select 
            value={formData.idRaza} 
            onChange={e => setFormData({...formData, idRaza: e.target.value})} 
            required 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
          >
            <option value="">Seleccione una raza</option>
            {razas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sexo</label>
            <div className="flex gap-2">
              {['M', 'H'].map(sexo => (
                <button
                  key={sexo}
                  type="button"
                  onClick={() => setFormData({...formData, sexo})}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                    formData.sexo === sexo 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sexo === 'M' ? 'Macho' : 'Hembra'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Etapa</label>
            <select 
              value={formData.etapa} 
              onChange={e => setFormData({...formData, etapa: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
            >
              <option value="cria">Cría</option>
              <option value="levante">Levante</option>
              <option value="ceba">Ceba</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={14} /> Fecha Nacimiento
          </label>
          <input 
            type="date" 
            value={formData.fechaNacimiento} 
            onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} 
            required 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={14} /> Fecha Ingreso
          </label>
          <input 
            type="date" 
            value={formData.fechaIngreso} 
            onChange={e => setFormData({...formData, fechaIngreso: e.target.value})} 
            required 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        {!animalId && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Weight size={14} /> Peso Inicial (kg)
            </label>
            <input 
              type="number" 
              step="0.1" 
              value={formData.pesoInicial} 
              onChange={e => setFormData({...formData, pesoInicial: e.target.value})} 
              placeholder="0.0"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Info size={14} /> Observaciones
          </label>
          <textarea 
            value={formData.observaciones} 
            onChange={e => setFormData({...formData, observaciones: e.target.value})} 
            rows="3"
            placeholder="Anotaciones sobre salud, comportamiento, etc."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all disabled:opacity-50 shadow-md shadow-primary-200"
        >
          {isSaving ? 'Guardando...' : (animalId ? 'Actualizar Animal' : 'Guardar Animal')}
        </button>
      </div>
    </form>
  );
}
