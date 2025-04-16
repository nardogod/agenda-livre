import React, { useState } from 'react';
import { MapPin, Star, Filter, Home } from 'lucide-react';
import Link from 'next/link';

// Tipos
interface Professional {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: {
    district: string;
    zone: string;
  };
  profileImage: string;
  services: {
    name: string;
    price: number;
  }[];
  homeService: boolean;
}

interface ProfessionalsListProps {
  professionals: Professional[];
  loading?: boolean;
  showFilters?: boolean;
  onlyShowTopRated?: boolean;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({ 
  professionals, 
  loading = false,
  showFilters = true,
  onlyShowTopRated = false
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    zone: '',
    district: '',
    service: '',
    homeService: false,
    rating: 0,
    priceRange: [0, 1000]
  });

  // Filtrar profissionais com base nos filtros ativos
  const filteredProfessionals = professionals.filter(prof => {
    // Filtrar por zona se um filtro de zona estiver ativo
    if (activeFilters.zone && prof.location.zone !== activeFilters.zone) {
      return false;
    }
    
    // Filtrar por atendimento a domicílio
    if (activeFilters.homeService && !prof.homeService) {
      return false;
    }
    
    // Filtrar por avaliação
    if (activeFilters.rating > 0 && prof.rating < activeFilters.rating) {
      return false;
    }
    
    // Para a página inicial, talvez mostraremos apenas os mais bem avaliados
    if (onlyShowTopRated && prof.rating < 4.5) {
      return false;
    }
    
    return true;
  });

  const ProfessionalCard = ({ professional }: { professional: Professional }) => (
    <Link href={`/booking/${professional.id}`}>
      <div className="bg-white p-4 rounded-xl mb-4 shadow-sm hover:shadow transition-all">
        <div className="flex">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-100">
            <img 
              src={professional.profileImage} 
              alt={professional.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium">{professional.name}</h3>
            <p className="text-xs text-purple-700">{professional.specialty}</p>
            
            <div className="flex items-center mt-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs ml-1">{professional.rating} ({professional.reviewCount})</span>
            </div>
            
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <MapPin size={12} className="mr-1" />
              <span>{professional.location.district}, </span>
              <span className="ml-1 px-1 bg-gray-100 rounded text-gray-600">
                {professional.location.zone}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Serviços a partir de:</p>
          <div className="flex justify-between">
            <div className="text-sm">
              {professional.services[0]?.name}
            </div>
            <div className="font-medium text-purple-600">
              R$ {professional.services[0]?.price.toFixed(2)}
            </div>
          </div>
        </div>
        
        {professional.homeService && (
          <div className="mt-2 bg-purple-50 text-purple-700 text-xs py-1 px-2 rounded inline-flex items-center">
            <Home size={12} className="mr-1" />
            <span>Atende a domicílio</span>
          </div>
        )}
      </div>
    </Link>
  );

  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">Profissionais Disponíveis</h2>
          <button 
            className="flex items-center text-sm text-gray-600"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <Filter size={16} className="mr-1" />
            Filtros {activeFilters.zone || activeFilters.homeService || activeFilters.rating > 0 ? 
              `(${Object.values(activeFilters).filter(f => f && f !== 0 && !Array.isArray(f)).length})` : ''}
          </button>
        </div>
        
        {filtersVisible && (
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <h2 className="font-medium mb-3">Filtrar por:</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Zona</h3>
              <div className="flex flex-wrap gap-2">
                {['Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste', 'Região Central'].map(zone => (
                  <button 
                    key={zone}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilters.zone === zone ? 
                      'bg-purple-600 text-white' : 
                      'bg-white border border-gray-200'
                    }`}
                    onClick={() => setActiveFilters({
                      ...activeFilters,
                      zone: activeFilters.zone === zone ? '' : zone
                    })}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Avaliação mínima</h3>
              <div className="flex gap-2">
                {[0, 4, 4.5, 4.8].map(rating => (
                  <button 
                    key={rating}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeFilters.rating === rating ? 
                      'bg-purple-600 text-white' : 
                      'bg-white border border-gray-200'
                    }`}
                    onClick={() => setActiveFilters({
                      ...activeFilters,
                      rating: activeFilters.rating === rating ? 0 : rating
                    })}
                  >
                    {rating > 0 ? `${rating}+` : 'Todos'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 mr-2"
                  checked={activeFilters.homeService}
                  onChange={() => setActiveFilters({
                    ...activeFilters,
                    homeService: !activeFilters.homeService
                  })}
                />
                <span className="text-sm">Atende a domicílio</span>
              </label>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="text-sm text-gray-600"
                onClick={() => setActiveFilters({
                  zone: '',
                  district: '',
                  service: '',
                  homeService: false,
                  rating: 0,
                  priceRange: [0, 1000]
                })}
              >
                Limpar filtros
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg"
                onClick={() => setFiltersVisible(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {renderFilters()}
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map(professional => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum profissional encontrado com os filtros atuais.</p>
              <button 
                className="mt-2 text-purple-600 text-sm"
                onClick={() => setActiveFilters({
                  zone: '',
                  district: '',
                  service: '',
                  homeService: false,
                  rating: 0,
                  priceRange: [0, 1000]
                })}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfessionalsList;