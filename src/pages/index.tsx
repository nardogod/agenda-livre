import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProfessionalList from '@/components/professionals/ProfessionalList';
import ZoneFilter from '@/components/filters/ZoneFilter';
import CategoryFilter from '@/components/filters/CategoryFilter';
import PriceFilter from '@/components/filters/PriceFilter';
import LocationFilter from '@/components/filters/LocationFilter';
import { useFilters } from '@/hooks/useFilters';
import { useProfessionals } from '@/hooks/useProfessionals';

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    selectedZones, 
    selectedCategories,
    selectedDistricts,
    priceRange,
    setSelectedZones,
    setSelectedCategories,
    setSelectedDistricts,
    setPriceRange,
    clearAllFilters,
    activeFilterCount
  } = useFilters();
  
  const { 
    professionals, 
    isLoading, 
    error, 
    featuredProfessionals 
  } = useProfessionals({ 
    zones: selectedZones, 
    categories: selectedCategories,
    districts: selectedDistricts,
    minPrice: priceRange[0],
    maxPrice: priceRange[1]
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Search and Filter Header */}
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl">
            <Search size={20} className="text-gray-text ml-1" />
            <input
              type="text"
              placeholder="Buscar profissionais ou serviços..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            />
            <button 
              onClick={toggleFilters}
              className="flex items-center px-2 py-1 rounded-lg bg-primary-light text-primary text-sm"
            >
              <Filter size={16} className="mr-1" />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Drawer */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
          showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-gray-50 transition-transform duration-300 transform ${
            showFilters ? 'translate-x-0' : 'translate-x-full'
          } p-5 overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filtros</h2>
              <button onClick={toggleFilters} className="p-1">
                <X size={24} />
              </button>
            </div>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 mb-4 border border-gray-200 rounded-xl text-gray-text text-sm font-medium"
              >
                Limpar todos os filtros
              </button>
            )}
            
            <div className="space-y-4">
              <ZoneFilter 
                selectedZones={selectedZones} 
                onChange={setSelectedZones}
                expanded={true}
              />
              
              <LocationFilter 
                selectedDistricts={selectedDistricts}
                onChange={setSelectedDistricts}
              />
              
              <CategoryFilter 
                selectedCategories={selectedCategories}
                onChange={setSelectedCategories}
              />
              
              <PriceFilter 
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-4">
          {/* Zone Quick Filters */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-2 whitespace-nowrap">
              {['Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste', 'Região Central'].map((zone, idx) => {
                const zoneId = ['north', 'south', 'east', 'west', 'central'][idx];
                const isSelected = selectedZones.includes(zoneId);
                
                return (
                  <button
                    key={zoneId}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedZones(selectedZones.filter(z => z !== zoneId));
                      } else {
                        setSelectedZones([...selectedZones, zoneId]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-gray-text border border-gray-200'
                    }`}
                  >
                    {zone}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Featured Professionals */}
          {featuredProfessionals && featuredProfessionals.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium">Em Destaque</h2>
                <button className="text-sm text-primary font-medium">Ver todos</button>
              </div>
              <ProfessionalList professionals={featuredProfessionals.slice(0, 3)} />
            </div>
          )}
          
          {/* Available Professionals */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Profissionais Disponíveis</h2>
              <button className="text-sm text-primary font-medium">Ver todos</button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
                Ocorreu um erro ao carregar os profissionais. Por favor, tente novamente.
              </div>
            ) : professionals && professionals.length > 0 ? (
              <ProfessionalList professionals={professionals} />
            ) : (
              <div className="bg-white p-6 rounded-xl text-center">
                <p className="text-gray-text">
                  Nenhum profissional encontrado com os filtros selecionados.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-4 text-primary font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}