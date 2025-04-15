// components/professional/ProfessionalService.jsx
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

export default function ProfessionalService({ service, onSelect }) {
  return (
    <button 
      className="w-full bg-white p-4 rounded-xl text-left hover:shadow-sm transition-all flex items-center"
      onClick={onSelect}
    >
      {service.image && (
        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={service.image} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="font-medium text-base">{service.name}</h3>
        <div className="flex items-center mt-1 text-gray-500 text-xs">
          <Clock size={12} className="mr-1" />
          <span>{service.duration} min</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium">R$ {service.price.toFixed(2)}</div>
        <div className="text-xs text-purple-600 mt-1 flex items-center">
          <span>Selecionar</span>
          <ChevronRight size={14} className="ml-1" />
        </div>
      </div>
    </button>
  );
}