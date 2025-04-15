import React from 'react';
import { Clock, Check } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  selected: boolean;
  onSelect: (service: any) => void;
}

export default function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button 
      className={`w-full bg-white p-4 rounded-xl text-left hover:shadow-sm transition-all flex justify-between items-center ${
        selected ? 'border-2 border-purple-600' : 'border border-gray-200'
      }`}
      onClick={() => onSelect(service)}
    >
      <div>
        <h3 className="font-medium text-base">{service.name}</h3>
        <div className="flex items-center mt-1 text-gray-500 text-xs">
          <Clock size={12} className="mr-1" />
          <span>{service.duration} min</span>
        </div>
      </div>
      <div className="text-right flex items-center">
        <div className="font-medium mr-3">R$ {service.price.toFixed(2)}</div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>
    </button>
  );
}