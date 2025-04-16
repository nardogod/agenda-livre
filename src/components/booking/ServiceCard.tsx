// src/components/booking/ServiceCard.tsx
import React from 'react';
import { Clock } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <button 
      className="w-full bg-white p-4 rounded-xl mb-3 text-left hover:shadow-sm transition-all flex justify-between items-center border border-gray-100"
      onClick={() => onSelect(service)}
      aria-label={`Selecionar serviço ${service.name}`}
    >
      <div>
        <h3 className="font-medium text-base">{service.name}</h3>
        <div className="flex items-center mt-1 text-gray-500 text-xs">
          <Clock size={12} className="mr-1" />
          <span>{service.duration} min</span>
        </div>
        {service.description && (
          <p className="text-xs text-gray-500 mt-1">{service.description}</p>
        )}
      </div>
      <div className="text-right">
        <div className="font-medium">R$ {service.price.toFixed(2)}</div>
        <div className="text-xs text-purple-600 mt-1">Selecionar</div>
      </div>
    </button>
  );
};

export default ServiceCard;