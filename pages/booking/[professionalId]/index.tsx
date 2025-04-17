import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Star } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';

// Componente para o card de serviço
const ServiceCard = ({ service, onSelect }: { service: Service; onSelect: (service: Service) => void }) => (
  <button 
    className="w-full bg-white p-4 rounded-xl mb-3 text-left hover:shadow-sm transition-all flex justify-between items-center"
    onClick={() => onSelect(service)}
  >
    <div>
      <h3 className="font-medium text-base">{service.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{service.description}</p>
      <div className="flex items-center mt-1 text-gray-500 text-xs">
        <Clock size={12} className="mr-1" />
        <span>{service.duration} min</span>
      </div>
    </div>
    <div className="text-right">
      <div className="font-medium">R$ {service.price.toFixed(2)}</div>
      <div className="text-xs text-purple-600 mt-1">Selecionar</div>
    </div>
  </button>
);

// Interface para o tipo de serviço
interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
}

// Interface para o tipo de profissional
interface Professional {
  id: number;
  name: string;
  specialty: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  location: {
    district: string;
    zone: string;
  };
  offersHomeService: boolean;
  services: Service[];
  homeServiceFee: number;
  hairPrices: {
    small: number;
    medium: number;
    large: number;
  };
}

// Dados mockados do profissional (em uma implementação real, isso viria da API)
const getMockedProfessional = (id: string | number): Professional => ({
  id: Number(id),
  name: "Ana Oliveira",
  specialty: "Especialista em Tranças e Penteados",
  profileImage: "https://placehold.co/300x300", // Corrigido: usar um placeholder externo
  rating: 4.8,
  reviewCount: 124,
  location: {
    district: "Pinheiros",
    zone: "Zona Oeste"
  },
  offersHomeService: true,
  services: [
    { id: 1, name: "Box Braids", price: 250, duration: 180, description: "Tranças finas a médias, estilo box braids tradicionais." },
    { id: 2, name: "Twist Senegalês", price: 290, duration: 240, description: "Twists estilo senegalês com acabamento profissional." },
    { id: 3, name: "Penteado para Festa", price: 150, duration: 90, description: "Penteados elegantes para ocasiões especiais." },
    { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60, description: "Retoque e manutenção de tranças existentes." }
  ],
  homeServiceFee: 50,
  hairPrices: {
    small: 60,
    medium: 80,
    large: 120
  }
});

export default function BookingServiceSelection() {
  const router = useRouter();
  const { professionalId } = router.query;
  const { bookingState, setProfessional, setService } = useBooking();
  const [professional, setProfessionalData] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Efeito para carregar os dados do profissional
  useEffect(() => {
    if (professionalId && !professional) {
      // Só carrega os dados se ainda não tivermos um profissional
      try {
        // Em uma implementação real, isso seria uma chamada API
        const id = Array.isArray(professionalId) ? professionalId[0] : professionalId;
        const professionalData = getMockedProfessional(id);
        setProfessionalData(professionalData);
        
        // Verificar se já existe um profissional no contexto
        if (!bookingState.professional || bookingState.professional.id !== Number(id)) {
          setProfessional(professionalData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do profissional:", error);
        setLoading(false);
      }
    }
  }, [professionalId, professional, setProfessional, bookingState.professional]);
  
  // Função para selecionar um serviço
  const handleServiceSelect = (service: Service) => {
    setService(service);
    router.push(`/booking/${professionalId}/datetime`);
  };
  
  if (loading || !professional) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Agendar com {professional.name} | Agenda Livre</title>
        <meta name="description" content={`Agende serviços com ${professional.name}, ${professional.specialty}`} />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-6">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <Link href={`/professionals/${professional.id}`} className="mr-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <ArrowLeft size={18} />
              </Link>
              <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm">
                <Image 
                  src={professional.profileImage} 
                  alt={professional.name} 
                  width={64} 
                  height={64} 
                  className="object-cover rounded-lg" 
                />
              </div>
              <div className="ml-4 pt-2">
                <h1 className="font-medium text-lg">{professional.name}</h1>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">{professional.rating}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 font-medium mt-2">{professional.specialty}</p>
          </div>
        </div>
        
        {/* Passos de agendamento */}
        <div className="px-5 mb-3 flex">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 flex items-center">
              <div 
                className={`w-2 h-2 rounded-full ${
                  i === 1 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 5 && (
                <div className="flex-1 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
        
        {/* Conteúdo da página */}
        <div className="px-5">
          <h2 className="text-lg font-medium mb-4">Selecione um serviço</h2>
          
          {professional.services.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onSelect={handleServiceSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
}