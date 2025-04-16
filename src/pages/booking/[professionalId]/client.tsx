// src/pages/booking/[professionalId]/client.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import ClientForm from '../../../components/booking/ClientForm';
import MainLayout from '../../../components/layout/MainLayout';

const ClientPage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  const { 
    bookingData, 
    setClientData, 
    nextStep,
    prevStep 
  } = useBooking();
  
  // Redirecionar se não houver opções adicionais configuradas
  useEffect(() => {
    if (!bookingData.service || !bookingData.selectedDate || !bookingData.selectedTime) {
      router.replace(`/booking/${professionalId}`);
    }
  }, [bookingData, professionalId, router]);
  
  const handleSubmit = (data: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
  }) => {
    setClientData(data);
    nextStep();
    router.push(`/booking/${professionalId}/payment`);
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
            <h2 className="text-lg font-medium">Preencha seus dados</h2>
            {bookingData.service && bookingData.selectedTime && (
              <div className="text-sm text-gray-500">
                {bookingData.service.name} - {bookingData.selectedTime}
              </div>
            )}
          </div>
        </div>
        
        <ClientForm 
          onSubmit={handleSubmit}
          initialData={bookingData.clientData || undefined}
        />
      </div>
    </MainLayout>
  );
};

export default ClientPage;