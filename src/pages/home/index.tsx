// src/pages/home/index.tsx
import React, { useState, useEffect } from 'react';
import { Home, Search, Sliders } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { getProfessionals } from '../../services/professionals';

const HomePage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(professional => {
    // Filtrar por termo de busca (nome ou especialidade)
    const matchesSearch = searchTerm === '' || 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por zona
    const matchesZone = selectedZone === '' || professional.zone === selectedZone;
    
    // Filtrar por categoria
    const matchesCategory = selectedCategory === '' || professional.category === selectedCategory;
    
    return matchesSearch && matchesZone && matchesCategory;
  });

  // Opções para filtros
  const zones = [
    { id: 'north', name: 'Zona Norte' },
    { id: 'south', name: 'Zona Sul' },
    { id: 'east', name: 'Zona Leste' },
    { id: 'west', name: 'Zona Oeste' },
    { id: 'center', name: 'Centro' }
  ];

  const categories = [
    { id: 'hair', name: 'Cabelos' },
    { id: 'braids', name: 'Tranças' },
    { id: 'makeup', name: 'Maquiagem' },
    { id: 'nails', name: 'Unhas' },
    { id: 'barber', name: 'Barbearia' }
  ];

  return (
    <MainLayout>
      <div className="px-5 py-6">
        <h1 className="text-2xl font-medium mb-6">Agenda Livre</h1>
        
        {/* Barra de Pesquisa */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar serviços ou profissionais..."
            className="w-full p-3 pr-10 bg-white border border-gray-200 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-3 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        
        {/* Botão de Filtros */}
        <button 
          className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-xl mb-6"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Sliders size={16} className="mr-2" />
          Filtros
          {(selectedZone || selectedCategory) && (
            <span className="ml-2 px-2 py-0.5 bg-purple-100 rounded-full text-xs">
              {(selectedZone ? 1 : 0) + (selectedCategory ? 1 : 0)}
            </span>
          )}
        </button>
        
        {/* Seção de Filtros */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl mb-6">
            <h3 className="font-medium mb-3">Zonas</h3>
            <div className="flex flex-wrap mb-4">
              {zones.map(zone => (
                <button
                  key={zone.id}
                  className={`mr-2 mb-2 px-3 py-1.5 text-sm rounded-lg ${
                    selectedZone === zone.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? '' : zone.id)}
                >
                  {zone.name}
                </button>
              ))}
            </div>
            
            <h3 className="font-medium mb-3">Categorias</h3>
            <div className="flex flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`mr-2 mb-2 px-3 py-1.5 text-sm rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Lista de Profissionais */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Profissionais Disponíveis</h2>
            <button className="text-sm text-purple-600">Ver todos</button>
          </div>
          
          {loading ? (
            <p>Carregando profissionais...</p>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum profissional encontrado</p>
              <button 
                className="mt-4 text-purple-600"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedZone('');
                  setSelectedCategory('');
                }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map(professional => (
                <div 
                  key={professional.id} 
                  className="bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-xl overflow-hidden mr-3">
                      <img 
                        src={professional.profileImage || '/api/placeholder/300/300'} 
                        alt={professional.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{professional.name}</h3>
                      <p className="text-sm text-gray-500">{professional.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-yellow-400">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-700">{professional.rating}</span>
                        </div>
                        <div className="ml-3 text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                          {professional.zone === 'north' ? 'Zona Norte' :
                           professional.zone === 'south' ? 'Zona Sul' :
                           professional.zone === 'east' ? 'Zona Leste' :
                           professional.zone === 'west' ? 'Zona Oeste' : 'Centro'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button 
                      className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg text-sm"
                      onClick={() => window.location.href = `/professionals/${professional.id}`}
                    >
                      Ver perfil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;