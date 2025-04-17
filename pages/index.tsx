import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, ChevronRight, Star, MapPin, Home as HomeIcon } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';

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

// Categorias mockadas
const categories = [
  { id: 1, name: 'Box Braids', icon: '💇🏾‍♀️' },
  { id: 2, name: 'Crespos', icon: '👩🏾‍🦱' },
  { id: 3, name: 'Cacheados', icon: '👩🏽‍🦱' },
  { id: 4, name: 'Cortes', icon: '✂️' },
  { id: 5, name: 'Coloração', icon: '🎨' },
  { id: 6, name: 'Tranças', icon: '💆🏾‍♀️' }
];

// Zonas mockadas para filtro rápido
const zones = [
  { id: 'north', name: 'Zona Norte' },
  { id: 'south', name: 'Zona Sul' },
  { id: 'east', name: 'Zona Leste' },
  { id: 'west', name: 'Zona Oeste' },
  { id: 'center', name: 'Centro' }
];

export default function Home() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('');

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
        profileImage: "/images/profile-placeholder.jpg",
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
        profileImage: "/images/profile-placeholder.jpg",
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
        profileImage: "/images/profile-placeholder.jpg",
        services: [
          { name: "Corte Masculino Afro", price: 80 },
          { name: "Manutenção de Dreadlocks", price: 150 }
        ],
        homeService: true
      }
    ];
    
    setProfessionals(mockProfessionals);
    setLoading(false);
  }, []);

  // Filtrar profissionais por zona
  const filteredProfessionals = selectedZone 
    ? professionals.filter(prof => prof.location.zone === selectedZone)
    : professionals;

  const ProfessionalCard = ({ professional }: { professional: Professional }) => (
    <Link href={`/booking/${professional.id}`}>
      <div className="bg-white p-4 rounded-xl mb-4 shadow-sm hover:shadow transition-all duration-200">
        <div className="flex">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-100">
            <img 
              src={professional.profileImage} 
              alt={professional.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium text-gray-800">{professional.name}</h3>
            <p className="text-xs text-purple-600 font-medium">{professional.specialty}</p>
            
            <div className="flex items-center mt-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs ml-1 text-gray-500">{professional.rating} ({professional.reviewCount})</span>
            </div>
            
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <MapPin size={12} className="mr-1" />
              <span>{professional.location.district}, </span>
              <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
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
          <div className="mt-2 bg-purple-50 text-purple-700 text-xs py-1 px-2 rounded-full inline-flex items-center">
            <HomeIcon size={12} className="mr-1" />
            <span>Atende a domicílio</span>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <MainLayout>
      <Head>
        <title>Agenda Livre - Agendamento para Profissionais de Beleza</title>
        <meta 
          name="description" 
          content="Encontre e agende profissionais especializados em cuidados para cabelos crespos, cacheados e tranças." 
        />
      </Head>
      
      {/* Hero Section */}
      <div className="bg-purple-600 text-white px-4 pt-4 pb-8">
        <h1 className="text-2xl font-medium mb-2">Encontre especialistas em cabelos</h1>
        <p className="text-purple-100 mb-6">Agendamento simples e rápido com os melhores profissionais</p>
        
        {/* Barra de pesquisa */}
        <div className="relative">
          <Link href="/search" className="block">
            <input
              type="text"
              placeholder="Buscar profissionais ou serviços"
              className="w-full p-3 pl-10 bg-white border-0 rounded-xl focus:ring-0 text-gray-800"
              readOnly
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        {/* Categorias */}
        <div className="mb-6">
          <h2 className="font-medium mb-3 text-gray-800">Categorias</h2>
          <div className="flex overflow-x-auto pb-2 -mx-1 hide-scrollbar">
            {categories.map(category => (
              <Link 
                href={`/search?category=${category.id}`} 
                key={category.id}
                className="flex flex-col items-center px-4 py-3 mx-1 bg-white rounded-xl min-w-[80px] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-xs font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Filtro rápido por zonas */}
        <div className="mb-5">
          <div className="flex overflow-x-auto py-1 -mx-1 hide-scrollbar">
            <button 
              className={`px-3 py-1.5 mx-1 text-sm rounded-full whitespace-nowrap ${
                selectedZone === '' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
              onClick={() => setSelectedZone('')}
            >
              Todas as zonas
            </button>
            
            {zones.map(zone => (
              <button 
                key={zone.id}
                className={`px-3 py-1.5 mx-1 text-sm rounded-full whitespace-nowrap ${
                  selectedZone === zone.name ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.name ? '' : zone.name)}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Profissionais em destaque */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-800">Profissionais em Destaque</h2>
            <Link href="/professionals" className="text-sm text-purple-600 font-medium flex items-center">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredProfessionals.length > 0 ? (
            filteredProfessionals.map(professional => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))
          ) : (
            <div className="text-center py-6 bg-white rounded-xl">
              <p className="text-gray-500">Nenhum profissional encontrado nesta zona.</p>
              <button 
                className="mt-2 text-purple-600 text-sm font-medium"
                onClick={() => setSelectedZone('')}
              >
                Ver todas as zonas
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}