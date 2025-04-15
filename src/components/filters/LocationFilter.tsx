import React, { useState } from 'react';
import FilterGroup from './FilterGroup';

type District = {
  id: string;
  name: string;
  zone: string;
};

// Exemplo de distritos organizados por zonas
const districts: District[] = [
  // Zona Norte
  { id: 'santana', name: 'Santana', zone: 'north' },
  { id: 'tucuruvi', name: 'Tucuruvi', zone: 'north' },
  { id: 'jaçanã', name: 'Jaçanã', zone: 'north' },
  { id: 'tremembé', name: 'Tremembé', zone: 'north' },
  
  // Zona Sul
  { id: 'moema', name: 'Moema', zone: 'south' },
  { id: 'vila_mariana', name: 'Vila Mariana', zone: 'south' },
  { id: 'itaim_bibi', name: 'Itaim Bibi', zone: 'south' },
  { id: 'campo_belo', name: 'Campo Belo', zone: 'south' },
  { id: 'brooklin', name: 'Brooklin', zone: 'south' },
  
  // Zona Leste
  { id: 'tatuapé', name: 'Tatuapé', zone: 'east' },
  { id: 'mooca', name: 'Mooca', zone: 'east' },
  { id: 'penha', name: 'Penha', zone: 'east' },
  { id: 'itaquera', name: 'Itaquera', zone: 'east' },
  
  // Zona Oeste
  { id: 'pinheiros', name: 'Pinheiros', zone: 'west' },
  { id: 'lapa', name: 'Lapa', zone: 'west' },
  { id: 'perdizes', name: 'Perdizes', zone: 'west' },
  { id: 'butantã', name: 'Butantã', zone: 'west' },
  
  // Região Central
  { id: 'sé', name: 'Sé', zone: 'central' },
  { id: 'bela_vista', name: 'Bela Vista', zone: 'central' },
  { id: 'república', name: 'República', zone: 'central' },
  { id: 'consolação', name: 'Consolação', zone: 'central' },
];

type LocationFilterProps = {
  selectedDistricts: string[];
  onChange: (districts: string[]) => void;
  expanded?: boolean;
  selectedZones?: string[];
  className?: string;
};

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedDistricts,
  onChange,
  expanded = false,
  selectedZones = [],
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleToggleDistrict = (districtId: string) => {
    if (selectedDistricts.includes(districtId)) {
      onChange(selectedDistricts.filter(id => id !== districtId));
    } else {
      onChange([...selectedDistricts, districtId]);
    }
  };
  
  // Filtra distritos com base na pesquisa e zonas selecionadas
  const filteredDistricts = districts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZones.length === 0 || selectedZones.includes(district.zone);
    return matchesSearch && matchesZone;
  });

  return (
    <FilterGroup 
      title="Bairros" 
      expanded={expanded} 
      badge={selectedDistricts.length}
      className={className}
    >
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar bairro..."
            className="w-full p-2 pr-8 border border-gray-200 rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchTerm('')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-48 overflow-y-auto pr-1">
        {filteredDistricts.length > 0 ? (
          filteredDistricts.map((district) => (
            <div key={district.id} className="flex items-center py-1">
              <input
                type="checkbox"
                id={`district-${district.id}`}
                checked={selectedDistricts.includes(district.id)}
                onChange={() => handleToggleDistrict(district.id)}
                className="h-4 w-4 text-primary border-gray-medium rounded"
              />
              <label 
                htmlFor={`district-${district.id}`} 
                className="ml-2 text-sm text-gray-text cursor-pointer flex-1"
              >
                {district.name}
              </label>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                district.zone === 'north' ? 'bg-blue-50 text-blue-600' :
                district.zone === 'south' ? 'bg-green-50 text-green-600' :
                district.zone === 'east' ? 'bg-yellow-50 text-yellow-600' :
                district.zone === 'west' ? 'bg-purple-50 text-purple-600' :
                'bg-gray-50 text-gray-600'
              }`}>
                {district.zone === 'north' ? 'Norte' :
                 district.zone === 'south' ? 'Sul' :
                 district.zone === 'east' ? 'Leste' :
                 district.zone === 'west' ? 'Oeste' : 'Central'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-sm text-gray-text">
            Nenhum bairro encontrado
          </div>
        )}
      </div>
      
      {selectedDistricts.length > 0 && (
        <button
          type="button"
          className="mt-3 text-xs text-primary font-medium"
          onClick={() => onChange([])}
        >
          Limpar bairros
        </button>
      )}
    </FilterGroup>
  );
};

export default LocationFilter;