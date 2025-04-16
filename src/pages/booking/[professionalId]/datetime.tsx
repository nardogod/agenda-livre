// src/pages/booking/[professionalId]/datetime.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import DateSelector from '../../../components/booking/DateSelector';
import TimeSlot from '../../../components/booking/TimeSlot';
import MainLayout from '../../../components/layout/MainLayout';

const DateTimePage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  const { 
    bookingData, 
    setDateTime, 
    nextStep,
    prevStep 
  } = useBooking();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Redirecionar se não houver serviço selecionado
  useEffect(() => {
    if (!bookingData.service) {
      router.replace(`/booking/${professionalId}`);
    }
  }, [bookingData.service, professionalId, router]);
  
  // Carregar horários disponíveis quando a data mudar
  useEffect(() => {
    if (bookingData.service) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate, bookingData.service]);
  
  const loadAvailableTimes = (date: Date) => {
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
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleContinue = () => {
    if (selectedTime) {
      setDateTime(selectedDate, selectedTime);
      nextStep();
      router.push(`/booking/${professionalId}/options`);
    }
  };
  
  const handleBack = () => {
    prevStep();
    router.back();
  };
  
  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button 
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
            onClick={handleBack}
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-medium">Escolha data e horário</h2>
            {bookingData.service && (
              <div className="text-sm text-gray-500">{bookingData.service.name}</div>
            )}
          </div>
        </div>
        
        {bookingData.service && (
          <div className="bg-white px-4 py-3 rounded-xl mb-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{bookingData.service.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{bookingData.service.duration} min</div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {bookingData.service.price.toFixed(2)}
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
    </MainLayout>
  );
};

export default DateTimePage;