// pages/index.jsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Sliders,
  X,
  Home
} from 'lucide-react';

// Importar serviços de API e componentes
import { professionalService } from '../services/api'; // Alterado de useMockData para professionalService
import MainButton from '../components/common/MainButton';

// Componente de Card do Profissional
function ProfessionalCard({ professional }) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow cursor-pointer"
      onClick={() => router.push(`/professional/${professional.id}`)}
    >
      {/* Imagem de Capa */}
      <div className="h-32 relative">
        <img 
          src={professional.coverImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Informações do Profissional */}
      <div className="p-4 -mt-10 relative">
        <div className="flex items-end mb-3">
          <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm">
            <img 
              src={professional.profileImage} 
              alt={professional.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="ml-3 pb-1">
            <h2 className="font-medium text-base">{professional.name}</h2>
            <div className="flex items-center mt-0.5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-xs">{professional.rating}</span>
              <span className="ml-1 text-xs text-gray-500">({professional.reviewCount})</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-purple-700 font-medium mb-2">{professional.specialty}</p>
        
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <MapPin size={14} className="mr-1 text-gray-500" />
          <span>{professional.location}</span>
        </div>
        
        {professional.offersHomeService && (
          <div className="flex items-center text-xs text-gray-600">
            <Home size={14} className="mr-1 text-purple-500" />
            <span>Atendimento a domicílio disponível</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de Filtro Expansível
function FilterSection({ title, children, initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  return (
    <div className="mb-4">
      <button 
        className="flex items-center justify-between w-full py-2 px-1 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-sm">{title}</h3>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {expanded && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Componente de Botão de Filtro
function FilterChip({ label, active, onClick }) {
  return (
    <button
      className={`mr-2 mb-2 px-3 py-1.5 rounded-lg text-sm ${
        active 
          ? "bg-purple-100 text-purple-700 font-medium" 
          : "bg-gray-100 text-gray-700"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    zone: '',
    district: '',
    service: '',
    homeService: false
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Zonas e distritos para filtros
  const zones = ['Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste', 'Região Central'];
  const districts = {
    'Zona Sul': ['Moema', 'Vila Mariana', 'Itaim Bibi', 'Brooklin'],
    'Zona Oeste': ['Pinheiros', 'Perdizes', 'Vila Madalena', 'Lapa'],
    'Zona Norte': ['Santana', 'Casa Verde', 'Mandaqui', 'Tucuruvi'],
    'Zona Leste': ['Tatuapé', 'Mooca', 'Anália Franco', 'Penha'],
    'Região Central': ['Centro', 'Bela Vista', 'Consolação', 'República']
  };
  
  // Categorias de serviços
  const serviceCategories = ['Tranças', 'Coloração', 'Cortes', 'Penteados', 'Barbearia', 'Tratamentos'];
  
  // Carregar dados dos profissionais
  useEffect(() => {
    async function loadProfessionals() {
      try {
        setLoading(true);
        // Usando professionalService.getAll() em vez de useMockData.getProfessionals()
        const response = await professionalService.getAll(filters);
        
        // Verificar e processar adequadamente os dados retornados
        if (Array.isArray(response)) {
          setProfessionals(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setProfessionals(response.data);
        } else if (response && response.results && Array.isArray(response.results)) {
          setProfessionals(response.results);
        } else {
          console.error('Formato de resposta desconhecido:', response);
          setProfessionals([]);
        }
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfessionals();
  }, [filters]);
  
  // Atualizar contagem de filtros ativos
  useEffect(() => {
    let count = 0;
    if (filters.zone) count++;
    if (filters.district) count++;
    if (filters.service) count++;
    if (filters.homeService) count++;
    
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Função para atualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value // Toggle se já estiver selecionado
    }));
  };
  
  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      zone: '',
      district: '',
      service: '',
      homeService: false
    });
  };
  
  // Filtrar os profissionais com base na pesquisa, garantindo que seja um array
  const filteredProfessionals = searchQuery && Array.isArray(professionals)
    ? professionals.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Array.isArray(professionals) ? professionals : [];
  
  return (
    <>
      <Head>
        <title>Agenda Livre - Encontre profissionais de beleza</title>
        <meta name="description" content="Agende serviços de beleza com os melhores profissionais da sua região." />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Header */}
        <div className="bg-purple-600 pt-6 pb-8 px-5">
          <h1 className="text-white text-xl font-medium mb-6">Agenda Livre</h1>
          
          {/* Campo de Busca */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar profissionais ou serviços..."
              className="w-full py-3 px-10 bg-white rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            {searchQuery && (
              <button 
                className="absolute right-3 top-3.5 text-gray-400"
                onClick={() => setSearchQuery('')}
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Filtros Rápidos */}
          <div className="flex items-center">
            <button className="flex items-center bg-white px-3 py-2 rounded-xl mr-3">
              <Sliders size={16} className="mr-2 text-purple-600" />
              <span className="text-sm">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <div className="overflow-x-auto flex-1 flex pb-1">
              <FilterChip 
                label="Zona Sul" 
                active={filters.zone === 'Zona Sul'} 
                onClick={() => updateFilter('zone', 'Zona Sul')}
              />
              <FilterChip 
                label="Zona Oeste" 
                active={filters.zone === 'Zona Oeste'} 
                onClick={() => updateFilter('zone', 'Zona Oeste')}
              />
              <FilterChip 
                label="A domicílio" 
                active={filters.homeService} 
                onClick={() => setFilters(prev => ({ ...prev, homeService: !prev.homeService }))}
              />
            </div>
          </div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="px-5 mt-5">
          {/* Seção de Filtros Avançados */}
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Filtros avançados</h2>
              {activeFiltersCount > 0 && (
                <button 
                  className="text-sm text-purple-600"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              )}
            </div>
            
            <FilterSection title="Zonas da cidade" initialExpanded={true}>
              <div className="flex flex-wrap">
                {zones.map(zone => (
                  <FilterChip 
                    key={zone}
                    label={zone} 
                    active={filters.zone === zone} 
                    onClick={() => updateFilter('zone', zone)}
                  />
                ))}
              </div>
            </FilterSection>
            
            {filters.zone && (
              <FilterSection title="Distritos" initialExpanded={true}>
                <div className="flex flex-wrap">
                  {districts[filters.zone]?.map(district => (
                    <FilterChip 
                      key={district}
                      label={district} 
                      active={filters.district === district} 
                      onClick={() => updateFilter('district', district)}
                    />
                  ))}
                </div>
              </FilterSection>
            )}
            
            <FilterSection title="Categoria de serviço">
              <div className="flex flex-wrap">
                {serviceCategories.map(service => (
                  <FilterChip 
                    key={service}
                    label={service} 
                    active={filters.service === service} 
                    onClick={() => updateFilter('service', service)}
                  />
                ))}
              </div>
            </FilterSection>
            
            <FilterSection title="Opções adicionais">
              <div className="flex items-center mt-2">
                <input 
                  type="checkbox" 
                  id="homeService" 
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={filters.homeService}
                  onChange={() => setFilters(prev => ({ ...prev, homeService: !prev.homeService }))} 
                />
                <label htmlFor="homeService" className="ml-2 text-sm text-gray-700">
                  Atendimento a domicílio
                </label>
              </div>
            </FilterSection>
          </div>
          
          {/* Lista de Profissionais */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-lg">Profissionais Disponíveis</h2>
              <button className="text-sm text-purple-600">Ver todos</button>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <p>Carregando profissionais...</p>
              </div>
            ) : filteredProfessionals.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl">
                <p className="text-gray-500">Nenhum profissional encontrado com os filtros atuais.</p>
                <button 
                  className="mt-3 text-purple-600 font-medium"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfessionals.map(professional => (
                  <ProfessionalCard 
                    key={professional.id} 
                    professional={professional} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}