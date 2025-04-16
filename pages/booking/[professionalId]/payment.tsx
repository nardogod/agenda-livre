import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, CreditCard, AlertCircle } from 'lucide-react';
import Head from 'next/head';

// Componente de método de pagamento
const PaymentMethod = ({ method, selected, onSelect }) => (
  <button
    className={`w-full p-4 mb-3 rounded-xl flex items-center ${
      selected ? "bg-purple-50 border-2 border-purple-600" : "bg-white border border-gray-200"
    }`}
    onClick={() => onSelect(method.id)}
  >
    <div className={`w-5 h-5 rounded-full border ${selected ? "border-2 border-purple-600" : "border border-gray-300"} flex items-center justify-center`}>
      {selected && <div className="w-3 h-3 rounded-full bg-purple-600" />}
    </div>
    <div className="ml-3">
      <div className="font-medium">{method.name}</div>
      <div className="text-xs text-gray-500 mt-0.5">{method.description}</div>
    </div>
    {method.icon}
  </button>
);

export default function PaymentPage() {
  const router = useRouter();
  const { professionalId } = router.query;
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock de dados
  const service = { name: 'Box Braids', price: 250 };
  const selectedDate = new Date();
  const selectedTime = '14:00';
  const total = 250; // Em uma implementação real, viria do contexto
  
  const paymentMethods = [
    { 
      id: 'credit_card', 
      name: 'Cartão de Crédito', 
      description: 'Visa, MasterCard, Elo, Hipercard',
      icon: <CreditCard size={24} className="ml-auto text-gray-400" />
    },
    { 
      id: 'pix', 
      name: 'Pix', 
      description: 'Pagamento instantâneo',
      icon: <svg className="ml-auto w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    }
  ];
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSubmit = () => {
    if (selectedPaymentMethod) {
      setIsLoading(true);
      
      // Simulação de processamento de pagamento
      setTimeout(() => {
        setIsLoading(false);
        
        // Navegar para a confirmação
        router.push(`/booking/${professionalId}/confirmation`);
      }, 1500);
    }
  };
  
  // Formatar número de cartão enquanto o usuário digita
  const formatCardNumber = (value) => {
    // Remover tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Formatar como xxxx xxxx xxxx xxxx
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };
  
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  // Formatar data de validade
  const formatExpiry = (value) => {
    // Remover tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };
  
  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiry(e.target.value);
    setCardExpiry(formattedValue);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Pagamento | Agenda Livre</title>
      </Head>
      
      {/* Header simples */}
      <header className="bg-purple-600 text-white py-4 px-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Agenda Livre
          </Link>
        </div>
      </header>
      
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center mb-6">
          <button 
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
            onClick={handleBack}
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-medium">Pagamento</h2>
            <div className="text-sm text-gray-500">R$ {total.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="mb-5 bg-purple-50 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{service.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
              </div>
            </div>
            <div className="text-purple-600 font-medium">
              R$ {total.toFixed(2)}
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-sm text-gray-500 mb-4">MÉTODO DE PAGAMENTO</h3>
        
        {paymentMethods.map(method => (
          <PaymentMethod 
            key={method.id}
            method={method}
            selected={selectedPaymentMethod === method.id}
            onSelect={setSelectedPaymentMethod}
          />
        ))}
        
        {selectedPaymentMethod === 'credit_card' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do cartão
              </label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="0000 0000 0000 0000" 
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validade
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="MM/AA" 
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="123" 
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome no cartão
              </label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="Como está impresso no cartão" 
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {selectedPaymentMethod === 'pix' && (
          <div className="mt-6 text-center">
            <div className="bg-white p-4 rounded-xl inline-flex mx-auto">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <path d="M10 10h10v10h-10zM30 10h10v10h-10zM50 10h10v10h-10zM70 10h10v10h-10zM20 20h10v10h-10zM40 20h10v10h-10zM60 20h10v10h-10zM80 20h10v10h-10z" fill="black" />
                {/* QR Code simplificado para ilustração */}
              </svg>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Escaneie o QR Code acima ou copie o código PIX abaixo:
            </p>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-gray-500 truncate">00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-g7h8...</span>
              <button className="text-purple-600 text-xs font-medium">Copiar</button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Após o pagamento, seu agendamento será confirmado automaticamente.
            </p>
          </div>
        )}
        
        <div className="mt-6 px-3 py-4 bg-amber-50 rounded-xl flex">
          <AlertCircle size={20} className="text-amber-600 mr-3 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            A confirmação da reserva depende da aprovação do pagamento. Você receberá um email com todos os detalhes do seu agendamento.
          </p>
        </div>
        
        <button 
          className={`w-full py-3 text-white font-medium rounded-xl mt-6 ${
            selectedPaymentMethod && !isLoading ? "bg-purple-600" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!selectedPaymentMethod || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 
            "Processando..." : 
            selectedPaymentMethod === 'credit_card' ? 
              "Pagar agora" : 
              "Confirmar pagamento"
          }
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Ao confirmar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
    </div>
  );
}