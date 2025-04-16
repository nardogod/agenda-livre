import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProfessionalsList from '../components/professionals/ProfessionalsList';
import MainLayout from '../components/layout/MainLayout';

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

export default function Search() {
  const router = useRouter();
  const { q, category } = router.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Atualiza o termo de busca quando o parâmetro 'q' muda
  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchTerm(q);
    }
  }, [q]);

  // Simula a busca de profissionais
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);

      // Dados mockados
      const allProfessionals: Professional[] = [
        {
          id: 1,
          name: "Ana Oliveira",
          specialty: "Especialista em Tranças e Penteados",
          rating: 4.8,
          reviewCount: 124,
          location: { district: "Pinheiros", zone: "Zona Oeste" },
          profileImage: "/api/placeholder/300/300",
          services: [
            { name: "Box Braids", price: 250 },
            { name: "Twist Senegalês", price: 290 },
          ],
          homeService: true,
        },
        {
          id: 2,
          name: "Carla Santos",
          specialty: "Trancista Profissional",
          rating: 4.9,
          reviewCount: 89,
          location: { district: "Vila Mariana", zone: "Zona Sul" },
          profileImage: "/api/placeholder/300/300",
          services: [
            { name: "Box Braids", price: 280 },
            { name: "Tranças Nagô", price: 240 },
          ],
          homeService: false,
        },
        {
          id: 3,
          name: "Marcos Lima",
          specialty: "Cabeleireiro Afro",
          rating: 4.7,
          reviewCount: 67,
          location: { district: "Santana", zone: "Zona Norte" },
          profileImage: "/api/placeholder/300/300",
          services: [
            { name: "Corte Masculino Afro", price: 80 },
            { name: "Manutenção de Dreadlocks", price: 150 },
          ],
          homeService: true,
        },
        {
          id: 4,
          name: "Juliana Costa",
          specialty: "Cacheados e Crespos",
          rating: 4.6,
          reviewCount: 103,
          location: { district: "Tatuapé", zone: "Zona Leste" },
          profileImage: "/api/placeholder/300/300",
          services: [
            { name: "Hidratação Intensiva", price: 120 },
            { name: "Corte para Cachos", price: 100 },
          ],
          homeService: false,
        },
      ];

      // Filtrar por termo de busca
      let filtered = [...allProfessionals];
      if (searchTerm) {
        filtered = filtered.filter(
          (prof) =>
            prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.services.some((service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      // Filtrar por categoria
      if (category) {
        const categoryMap: { [key: string]: string } = {
          '1': 'Box Braids',
          '2': 'Crespos',
          '3': 'Cacheados',
          '4': 'Cortes',
          '5': 'Coloração',
          '6': 'Tranças',
        };

        const categoryName = categoryMap[category.toString()];
        if (categoryName) {
          filtered = filtered.filter(
            (prof) =>
              prof.specialty.includes(categoryName) ||
              prof.services.some((service) =>
                service.name.includes(categoryName)
              )
          );
        }
      }

      // Simular delay da API
      setTimeout(() => {
        setProfessionals(filtered);
        setLoading(false);
      }, 500);
    };

    fetchProfessionals();
  }, [searchTerm, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchTerm}`);
  };

  return (
    <MainLayout
      title={
        searchTerm
          ? `Busca: ${searchTerm} | Agenda Livre`
          : `Busca | Agenda Livre`
      }
    >
      <Head>
        <title>
          {searchTerm
            ? `Busca: ${searchTerm} | Agenda Livre`
            : category
            ? `Categoria | Agenda Livre`
            : `Busca | Agenda Livre`}
        </title>
      </Head>

      <div className="sticky top-0 bg-white border-b z-10">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <button className="mr-3 p-1" onClick={() => router.back()}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-medium">
              {searchTerm
                ? `Resultados para: ${searchTerm}`
                : category
                ? `Categoria`
                : `Busca`}
            </h1>
          </div>

          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar profissionais ou serviços"
                className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : professionals.length > 0 ? (
          <ProfessionalsList professionals={professionals} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum resultado encontrado.</p>
            <p className="text-sm text-gray-500 mt-1">
              Tente buscar por outros termos ou categorias.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}