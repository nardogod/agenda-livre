import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProfessionalsList from '../components/professionals/ProfessionalsList';

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

export default function Home() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    ];
    
    setProfessionals(mockProfessionals);
    setLoading(false);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Agenda Livre - Agendamento para Profissionais de Beleza</title>
        <meta 
          name="description" 
          content="Encontre e agende profissionais especializados em cuidados para cabelos crespos, cacheados e tranças." 
        />
      </Head>
      
      <div className="p-4">
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar profissionais ou serviços"
              className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
        
        {/* Categorias */}
        <div className="mb-6">
          <h2 className="font-medium mb-3">Categorias</h2>
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {categories.map(category => (
              <Link 
                href={`/search?category=${category.id}`} 
                key={category.id}
                className="flex flex-col items-center px-4 py-3 mx-1 bg-white rounded-xl min-w-[80px]"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-xs">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Profissionais em destaque */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">Profissionais em Destaque</h2>
            <Link href="/professionals" className="text-sm text-purple-600 flex items-center">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          
          <ProfessionalsList 
            professionals={professionals} 
            loading={loading} 
            showFilters={false} 
            onlyShowTopRated={true}
          />
        </div>
      </div>
    </Layout>
  );
}