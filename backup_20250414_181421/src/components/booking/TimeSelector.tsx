import React from 'react';

type TimeSelectorProps = {
  availableTimes: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  className?: string;
};

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  availableTimes,
  selectedTime,
  onSelectTime,
  className = '',
}) => {
  if (availableTimes.length === 0) {
    return (
      <div className="text-center py-6 text-gray-text">
        Não há horários disponíveis para esta data.
      </div>
    );
  }

  return (
    <div className={`mt-5 flex flex-wrap ${className}`}>
      {availableTimes.map((time, idx) => {
        const isSelected = time === selectedTime;
        
        return (
          <button
            key={idx}
            className={`
              px-5 py-2.5 rounded-xl text-sm mr-2 mb-2
              ${isSelected 
                ? "bg-primary text-white" 
                : "bg-white border border-gray-medium text-gray-700 hover:border-primary"
              }
            `}
            onClick={() => onSelectTime(time)}
            type="button"
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSelector;