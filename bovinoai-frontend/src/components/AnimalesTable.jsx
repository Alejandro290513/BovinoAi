import { useState, useEffect } from 'react';
import { getAnimales } from '../services/api';
import { Search, RotateCw, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      (animal.chapeta && animal.chapeta.toLowerCase().includes(valor.toLowerCase())) ||
      (animal.raza && animal.raza.toLowerCase().includes(valor.toLowerCase()))
    );
    setFiltrados(resultado);
  };

  const getAlertaBadge = (alerta) => {
    if (!alerta) return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <CheckCircle2 size={12} /> Normal
      </span>
    );
    
    if (alerta.includes('CRITICO')) return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
        <AlertCircle size={12} /> Crítico
      </span>
    );
    
    if (alerta.includes('BAJO')) return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
        <AlertCircle size={12} /> Advertencia
      </span>
    );

    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
        <AlertCircle size={12} /> Atención
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <div className="animate-spin mb-4 text-primary-600">
        <RotateCw size={32} />
      </div>
      <p>Cargando inventario de animales...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-12 text-red-500">
      <AlertCircle size={32} className="mb-4" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registro de Animales</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por chapeta o raza..."
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <th className="px-6 py-4">Chapeta</th>
              <th className="px-6 py-4">Raza</th>
              <th className="px-6 py-4">Etapa</th>
              <th className="px-6 py-4">Sexo</th>
              <th className="px-6 py-4 text-right">Últ. Peso</th>
              <th className="px-6 py-4 text-right">GDP</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.length > 0 ? (
              filtrados.map((animal) => (
                <tr key={animal.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700">{animal.chapeta}</td>
                  <td className="px-6 py-4 text-slate-600">{animal.raza}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium capitalize">
                      {animal.etapa}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {animal.sexo === 'M' ? 'Macho' : 'Hembra'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {animal.ultimoPeso !== null && animal.ultimoPeso !== undefined ? `${animal.ultimoPeso.toFixed(2)} kg` : '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {animal.gdpReciente !== null && animal.gdpReciente !== undefined ? `${animal.gdpReciente.toFixed(3)} kg/d` : '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getAlertaBadge(animal.alertas)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      onClick={() => onSelectAnimal(animal.id)}
                    >
                      <Eye size={14} />
                      Detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-slate-500 italic">
                  No se encontraron animales que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <p>Mostrando <span className="font-semibold text-slate-700">{filtrados.length}</span> de <span className="font-semibold text-slate-700">{animales.length}</span> animales</p>
        <button 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors font-medium" 
          onClick={cargarAnimales}
        >
          <RotateCw size={14} />
          Sincronizar
        </button>
      </div>
    </div>
  );
}
