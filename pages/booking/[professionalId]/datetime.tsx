import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import DateSelector from '../../../components/booking/DateSelector';

// Componente para slot de horário
interface TimeSlotProps {
  time: string;
  selected: boolean;
  onSelect: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, selected, onSelect }) => (
  <button
    className={`px-5 py-2.5 rounded-xl text-sm mr-2 mb-2 ${
      selected 
        ? "bg-purple-600 text-white" 
        : "bg-white border border-gray-200 text-gray-700 hover:border-purple-300"
    }`}
    onClick={onSelect}
    aria-pressed={selected}
  >
    {time}
  </button>
);

// Dados mockados do profissional
const getMockedProfessional = (id: string | number) => ({
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

export default function BookingDateTimeSelection() {
  const router = useRouter();
  const { professionalId } = router.query;
  const { bookingState, setProfessional, setService, setTime } = useBooking();
  
  // Use o valor do contexto como estado inicial, se existir
  const [selectedTime, setSelectedTime] = useState<string | null>(
    bookingState.time || null
  );
  
  const [loading, setLoading] = useState(true);
  
  // Horários disponíveis (em uma implementação real, isso viria da API)
  const availableTimes = useMemo(() => ['09:00', '11:30', '14:00', '16:30'], []);
  
  // Efeito para configurar dados iniciais - corrigido para evitar loops infinitos
  useEffect(() => {
    // Verificar se temos professionalId e se estamos no cliente
    if (!professionalId || typeof window === 'undefined') return;
    
    // Usamos uma flag para controlar se já carregamos os dados iniciais
    const hasLoadedInitialData = sessionStorage.getItem(`loaded-${professionalId}`);
    
    // Se ainda não carregamos e não temos os dados necessários
    if (!hasLoadedInitialData && (!bookingState.professional || !bookingState.service)) {
      try {
        // Converte ID para número
        const id = Array.isArray(professionalId) ? professionalId[0] : professionalId;
        const numericId = Number(id);
        
        // Dados mockados do profissional
        const professionalData = getMockedProfessional(numericId);
        
        // Define profissional no contexto apenas se necessário
        if (!bookingState.professional || bookingState.professional.id !== numericId) {
          setProfessional(professionalData);
        }
        
        // Define primeiro serviço como padrão se não houver um selecionado
        if (!bookingState.service && professionalData.services.length > 0) {
          setService(professionalData.services[0]);
        }
        
        // Marcamos que já carregamos os dados iniciais
        sessionStorage.setItem(`loaded-${professionalId}`, 'true');
      } catch (error) {
        console.error("Erro ao configurar dados iniciais:", error);
      }
    }
    
    // Desativa o loading independentemente do resultado
    setLoading(false);
    
  }, [professionalId, bookingState.professional, bookingState.service, setProfessional, setService]);
  
  // Função para selecionar um horário - CORRIGIDA
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Atualizamos o contexto apenas quando o usuário seleciona explicitamente um horário
    // Isso evita o loop de renderização
    setTime(time);
  };
  
  // Função para continuar para a próxima etapa
  const handleContinue = () => {
    if (selectedTime) {
      router.push(`/booking/${professionalId}/options`);
    }
  };
  
  // Renderização se estiver carregando
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Renderização se não tiver dados
  if (!bookingState.professional || !bookingState.service) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 flex-col">
        <div className="text-red-600 mb-4">Erro ao carregar dados</div>
        <Link href={`/booking/${professionalId}`} className="text-purple-600 underline">
          Voltar para seleção de serviço
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Escolha data e horário | Agenda Livre</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-6">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <Link href={`/booking/${professionalId}`} className="mr-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <ArrowLeft size={18} />
              </Link>
              <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm">
                <Image 
                  src={bookingState.professional.profileImage}
                  alt={bookingState.professional.name}
                  width={64}
                  height={64}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="ml-4 pt-2">
                <h1 className="font-medium text-lg">
                  {bookingState.professional.name}
                </h1>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">
                    {bookingState.professional.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 font-medium mt-2">
              {bookingState.professional.specialty}
            </p>
          </div>
        </div>
        
        {/* Passos de agendamento */}
        <div className="px-5 mb-3 flex">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 flex items-center">
              <div 
                className={`w-2 h-2 rounded-full ${
                  i <= 2 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 5 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    i < 2 
                      ? "bg-purple-600" 
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Conteúdo da página */}
        <div className="px-5">
          <div className="flex items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Escolha data e horário</h2>
              <div className="text-sm text-gray-500">
                {bookingState.service.name}
              </div>
            </div>
          </div>
          
          <div className="bg-white px-4 py-3 rounded-xl mb-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">
                  {bookingState.service.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {bookingState.service.duration} min
                </div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {bookingState.service.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          <DateSelector />
          
          <h3 className="text-sm font-medium text-gray-600 mt-6 mb-2">Horários disponíveis</h3>
          <div className="flex flex-wrap">
            {availableTimes.map((time, idx) => (
              <TimeSlot 
                key={idx} 
                time={time} 
                selected={time === selectedTime}
                onSelect={() => handleTimeSelect(time)}
              />
            ))}
          </div>
          
          <button 
            className={`w-full py-3 rounded-xl text-white font-medium mt-8 ${
              selectedTime 
                ? "bg-purple-600" 
                : "bg-gray-300"
            }`}
            disabled={!selectedTime}
            onClick={handleContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </>
  );
}