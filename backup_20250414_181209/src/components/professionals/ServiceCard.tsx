import React from 'react';
import { Clock } from 'lucide-react';

type ServiceCardProps = {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
  onSelect?: (serviceId: string) => void;
  selected?: boolean;
  className?: string;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  price,
  duration,
  onSelect,
  selected = false,
  className = '',
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <button 
      className={`
        w-full 
        bg-white 
        p-4 
        rounded-xl 
        mb-3 
        text-left 
        hover:shadow-sm 
        transition-all 
        flex 
        justify-between 
        items-center
        ${selected ? 'border-2 border-primary' : 'border border-gray-light'}
        ${onSelect ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
      onClick={handleClick}
      type="button"
    >
      <div>
        <h3 className="font-medium text-base text-black-text">{name}</h3>
        <div className="flex items-center mt-1 text-gray-text text-xs">
          <Clock size={12} className="mr-1" />
          <span>{duration} min</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-black-text">
          R$ {price.toFixed(2).replace('.', ',')}
        </div>
        {onSelect && (
          <div className="text-xs text-primary mt-1">
            {selected ? 'Selecionado' : 'Selecionar'}
          </div>
        )}
      </div>
    </button>
  );
};

export default ServiceCard;