import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

const IAInsight = ({ title = "Sugerencia de BovinoAI", children, type = "info" }) => {
  const styles = {
    info: "bg-primary-600 text-white shadow-primary-200",
    warning: "bg-amber-500 text-white shadow-amber-200",
    success: "bg-green-600 text-white shadow-green-200",
    danger: "bg-red-600 text-white shadow-red-200",
  };

  return (
    <div className={`relative p-4 rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-[1.01] ${styles[type] || styles.info}`}>
      <div className="relative z-10 flex gap-3">
        <div className="p-2 bg-white/20 rounded-lg h-fit">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2 mb-1">
            {title}
            <Lightbulb size={14} className="opacity-70" />
          </h4>
          <div className="text-sm opacity-90 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
      {/* Decorative Background Element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default IAInsight;
