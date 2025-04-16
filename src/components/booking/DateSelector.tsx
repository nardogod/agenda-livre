// src/components/booking/DateSelector.tsx
import React from 'react';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  onSelectDate, 
  daysToShow = 14 
}) => {
  const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const today = new Date();
  const dates = [];
  
  for (let i = 0; i < daysToShow; i++) {
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
            aria-label={`Selecionar data ${date.toLocaleDateString()}`}
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