// src/pages/booking/[professionalId]/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import MainLayout from '../../../components/layout/MainLayout';

// Componente para card de serviço
const ServiceCard = ({ service, onSelect }) => (
  <div className="p-3 border border-gray-200 rounded-lg flex justify-between mb-3">
    <div>
      <h3 className="font-medium">{service.name}</h3>
      <p className="text-sm text-gray-500">{service.duration} min</p>
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

const BookingPage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  const { 
    bookingData, 
    setProfessional,
    setService,
    isLoading,
    nextStep
  } = useBooking();
  
  const [services, setServices] = useState([]);
  
  // Efeito para carregar dados do profissional e serviços
  useEffect(() => {
    if (professionalId && typeof professionalId === 'string') {
      fetchProfessionalData(professionalId);
    }
  }, [professionalId]);
  
  // Função para buscar dados do profissional e serviços
  const fetchProfessionalData = (id: string) => {
    // Mock de dados para demonstração
    // Em uma implementação real, isso seria uma chamada API
    const mockProfessional = {
      id: parseInt(id),
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
        has_hair_option: true,
        hair_price_small: 60,
        hair_price_medium: 80,
        hair_price_large: 120
      },
      { 
        id: 2, 
        name: "Twist Senegalês", 
        price: 290, 
        duration: 240,
        description: "Tranças estilo twist senegalês",
        has_hair_option: true,
        hair_price_small: 70,
        hair_price_medium: 90,
        hair_price_large: 130
      },
      { 
        id: 3, 
        name: "Penteado para Festa", 
        price: 150, 
        duration: 90,
        description: "Penteados elaborados para eventos",
        has_hair_option: false
      }
    ];
    
    // Atualizar o contexto com os dados do profissional
    setProfessional(mockProfessional);
    setServices(mockServices);
  };
  
  // Função para selecionar um serviço e avançar
  const handleSelectService = (service) => {
    setService(service);
    nextStep();
    router.push(`/booking/${professionalId}/datetime`);
  };
  
  return (
    <MainLayout>
      <div className="p-4">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        ) : (
          <>
            {bookingData.professional && (
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img 
                      src={bookingData.professional.profileImage} 
                      alt={bookingData.professional.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-medium">{bookingData.professional.name}</h1>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">{bookingData.professional.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-700 font-medium mt-2">
                  {bookingData.professional.specialty}
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
    </MainLayout>
  );
};

export default BookingPage;