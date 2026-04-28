import React, { useState } from 'react';
import AnimalesTable from '../components/AnimalesTable';
import AnimalForm from '../components/AnimalForm';
import AnimalDetalle from '../components/AnimalDetalle';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Animales = () => {
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Animales</h1>
          <p className="text-slate-500">Controla el inventario, crecimiento y estado de salud de tu hato.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
          onClick={() => {
            setSelectedAnimalId(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} />
          Nuevo Animal
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AnimalesTable 
          onSelectAnimal={(id) => {
            setSelectedAnimalId(id);
            setShowDetalle(true);
          }} 
          onRefresh={refreshKey}
        />
      </div>
      
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={selectedAnimalId ? 'Editar Animal' : 'Registrar Nuevo Animal'}
      >
        <AnimalForm 
          animalId={selectedAnimalId} 
          onClose={() => setShowForm(false)} 
          onCreated={() => {
            handleRefresh();
            setShowForm(false);
          }}
        />
      </Modal>

      <Modal 
        isOpen={showDetalle} 
        onClose={() => setShowDetalle(false)} 
        title="Detalle del Animal"
      >
        {selectedAnimalId && (
          <AnimalDetalle 
            animalId={selectedAnimalId} 
            onClose={() => setShowDetalle(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

export default Animales;
