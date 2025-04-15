import React, { useState, useEffect } from 'react';
import FilterGroup from './FilterGroup';

type PriceFilterProps = {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  expanded?: boolean;
  className?: string;
};

export const PriceFilter: React.FC<PriceFilterProps> = ({
  value,
  onChange,
  min = 0,
  max = 500,
  expanded = false,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [isActive, setIsActive] = useState(false);
  
  // Detecta se o filtro está ativo (diferente dos valores padrão)
  useEffect(() => {
    const isDefault = value[0] === min && value[1] === max;
    setIsActive(!isDefault);
  }, [value, min, max]);
  
  // Atualiza o valor local quando o valor externo muda
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(min, Math.min(parseInt(e.target.value) || min, localValue[1]));
    setLocalValue([newMin, localValue[1]]);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(max, Math.max(parseInt(e.target.value) || max, localValue[0]));
    setLocalValue([localValue[0], newMax]);
  };
  
  const handleBlur = () => {
    onChange(localValue);
  };
  
  const handleReset = () => {
    onChange([min, max]);
  };
  
  return (
    <FilterGroup 
      title="Faixa de Preço" 
      expanded={expanded} 
      badge={isActive ? 1 : 0}
      className={className}
    >
      <div className="pt-2">
        <div className="relative h-1 bg-gray-200 rounded-full mb-5">
          {/* Range track */}
          <div 
            className="absolute h-1 bg-primary rounded-full"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
            }}
          ></div>
          
          {/* Min thumb */}
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -mt-2 transform -translate-x-1/2 cursor-pointer"
            style={{ left: `${((localValue[0] - min) / (max - min)) * 100}%` }}
          ></div>
          
          {/* Max thumb */}
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -mt-2 transform -translate-x-1/2 cursor-pointer"
            style={{ left: `${((localValue[1] - min) / (max - min)) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <div className="w-24">
            <label className="block text-xs text-gray-text mb-1">Mínimo</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-text">R$</span>
              <input
                type="number"
                value={localValue[0]}
                onChange={handleMinChange}
                onBlur={handleBlur}
                min={min}
                max={localValue[1]}
                className="w-full pl-7 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          
          <div className="w-24">
            <label className="block text-xs text-gray-text mb-1">Máximo</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-text">R$</span>
              <input
                type="number"
                value={localValue[1]}
                onChange={handleMaxChange}
                onBlur={handleBlur}
                min={localValue[0]}
                max={max}
                className="w-full pl-7 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
        
        {isActive && (
          <button
            type="button"
            className="mt-3 text-xs text-primary font-medium"
            onClick={handleReset}
          >
            Limpar filtro
          </button>
        )}
      </div>
    </FilterGroup>
  );
};

export default PriceFilter;