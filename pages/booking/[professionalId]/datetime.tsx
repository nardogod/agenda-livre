import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Clock } from 'lucide-react';
import Head from 'next/head';

// Componente de seleção de data
const DateSelector = ({ selectedDate, onSelectDate }) => {
  const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const today = new Date();
  const dates = [];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return (
    <div className="flex overflow-x-auto py-3">
      {dates.map((date, idx) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        return (
          <button
            key={idx}
            className={`flex flex-col items-center justify-center mr-4 w-12 h-16 rounded-xl ${
              isSelected ? "bg-purple-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => onSelectDate(date)}
          >
            <span className="text-xs font-medium mb-1">{days[date.getDay()]}</span>
            <span className="text-lg font-semibold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

// Componente de horário
const TimeSlot = ({ time, selected, onSelect }) => (
  <button
    className={`px-5 py-2.5 rounded-xl text-sm mr-2 mb-2 ${
      selected 
        ? "bg-purple-600 text-white" 
        : "bg-white border border-gray-200 text-gray-700 hover:border-purple-300"
    }`}
    onClick={onSelect}
  >
    {time}
  </button>
);

export default function DateTimePage() {
  const router = useRouter();
  const { professionalId } = router.query;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  
  // Mock de dados do serviço (em uma implementação real, viria do Context)
  useEffect(() => {
    // Simulando serviço selecionado anteriormente
    setService({
      id: 1,
      name: "Box Braids",
      price: 250,
      duration: 180
    });
  }, []);
  
  // Carregar horários disponíveis quando a data mudar
  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate]);
  
  const loadAvailableTimes = (date) => {
    setLoading(true);
    
    // Simulação de chamada API para obter horários disponíveis
    setTimeout(() => {
      // Dados mockados para demonstração
      const mockTimes = ["09:00", "11:30", "14:00", "16:30"];
      setAvailableTimes(mockTimes);
      setSelectedTime(null);
      setLoading(false);
    }, 500);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const handleContinue = () => {
    if (selectedTime) {
      // Em uma implementação real, salvaria no contexto
      console.log("Data e hora selecionadas:", {
        date: selectedDate,
        time: selectedTime
      });
      
      // Navegar para a próxima etapa
      router.push(`/booking/${professionalId}/options`);
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Selecionar Data e Hora | Agenda Livre</title>
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
        <div className="flex items-center mb-6">
          <button 
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
            onClick={handleBack}
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-medium">Escolha data e horário</h2>
            {service && (
              <div className="text-sm text-gray-500">{service.name}</div>
            )}
          </div>
        </div>
        
        {service && (
          <div className="bg-white px-4 py-3 rounded-xl mb-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{service.duration} min</div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {service.price.toFixed(2)}
              </div>
            </div>
          </div>
        )}
        
        <h3 className="text-sm font-medium text-gray-700 mb-2">Selecione uma data</h3>
        <DateSelector 
          selectedDate={selectedDate} 
          onSelectDate={handleDateSelect} 
        />
        
        <h3 className="text-sm font-medium text-gray-700 mt-6 mb-2">Horários disponíveis</h3>
        
        {loading ? (
          <div className="animate-pulse flex flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 h-10 w-20 rounded-xl mr-2 mb-2"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap">
            {availableTimes.map((time) => (
              <TimeSlot 
                key={time} 
                time={time} 
                selected={time === selectedTime}
                onSelect={() => handleTimeSelect(time)}
              />
            ))}
            
            {availableTimes.length === 0 && (
              <p className="text-sm text-gray-500 py-2">
                Nenhum horário disponível para esta data. Por favor, selecione outra data.
              </p>
            )}
          </div>
        )}
        
        <button 
          className={`w-full py-3 rounded-xl text-white font-medium mt-8 ${
            selectedTime 
              ? "bg-purple-600" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!selectedTime}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}