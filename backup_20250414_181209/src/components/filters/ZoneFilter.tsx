import React from 'react';
import FilterGroup from './FilterGroup';

type Zone = {
  id: string;
  name: string;
};

const zones: Zone[] = [
  { id: 'north', name: 'Zona Norte' },
  { id: 'south', name: 'Zona Sul' },
  { id: 'east', name: 'Zona Leste' },
  { id: 'west', name: 'Zona Oeste' },
  { id: 'central', name: 'Região Central' },
];

type ZoneFilterProps = {
  selectedZones: string[];
  onChange: (zones: string[]) => void;
  expanded?: boolean;
  className?: string;
};

export const ZoneFilter: React.FC<ZoneFilterProps> = ({
  selectedZones,
  onChange,
  expanded = false,
  className = '',
}) => {
  const handleToggleZone = (zoneId: string) => {
    if (selectedZones.includes(zoneId)) {
      onChange(selectedZones.filter(id => id !== zoneId));
    } else {
      onChange([...selectedZones, zoneId]);
    }
  };

  return (
    <FilterGroup 
      title="Zonas" 
      expanded={expanded} 
      badge={selectedZones.length}
      className={className}
    >
      <div className="space-y-2">
        {zones.map((zone) => (
          <div key={zone.id} className="flex items-center">
            <input
              type="checkbox"
              id={`zone-${zone.id}`}
              checked={selectedZones.includes(zone.id)}
              onChange={() => handleToggleZone(zone.id)}
              className="h-4 w-4 text-primary border-gray-medium rounded"
            />
            <label 
              htmlFor={`zone-${zone.id}`} 
              className="ml-2 text-sm text-gray-text cursor-pointer"
            >
              {zone.name}
            </label>
          </div>
        ))}
      </div>
      
      {selectedZones.length > 0 && (
        <button
          type="button"
          className="mt-3 text-xs text-primary font-medium"
          onClick={() => onChange([])}
        >
          Limpar filtros
        </button>
      )}
    </FilterGroup>
  );
};

export default ZoneFilter;