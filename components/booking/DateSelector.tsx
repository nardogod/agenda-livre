import React, { useState, useMemo } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DateSelector = () => {
  const { bookingState, setDate } = useBooking();
  
  // Inicialize com a data do contexto, se existir, caso contrário use a data atual
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (bookingState.date) {
      try {
        return new Date(bookingState.date);
      } catch (e) {
        return new Date();
      }
    }
    return new Date();
  });
  
  // Função para selecionar data e atualizar contexto
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDate(format(date, 'yyyy-MM-dd'));
  };
  
  // Função para gerar os próximos 14 dias
  const dates = useMemo(() => {
    const datesArray = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesArray.push(date);
    }
    
    return datesArray;
  }, []);
  
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  
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
            onClick={() => handleDateSelect(date)}
            aria-pressed={isSelected}
          >
            <span className="text-xs font-medium mb-1">{days[date.getDay()]}</span>
            <span className="text-lg font-semibold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;