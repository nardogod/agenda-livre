import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Check, Home } from 'lucide-react';
import Head from 'next/head';

export default function ConfirmationPage() {
  const router = useRouter();
  
  // Mock de dados para a confirmação
  // Em uma implementação real, esses dados viriam do contexto
  const service = { name: 'Box Braids', price: 250 };
  const selectedDate = new Date();
  const selectedTime = '14:00';
  const professional = {
    name: "Ana Oliveira",
    specialty: "Especialista em Tranças e Penteados",
    profileImage: "/api/placeholder/300/300"
  };
  const isHomeService = false;
  const address = '';
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Agendamento Confirmado | Agenda Livre</title>
      </Head>
      
      {/* Header simples */}
      <header className="bg-purple-600 text-white py-4 px-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Agenda Livre
          </Link>
        </div>
      </header>
      
      <div className="text-center py-8 px-4 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>
        
        <h2 className="text-xl font-medium mb-2">Agendamento confirmado!</h2>
        <p className="text-gray-600 mb-6">
          Seu horário foi reservado com sucesso.
        </p>
        
        <div className="bg-white p-5 rounded-xl mb-6 text-left">
          <div className="mb-4">
            <h3 className="font-medium">{service.name}</h3>
            <p className="text-sm text-gray-500">
              {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
            </p>
          </div>
          
          <div className="flex items-center py-3 border-t">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={professional.profileImage} 
                alt={professional.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <h4 className="font-medium">{professional.name}</h4>
              <p className="text-xs text-gray-500">{professional.specialty}</p>
            </div>
          </div>
          
          {isHomeService && (
            <div className="flex items-center mt-3 bg-gray-50 p-3 rounded-lg">
              <Home size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">Serviço a domicílio</span>
              {address && (
                <span className="text-xs text-gray-500 ml-2">{address}</span>
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
        
        <Link 
          href="/" 
          className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl inline-block"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}