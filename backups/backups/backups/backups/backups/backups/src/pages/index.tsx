import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, MapPin, Star, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Componentes de filtro
import FilterGroup from '../components/filters/FilterGroup';
import CategoryFilter from '../components/filters/CategoryFilter';
import ZoneFilter from '../components/filters/ZoneFilter';
import LocationFilter from '../components/filters/LocationFilter';
import PriceFilter from '../components/filters/PriceFilter';

// Cards de profissionais
import ProfessionalList from '../components/professionals/ProfessionalList';

// Dados mockados (temporários)
import { professionals } from '../utils/mockData';

export default function HomePage() {
  // Estados para controle de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para cada grupo de filtro
  const [expandedFilters, setExpandedFilters] = useState({
    categories: false,
    zones: false,
    districts: false,
    price: false
  });
  
  // Filtros selecionados
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  // Função para alternar a visibilidade de um grupo de filtros
  const toggleFilterGroup = (group) => {
    setExpandedFilters({
      ...expandedFilters,
      [group]: !expandedFilters[group]
    });
  };
  
  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedZones([]);
    setSelectedDistricts([]);
    setPriceRange([0, 500]);
    setActiveFilters(0);
  };
  
  // Atualiza o contador de filtros ativos
  React.useEffect(() => {
    const count = 
      selectedCategories.length + 
      selectedZones.length + 
      selectedDistricts.length + 
      (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);
    
    setActiveFilters(count);
  }, [selectedCategories, selectedZones, selectedDistricts, priceRange]);
  
  // Filtra os profissionais baseado nos filtros selecionados
  const filteredProfessionals = React.useMemo(() => {
    return professionals.filter(professional => {
      // Filtro por pesquisa
      if (searchQuery && !professional.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !professional.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoria
      if (selectedCategories.length > 0 && 
          !professional.categories.some(cat => selectedCategories.includes(cat))) {
        return false;
      }
      
      // Filtro por zona
      if (selectedZones.length > 0 && !selectedZones.includes(professional.zone)) {
        return false;
      }
      
      // Filtro por distrito
      if (selectedDistricts.length > 0 && !selectedDistricts.includes(professional.district)) {
        return false;
      }
      
      // Filtro por preço (baseado no preço mínimo dos serviços)
      const minPrice = Math.min(...professional.services.map(s => s.price));
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, selectedCategories, selectedZones, selectedDistricts, priceRange]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Barra de pesquisa */}
        <div className="relative mt-4 mb-6">
          <input
            type="text"
            placeholder="Buscar serviço ou profissional..."
            className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        
        {/* Seção de filtros */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <button 
                className="flex items-center text-gray-700 font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {activeFilters > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {activeFilters}
                  </span>
                )}
                {showFilters ? (
                  <ChevronUp size={18} className="ml-1" />
                ) : (
                  <ChevronDown size={18} className="ml-1" />
                )}
              </button>
            </div>
            
            {activeFilters > 0 && (
              <button 
                className="text-sm text-purple-600 font-medium"
                onClick={clearAllFilters}
              >
                Limpar filtros
              </button>
            )}
          </div>
          
          {/* Grupos de filtros */}
          {showFilters && (
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <FilterGroup 
                title="Categorias" 
                expanded={expandedFilters.categories}
                toggleExpanded={() => toggleFilterGroup('categories')}
              >
                <CategoryFilter 
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </FilterGroup>
              
              <FilterGroup 
                title="Zonas" 
                expanded={expandedFilters.zones}
                toggleExpanded={() => toggleFilterGroup('zones')}
              >
                <ZoneFilter 
                  selectedZones={selectedZones}
                  setSelectedZones={setSelectedZones}
                />
              </FilterGroup>
              
              <FilterGroup 
                title="Distritos" 
                expanded={expandedFilters.districts}
                toggleExpanded={() => toggleFilterGroup('districts')}
              >
                <LocationFilter 
                  selectedDistricts={selectedDistricts}
                  setSelectedDistricts={setSelectedDistricts}
                />
              </FilterGroup>
              
              <FilterGroup 
                title="Faixa de Preço" 
                expanded={expandedFilters.price}
                toggleExpanded={() => toggleFilterGroup('price')}
              >
                <PriceFilter 
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </FilterGroup>
            </div>
          )}
        </div>
        
        {/* Seção de categorias populares */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Categorias Populares</h2>
          <div className="flex overflow-x-auto py-2 -mx-1 hide-scrollbar">
            {['Tranças', 'Penteados', 'Make', 'Barba', 'Manicure', 'Massagem'].map((category, index) => (
              <button
                key={index}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2 mx-1 text-sm font-medium hover:border-purple-300 hover:bg-purple-50 transition-colors"
                onClick={() => {
                  if (!selectedCategories.includes(category)) {
                    setSelectedCategories([...selectedCategories, category]);
                    setExpandedFilters({...expandedFilters, categories: true});
                    setShowFilters(true);
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Seção de profissionais */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Profissionais Disponíveis</h2>
            <a href="/professionals" className="text-sm text-purple-600 font-medium">
              Ver todos
            </a>
          </div>
          
          {/* Lista de profissionais filtrados */}
          <ProfessionalList professionals={filteredProfessionals} />
          
          {filteredProfessionals.length === 0 && (
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-gray-500">Nenhum profissional encontrado com os filtros selecionados.</p>
              <button 
                className="mt-3 text-purple-600 font-medium"
                onClick={clearAllFilters}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}