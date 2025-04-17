import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Home } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BookingConfirmation() {
  const router = useRouter();
  const { bookingState, resetBooking } = useBooking();
  
  // Efeito para redirecionar se os dados necessários não existirem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!bookingState.professional || !bookingState.service || !bookingState.date || 
          !bookingState.time || !bookingState.clientName || !bookingState.clientPhone || 
          !bookingState.clientEmail || !bookingState.paymentMethod) {
        router.push('/');
      }
    }
  }, [bookingState, router]);
  
  // Verificação condicional para renderização
  if (!bookingState.professional || !bookingState.service || !bookingState.date || 
      !bookingState.time || !bookingState.clientName || !bookingState.clientPhone || 
      !bookingState.clientEmail || !bookingState.paymentMethod) {
    return null; // O useEffect acima cuidará do redirecionamento no lado do cliente
  }
  
  // Formatar a data para exibição
  const formattedDate = bookingState.date 
    ? format(new Date(bookingState.date), "dd 'de' MMMM", { locale: ptBR }) 
    : '';
  
  // Função para voltar à página inicial e resetar o estado do agendamento
  const handleBackToHome = () => {
    resetBooking();
    router.push('/');
  };
  
  return (
    <>
      <Head>
        <title>Agendamento confirmado! | Agenda Livre</title>
        <meta name="description" content="Seu agendamento foi confirmado com sucesso" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen py-8 px-5">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          
          <h2 className="text-xl font-medium mb-2">Agendamento confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Seu horário foi reservado com sucesso.
          </p>
          
          <div className="bg-white p-5 rounded-xl mb-6">
            <div className="text-left mb-4">
              <h3 className="font-medium">{bookingState.service.name}</h3>
              <p className="text-sm text-gray-500">
                {formattedDate} às {bookingState.time}
              </p>
            </div>
            
            <div className="flex items-center py-3 border-t">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <Image 
                  src={bookingState.professional.profileImage} 
                  alt={bookingState.professional.name} 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">{bookingState.professional.name}</h4>
                <p className="text-xs text-gray-500">{bookingState.professional.specialty}</p>
              </div>
            </div>
            
            {bookingState.isHomeService && (
              <div className="flex items-center mt-3 bg-gray-50 p-3 rounded-lg">
                <Home size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">Serviço a domicílio</span>
              </div>
            )}
          </div>
          
          <div className="text-left bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Informações importantes</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>Enviamos um email com todos os detalhes para {bookingState.clientEmail}.</li>
              <li>Em caso de cancelamento, avise com no mínimo 24h de antecedência.</li>
              <li>Cancelamentos com menos de 24h estão sujeitos a cobrança de 50% do valor.</li>
            </ul>
          </div>
          
          <button 
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl"
            onClick={handleBackToHome}
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </>
  );
}