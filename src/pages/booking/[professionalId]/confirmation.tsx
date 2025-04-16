// src/pages/booking/[professionalId]/confirmation.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Check, Home } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import MainLayout from '../../../components/layout/MainLayout';

const ConfirmationPage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  const { bookingData, resetBooking } = useBooking();
  
  // Redirecionar se não houver método de pagamento selecionado
  useEffect(() => {
    if (!bookingData.paymentMethod) {
      router.replace(`/booking/${professionalId}/payment`);
    }
  }, [bookingData, professionalId, router]);
  
  // Formatar data
  const formattedDate = bookingData.selectedDate
    ? new Date(bookingData.selectedDate).toLocaleDateString('pt-BR')
    : '';
  
  return (
    <MainLayout>
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>
        
        <h2 className="text-xl font-medium mb-2">Agendamento confirmado!</h2>
        <p className="text-gray-600 mb-6">
          Seu horário foi reservado com sucesso.
        </p>
        
        <div className="bg-white p-5 rounded-xl mb-6">
          {bookingData.service && (
            <div className="text-left mb-4">
              <h3 className="font-medium">{bookingData.service.name}</h3>
              <p className="text-sm text-gray-500">
                {formattedDate} às {bookingData.selectedTime}
              </p>
            </div>
          )}
          
          {bookingData.professional && (
            <div className="flex items-center py-3 border-t">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={bookingData.professional.profileImage} 
                  alt={bookingData.professional.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">{bookingData.professional.name}</h4>
                <p className="text-xs text-gray-500">{bookingData.professional.specialty}</p>
              </div>
            </div>
          )}
          
          {bookingData.isHomeService && (
            <div className="flex items-center mt-3 bg-gray-50 p-3 rounded-lg">
              <Home size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">Serviço a domicílio</span>
              {bookingData.address && (
                <span className="text-xs text-gray-500 ml-2">{bookingData.address}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="text-left bg-blue-50 p-4 rounded-xl mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Informações importantes</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>Enviamos um email com todos os detalhes.</li>
            <li>Em caso de cancelamento, avise com no mínimo 24h de antecedência.</li>
            <li>Cancelamentos com menos de 24h estão sujeitos a cobrança de 50% do valor.</li>
          </ul>
        </div>
        
        <Link href="/" className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl inline-block"
          onClick={resetBooking}
        >
          Voltar para a página inicial
        </Link>
      </div>
    </MainLayout>
  );
};

export default ConfirmationPage;