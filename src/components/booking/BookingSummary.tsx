// src/components/booking/BookingSummary.tsx
import React from 'react';
import { useBooking } from '../../contexts/BookingContext';

interface BookingSummaryProps {
  showTotal?: boolean;
  className?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ showTotal = true, className = '' }) => {
  const { bookingData, calculateTotal } = useBooking();
  
  // Preços de referência para mostrar na interface
  const hairPrices = {
    small: 60,
    medium: 80,
    large: 120
  };
  
  const homeServiceFee = 50;
  
  if (!bookingData.service) {
    return null;
  }
  
  return (
    <div className={`bg-purple-50 p-4 rounded-xl ${className}`}>
      <h3 className="font-medium mb-3">Resumo do pedido</h3>
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{bookingData.service.name}</span>
          <span>R$ {bookingData.service.price.toFixed(2)}</span>
        </div>
        
        {bookingData.isHomeService && (
          <div className="flex justify-between">
            <span className="text-gray-600">Taxa de deslocamento</span>
            <span>R$ {homeServiceFee.toFixed(2)}</span>
          </div>
        )}
        
        {!bookingData.useOwnHair && bookingData.hairLength && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              Cabelo ({bookingData.hairLength === 'small' ? 'Curto' : bookingData.hairLength === 'medium' ? 'Médio' : 'Longo'})
            </span>
            <span>R$ {hairPrices[bookingData.hairLength].toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {showTotal && (
        <div className="border-t pt-3 flex justify-between font-medium">
          <span>Total</span>
          <span>R$ {calculateTotal().toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;