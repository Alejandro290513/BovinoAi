import React, { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  TrendingUp, 
  AlertTriangle, 
  Beef, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles,
  Activity
} from 'lucide-react';
import IAInsight from '../components/IAInsight';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ label, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} className="mr-1" />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const Resumen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setStats(response);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <div className="animate-spin mb-4 text-primary-600">
        <Activity size={48} />
      </div>
      <p className="font-medium">Sincronizando datos del hato...</p>
    </div>
  );

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-full text-red-500">
      <AlertTriangle size={48} className="mb-4" />
      <p className="font-medium">Error al cargar el resumen ejecutivo.</p>
    </div>
  );

  const chartData = {
    labels: ['Total Animales', 'En Etapa de Ceba'],
    datasets: [
      {
        label: 'Cantidad',
        data: [stats.totalAnimales, stats.animalesEnCeba],
        backgroundColor: ['#3b82f6', '#22c55e'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Resumen Ejecutivo</h1>
          <p className="text-slate-500">Estado actual y rendimiento de tu producción ganadera.</p>
        </div>
        <button 
          onClick={cargarDatos}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Actualizar Datos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Animales" 
          value={stats.totalAnimales} 
          icon={Beef} 
          colorClass="bg-blue-500" 
          trend="+2% vs mes anterior"
        />
        <StatCard 
          label="En Etapa de Ceba" 
          value={stats.animalesEnCeba} 
          icon={TrendingUp} 
          colorClass="bg-green-500" 
        />
        <StatCard 
          label="GDP Promedio (kg/día)" 
          value={stats.gdpPromedio?.toFixed(3) || '0.000'} 
          icon={Activity} 
          colorClass="bg-amber-500" 
        />
        <StatCard 
          label="Inversión Total" 
          value={`$${stats.inversionTotal?.toLocaleString() || '0'}`} 
          icon={DollarSign} 
          colorClass="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Distribución de Ganado</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full" /> Total
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-3 h-3 bg-green-500 rounded-full" /> Ceba
              </span>
            </div>
          </div>
          <div className="h-80">
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="text-lg font-bold text-slate-800">Alertas de Rendimiento</h3>
            </div>
            <div className="space-y-3">
              {stats.alertas && stats.alertas.length > 0 ? (
                stats.alertas.map((alerta, index) => (
                  <div key={index} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-amber-800">{alerta.identificacion}</span>
                      <span className="text-[10px] text-amber-600 font-medium uppercase">Crítico</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">{alerta.mensaje}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No hay alertas críticas.</p>
              )}
            </div>
          </div>

          <IAInsight title="Análisis Global del Hato">
            El motor de IA analizará pronto tus datos para optimizar la dieta y los tiempos de salida al mercado.
            <button className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-xs font-semibold backdrop-blur-sm">
              Configurar Motor IA
            </button>
          </IAInsight>

        </div>
      </div>
    </div>
  );
};

export default Resumen;
