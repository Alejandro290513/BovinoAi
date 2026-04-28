import React, { useState } from 'react';
import AnimalesTable from '../components/AnimalesTable';
import CostoCard from '../components/CostoCard';
import { Coins, TrendingUp, BarChart3 } from 'lucide-react';

const Costos = () => {
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Análisis de Costos y Rentabilidad</h1>
          <p className="text-slate-500">Visualiza el desempeño financiero y el retorno de inversión de tu hato.</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Coins size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Mercado Promedio</p>
              <p className="text-sm font-bold text-slate-800">$ 9,200 / kg</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Animal Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-600" />
                Seleccionar Animal
              </h2>
            </div>
            <AnimalesTable onSelectAnimal={setSelectedAnimalId} />
          </div>
        </div>
        
        {/* Right: Financial Analysis */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[600px] flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary-600" />
                Análisis Financiero Detallado
              </h2>
            </div>
            <div className="p-6 flex-1">
              <CostoCard idAnimal={selectedAnimalId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costos;
