import { useState, useEffect } from 'react';
import { getCostos } from '../services/api';
import { 
  DollarSign, 
  Target, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Scale
} from 'lucide-react';
import IAInsight from './IAInsight';

export default function CostoCard({ idAnimal }) {
  const [costos, setCostos] = useState(null);
  const [precioMercado, setPrecioMercado] = useState(9000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idAnimal) {
      cargarCostos();
    }
  }, [idAnimal, precioMercado]);

  const cargarCostos = async () => {
    try {
      setLoading(true);
      const response = await getCostos(idAnimal, precioMercado);
      setCostos(response.data);
    } catch (err) {
      console.error('Error al cargar costos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!idAnimal) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-20">
        <div className="p-4 bg-slate-100 rounded-full">
          <DollarSign size={48} />
        </div>
        <p className="text-lg font-medium">Selecciona un animal para analizar su rentabilidad</p>
      </div>
    );
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
      <div className="animate-spin mb-4 text-primary-600">
        <Activity size={32} />
      </div>
      <p>Calculando proyecciones financieras...</p>
    </div>
  );

  if (!costos) return (
    <div className="flex flex-col items-center justify-center h-full text-red-400 py-20">
      <AlertCircle size={48} className="mb-4" />
      <p>No se encontraron datos financieros para este animal.</p>
    </div>
  );

  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const evaluarConversion = (conversion) => {
    if (conversion < 6) return { estado: 'Excelente', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} /> };
    if (conversion < 8) return { estado: 'Bueno', color: 'bg-yellow-100 text-yellow-700', icon: <CheckCircle2 size={14} /> };
    return { estado: 'Alto', color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} /> };
  };

  const conversionEval = evaluarConversion(costos.conversionAlimenticia);

  return (
    <div className="space-y-8">
      {/* Market Price Simulation */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Scale size={18} className="text-primary-600" />
            Simulador de Mercado
          </h3>
          <p className="text-sm text-slate-500">Ajusta el precio por kg para ver el impacto en la rentabilidad.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={precioMercado}
              onChange={(e) => setPrecioMercado(Number(e.target.value))}
              step="100"
              className="pl-7 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-32 font-bold text-slate-700"
            />
          </div>
          <span className="text-sm font-medium text-slate-500">COP / kg</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <DollarSign size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Costo Acumulado</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCOP(costos.costoAcumulado)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Costo total de inversión</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Activity size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Conversión</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-slate-800">{costos.conversionAlimenticia.toFixed(2)}:1</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${conversionEval.color} flex items-center gap-1`}>
              {conversionEval.icon} {conversionEval.estado}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Alimento consumido vs Ganancia peso</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Pto. Equilibrio</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{costos.puntoEquilibrio.toFixed(1)} kg</p>
          <p className="text-[10px] text-slate-400 mt-1">Peso mínimo para no perder dinero</p>
        </div>

        <div className={`p-4 rounded-xl border shadow-sm transition-colors ${
          costos.margenBruto >= 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${
              costos.margenBruto >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              <TrendingUp size={18} />
            </div>
            <span className={`text-xs font-semibold uppercase ${
              costos.margenBruto >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>Margen Bruto</span>
          </div>
          <p className={`text-xl font-bold ${
            costos.margenBruto >= 0 ? 'text-green-800' : 'text-red-800'
          }`}>
            {formatCOP(costos.margenBruto)}
          </p>
          <p className={`text-[10px] font-medium mt-1 ${
            costos.margenBruto >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {costos.margenBruto >= 0 ? 'Ganancia proyectada' : 'Pérdida proyectada'}
          </p>
        </div>
      </div>

      {/* Detailed Analysis and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info size={18} className="text-primary-600" />
            Desglose de Rentabilidad
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-500">Peso Actual</span>
              <span className="font-bold text-slate-700">{costos.pesoActual.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-500">Valor de Mercado</span>
              <span className="font-bold text-slate-700">{formatCOP(costos.pesoActual * precioMercado)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-500">Inversión (Costos)</span>
              <span className="font-bold text-red-600">-{formatCOP(costos.costoAcumulado)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-800">Resultado Neto</span>
              <span className={`font-bold text-lg ${
                costos.margenBruto >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCOP(costos.margenBruto)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" />
            Diagnóstico Financiero
          </h3>
          <div className="space-y-3">
            <IAInsight type={costos.margenBruto >= 0 ? "success" : "danger"}>
              {costos.margenBruto >= 0 
                ? "Este animal presenta una rentabilidad positiva. La IA recomienda mantener la dieta actual y monitorear el peso semanalmente." 
                : "Alerta de rentabilidad: Se recomienda revisar el costo del alimento o adelantar la fecha de venta para mitigar pérdidas."}
            </IAInsight>
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm flex gap-3">
              <Info className="text-slate-400 shrink-0" size={20} />
              <p>ROI Actual: <strong>{((costos.margenBruto / costos.costoAcumulado) * 100).toFixed(2)}%</strong> de retorno sobre la inversión.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
