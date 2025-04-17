import React, { useState, useEffect } from 'react';
import { MapPin, Star, Filter } from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import Link from 'next/link';
import Head from 'next/head';

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

export default function ProfessionalsList() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    zone: '',
    district: '',
    service: '',
    homeService: false,
    rating: 0,
    priceRange: [0, 1000]
  });

  // Simula a carga dos dados (em uma aplicação real, isso viria da API)
  useEffect(() => {
    // Dados mockados
    const mockProfessionals: Professional[] = [
      {
        id: 1,
        name: "Ana Oliveira",
        specialty: "Especialista em Tranças e Penteados",
        rating: 4.8,
        reviewCount: 124,
        location: {
          district: "Pinheiros",
          zone: "Zona Oeste"
        },
        profileImage: "/api/placeholder/300/300",
        services: [
          { name: "Box Braids", price: 250 },
          { name: "Twist Senegalês", price: 290 }
        ],
        homeService: true
      },
      {
        id: 2,
        name: "Carla Santos",
        specialty: "Trancista Profissional",
        rating: 4.9,
        reviewCount: 89,
        location: {
          district: "Vila Mariana",
          zone: "Zona Sul"
        },
        profileImage: "/api/placeholder/300/300",
        services: [
          { name: "Box Braids", price: 280 },
          { name: "Tranças Nagô", price: 240 }
        ],
        homeService: false
      },
      {
        id: 3,
        name: "Marcos Lima",
        specialty: "Cabeleireiro Afro",
        rating: 4.7,
        reviewCount: 67,
        location: {
          district: "Santana",
          zone: "Zona Norte"
        },
        profileImage: "/api/placeholder/300/300",
        services: [
          { name: "Corte Masculino Afro", price: 80 },
          { name: "Manutenção de Dreadlocks", price: 150 }
        ],
        homeService: true
      },
      {
        id: 4,
        name: "Juliana Costa",
        specialty: "Cacheados e Crespos",
        rating: 4.6,
        reviewCount: 103,
        location: {
          district: "Tatuapé",
          zone: "Zona Leste"
        },
        profileImage: "/api/placeholder/300/300",
        services: [
          { name: "Hidratação Intensiva", price: 120 },
          { name: "Corte para Cachos", price: 100 }
        ],
        homeService: false
      }
    ];
    
    setProfessionals(mockProfessionals);
    setLoading(false);
  }, []);

  // Função para filtrar profissionais (simplificada)
  const filteredProfessionals = professionals.filter(prof => {
    // Filtra por zona se um filtro de zona estiver ativo
    if (activeFilters.zone && prof.location.zone !== activeFilters.zone) {
      return false;
    }
    
    // Filtra por atendimento a domicílio
    if (activeFilters.homeService && !prof.homeService) {
      return false;
    }
    
    // Filtra por avaliação
    if (activeFilters.rating > 0 && prof.rating < activeFilters.rating) {
      return false;
    }
    
    return true;
  });

  const ProfessionalCard = ({ professional }: { professional: Professional }) => (
    <Link href={`/booking/${professional.id}`}>
      <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
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
            <span>Atende a domicílio</span>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <MainLayout>
      <Head>
        <title>Profissionais | Agenda Livre</title>
      </Head>
      
      <div className="bg-white py-3 px-4 flex justify-between items-center sticky top-0 z-10 border-b">
        <h1 className="text-lg font-medium">Profissionais</h1>
        <button 
          className="flex items-center text-sm text-gray-600"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-1" />
          Filtros {activeFilters.zone || activeFilters.homeService || activeFilters.rating > 0 ? 
            `(${Object.values(activeFilters).filter(f => f && f !== 0 && !Array.isArray(f)).length})` : ''}
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 border-b">
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
              onClick={() => setShowFilters(false)}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
      
      <div className="p-4">
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
    </MainLayout>
  );
}