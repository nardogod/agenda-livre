import React from 'react';

type DateSelectorProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  availableDates?: Date[];
  numberOfDays?: number;
  className?: string;
};

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
  availableDates,
  numberOfDays = 14,
  className = '',
}) => {
  // Dias da semana em português (abreviado)
  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  
  // Gerar array de datas a partir de hoje
  const generateDates = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < numberOfDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  // Verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    if (!availableDates) return true;
    
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };
  
  // Verificar se uma data está selecionada
  const isDateSelected = (date: Date) => {
    return selectedDate.toDateString() === date.toDateString();
  };

  return (
    <div className={`flex overflow-x-auto py-3 ${className}`}>
      {dates.map((date, idx) => {
        const isSelected = isDateSelected(date);
        const isAvailable = isDateAvailable(date);
        
        return (
          <button
            key={idx}
            className={`
              flex flex-col items-center justify-center mr-4 
              min-w-12 w-12 h-16 rounded-xl flex-shrink-0
              ${isSelected 
                ? 'bg-primary text-white' 
                : isAvailable 
                  ? 'bg-white text-black-text hover:bg-gray-light' 
                  : 'bg-gray-light text-gray-text-light cursor-not-allowed opacity-60'
              }
            `}
            onClick={() => isAvailable && onSelectDate(date)}
            disabled={!isAvailable}
            type="button"
          >
            <span className="text-xs font-medium mb-1">{weekDays[date.getDay()]}</span>
            <span className="text-lg font-semibold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;