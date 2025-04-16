import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Clock, Star } from 'lucide-react';
import Head from 'next/head';

// Componente para card de serviço
const ServiceCard = ({ service, onSelect }) => (
  <div className="p-4 border border-gray-200 rounded-lg flex justify-between mb-3 hover:border-purple-300 cursor-pointer">
    <div>
      <h3 className="font-medium">{service.name}</h3>
      <div className="flex items-center mt-1 text-gray-500 text-xs">
        <Clock size={12} className="mr-1" />
        <span>{service.duration} min</span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">R$ {service.price.toFixed(2)}</p>
      <button 
        onClick={() => onSelect(service)} 
        className="text-xs text-purple-600"
      >
        Selecionar
      </button>
    </div>
  </div>
);

// Dados mockados para demonstração
const mockProfessional = {
  id: 1,
  name: "Ana Oliveira",
  specialty: "Especialista em Tranças e Penteados",
  profileImage: "/api/placeholder/300/300",
  rating: 4.8
};

const mockServices = [
  { 
    id: 1, 
    name: "Box Braids", 
    price: 250, 
    duration: 180,
    description: "Tranças box braids em diversos tamanhos",
  },
  { 
    id: 2, 
    name: "Twist Senegalês", 
    price: 290, 
    duration: 240,
    description: "Tranças estilo twist senegalês",
  },
  { 
    id: 3, 
    name: "Penteado para Festa", 
    price: 150, 
    duration: 90,
    description: "Penteados elaborados para eventos",
  }
];

export default function BookingPage() {
  const router = useRouter();
  const { professionalId } = router.query;
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simular carregamento de dados
  useEffect(() => {
    if (professionalId) {
      // Em uma implementação real, faria uma chamada API aqui
      setTimeout(() => {
        setProfessional(mockProfessional);
        setServices(mockServices);
        setLoading(false);
      }, 500);
    }
  }, [professionalId]);
  
  // Função para selecionar um serviço e avançar
  const handleSelectService = (service) => {
    // Em uma implementação real, salvaria no contexto ou state manager
    console.log("Serviço selecionado:", service);
    
    // Navegar para a próxima etapa
    router.push(`/booking/${professionalId}/datetime`);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Agendar Serviço | Agenda Livre</title>
      </Head>
      
      {/* Header simples */}
      <header className="bg-purple-600 text-white py-4 px-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Agenda Livre
          </Link>
        </div>
      </header>
      
      <div className="p-4 max-w-lg mx-auto">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        ) : (
          <>
            {professional && (
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img 
                      src={professional.profileImage} 
                      alt={professional.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-medium">{professional.name}</h1>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">{professional.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-700 font-medium mt-2">
                  {professional.specialty}
                </p>
              </div>
            )}
            
            <h2 className="text-lg font-medium mb-4">Selecione um serviço</h2>
            
            <div className="space-y-2">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  onSelect={handleSelectService}
                />
              ))}
            </div>
            
            <Link href="/" className="text-purple-600 font-medium inline-block mt-6">
              ← Voltar para a página inicial
            </Link>
          </>
        )}
      </div>
    </div>
  );
}