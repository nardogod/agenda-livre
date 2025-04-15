// src/components/schedule/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';

// Tipos
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduleBlock {
  id: string;
  date: string;
  reason: string;
  startTime: string;
  endTime: string;
}

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  onAddTimeSlot?: (date: Date) => void;
  onAddBlock?: (date: Date) => void;
  availableTimeSlots?: TimeSlot[];
  scheduleBlocks?: ScheduleBlock[];
  selectedDate: Date;
  isEditable?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  onAddTimeSlot,
  onAddBlock,
  availableTimeSlots = [],
  scheduleBlocks = [],
  selectedDate,
  isEditable = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([]);

  // Generate calendar days for the current month
  useEffect(() => {
    const days = generateCalendarDays(currentMonth);
    setCalendarDays(days);
  }, [currentMonth]);

  // Generate an array of dates for the calendar
  const generateCalendarDays = (date: Date): Array<Date | null> => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total number of days in the month
    const daysInMonth = lastDay.getDate();
    
    // Array to hold all calendar cells
    const days: Array<Date | null> = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add a cell for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Go to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format date as YYYY-MM-DD for comparison
  const formatDateForComparison = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has any available time slots
  const hasAvailableTimeSlots = (date: Date): boolean => {
    const formattedDate = formatDateForComparison(date);
    // In a real app, this would check against the API response
    return availableTimeSlots.some(slot => 
      slot.isAvailable && slot.id.startsWith(formattedDate)
    );
  };

  // Check if a date has any schedule blocks
  const hasScheduleBlocks = (date: Date): boolean => {
    const formattedDate = formatDateForComparison(date);
    return scheduleBlocks.some(block => 
      block.date === formattedDate
    );
  };

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if a date is selected
  const isSelectedDate = (date: Date): boolean => {
    return formatDateForComparison(date) === formatDateForComparison(selectedDate);
  };

  // Format month name
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Days of the week headers
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium capitalize">
          {formatMonth(currentMonth)}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const isAvailable = hasAvailableTimeSlots(day);
          const hasBlocks = hasScheduleBlocks(day);
          const isDisabled = isPastDate(day);
          const isSelected = isSelectedDate(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onDateSelect(day)}
              disabled={isDisabled}
              className={`relative h-10 flex items-center justify-center rounded-lg text-sm transition-colors
                ${isDisabled 
                  ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                  : isSelected
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-purple-50 text-gray-700 '
                }
              `}
            >
              {day.getDate()}
              
              {/* Indicators for availability or blocks */}
              <div className="absolute -bottom-1 left-0 right-0 flex justify-center space-x-1">
                {isAvailable && !isDisabled && (
                  <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-green-400'}`}></div>
                )}
                {hasBlocks && !isDisabled && (
                  <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-red-400'}`}></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons for Selected Date */}
      {isEditable && (
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => onAddTimeSlot && onAddTimeSlot(selectedDate)}
            className="flex-1 flex items-center justify-center py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium"
          >
            <Clock size={16} className="mr-2" />
            Adicionar Horário
          </button>
          <button
            onClick={() => onAddBlock && onAddBlock(selectedDate)}
            className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
          >
            <Plus size={16} className="mr-2" />
            Bloquear Horário
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;