import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Beef, 
  Coins, 
  Cpu, 
  MessageSquare, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-primary-600'} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto text-primary-200" />}
  </Link>
);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/animales', icon: Beef, label: 'Gestión Animal' },
    { to: '/costos', icon: Coins, label: 'Costos y ROI' },
    { to: '/motor-ia', icon: Cpu, label: 'Motor IA' },
    { to: '/asistente-ia', icon: MessageSquare, label: 'Asistente IA' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl text-slate-800 truncate">BovinoAI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-2 rounded-lg bg-slate-50 ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-700 truncate">Admin Usuario</p>
                <p className="text-xs text-slate-500 truncate">Ganadero Pro</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-700">
            {menuItems.find(item => item.to === location.pathname)?.label || 'Panel'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              Estado: Conectado
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
