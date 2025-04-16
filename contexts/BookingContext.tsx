// contexts/BookingContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Tipos básicos para o contexto
interface BookingData {
  professionalId: string | null;
  serviceName: string | null;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBooking: (data: Partial<BookingData>) => void;
}

// Criar o contexto
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    professionalId: null,
    serviceName: null,
  });

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook para usar o contexto
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking deve ser usado dentro de um BookingProvider');
  }
  return context;
};

export default BookingContext;