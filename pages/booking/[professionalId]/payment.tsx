import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, AlertCircle, CreditCard } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PaymentMethod from '../../../components/booking/PaymentMethod';

export default function BookingPayment() {
  const router = useRouter();
  const { professionalId } = router.query;
  const { bookingState, setPaymentMethod, calculateTotal } = useBooking();
  
  // Estados locais para o formulário
  const [selectedPaymentMethod, setSelectedPaymentMethodLocal] = useState<'credit_card' | 'pix' | null>(
    bookingState.paymentMethod
  );
  
  // Estados para campos de cartão de crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Estado para controlar erros
  const [errors, setErrors] = useState({
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
  });
  
  // Efeito para redirecionar se os dados necessários não existirem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!bookingState.professional || !bookingState.service || !bookingState.date || 
          !bookingState.time || !bookingState.clientName || !bookingState.clientPhone || 
          !bookingState.clientEmail) {
        router.push(`/booking/${professionalId}/client`);
      }
    }
  }, [bookingState, professionalId, router]);
  
  // Métodos de pagamento disponíveis
  const paymentMethods = [
    { 
      id: 'credit_card' as const, 
      name: 'Cartão de Crédito', 
      description: 'Visa, MasterCard, Elo, Hipercard',
      icon: <CreditCard size={24} className="ml-auto text-gray-400" />
    },
    { 
      id: 'pix' as const, 
      name: 'Pix', 
      description: 'Pagamento instantâneo',
      icon: <svg className="ml-auto w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    }
  ];
  
  // Função para validar o formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      paymentMethod: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      cardName: '',
    };
    
    // Validar método de pagamento
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Selecione um método de pagamento';
      isValid = false;
    }
    
    // Validar dados do cartão se cartão de crédito for selecionado
    if (selectedPaymentMethod === 'credit_card') {
      // Validar número do cartão
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Número de cartão inválido';
        isValid = false;
      }
      
      // Validar data de expiração
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Data de validade inválida';
        isValid = false;
      }
      
      // Validar CVV
      if (!cardCVV.trim() || !/^\d{3}$/.test(cardCVV)) {
        newErrors.cardCVV = 'CVV inválido';
        isValid = false;
      }
      
      // Validar nome no cartão
      if (!cardName.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Função para formatar o número do cartão
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numbers.length && i < 16; i += 4) {
      groups.push(numbers.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };
  
  // Função para formatar a data de expiração
  const formatCardExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };
  
  // Função para prosseguir com o pagamento
  const handleConfirmPayment = () => {
    if (validateForm()) {
      // Salvar método de pagamento no contexto
      if (selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'pix') {
        setPaymentMethod(selectedPaymentMethod);
      }
      
      // Em uma implementação real, processaríamos o pagamento aqui
      // Para fins de demonstração, vamos apenas avançar para a confirmação
      router.push(`/booking/${professionalId}/confirmation`);
    }
  };
  
  // Verificação condicional para renderização
  if (!bookingState.professional || !bookingState.service || !bookingState.date || 
      !bookingState.time || !bookingState.clientName || !bookingState.clientPhone || 
      !bookingState.clientEmail) {
    return null; // O useEffect acima cuidará do redirecionamento no lado do cliente
  }
  
  // Formatar a data para exibição
  const formattedDate = bookingState.date 
    ? format(new Date(bookingState.date), "dd 'de' MMMM", { locale: ptBR }) 
    : '';
  
  return (
    <>
      <Head>
        <title>Pagamento | Agenda Livre</title>
        <meta name="description" content="Realize o pagamento para confirmar seu agendamento" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-6">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <Link href={`/booking/${professionalId}/client`} className="mr-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <ArrowLeft size={18} />
              </Link>
              <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm">
                <Image 
                  src={bookingState.professional.profileImage} 
                  alt={bookingState.professional.name} 
                  width={64} 
                  height={64}
                  className="object-cover rounded-lg" 
                />
              </div>
              <div className="ml-4 pt-2">
                <h1 className="font-medium text-lg">{bookingState.professional.name}</h1>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">{bookingState.professional.rating}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 font-medium mt-2">{bookingState.professional.specialty}</p>
          </div>
        </div>
        
        {/* Passos de agendamento */}
        <div className="px-5 mb-3 flex">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 flex items-center">
              <div 
                className={`w-2 h-2 rounded-full ${
                  i <= 5 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 5 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    i < 5 
                      ? "bg-purple-600" 
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Conteúdo da página */}
        <div className="px-5">
          <div className="flex items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Pagamento</h2>
              <div className="text-sm text-gray-500">R$ {calculateTotal().toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mb-5 bg-purple-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{bookingState.service.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {formattedDate} às {bookingState.time}
                </div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-sm text-gray-500 mb-4">MÉTODO DE PAGAMENTO</h3>
          
          {errors.paymentMethod && (
            <p className="mb-2 text-xs text-red-500">{errors.paymentMethod}</p>
          )}
          
          {paymentMethods.map(method => (
            <PaymentMethod 
              key={method.id}
              method={method}
              selected={selectedPaymentMethod === method.id}
              onSelect={(id) => setSelectedPaymentMethodLocal(id as 'credit_card' | 'pix' | null)}
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
                  className={`w-full p-3 bg-white border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19} // 16 dígitos + 3 espaços
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade
                  </label>
                  <input 
                    type="text" 
                    className={`w-full p-3 bg-white border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                    placeholder="MM/AA" 
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                    maxLength={5} // MM/YY
                  />
                  {errors.cardExpiry && <p className="mt-1 text-xs text-red-500">{errors.cardExpiry}</p>}
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input 
                    type="text" 
                    className={`w-full p-3 bg-white border ${errors.cardCVV ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                    placeholder="123" 
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                  />
                  {errors.cardCVV && <p className="mt-1 text-xs text-red-500">{errors.cardCVV}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no cartão
                </label>
                <input 
                  type="text" 
                  className={`w-full p-3 bg-white border ${errors.cardName ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                  placeholder="Como está impresso no cartão" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
              </div>
            </div>
          )}
          
          {selectedPaymentMethod === 'pix' && (
            <div className="mt-6 text-center">
              <div className="bg-white p-4 rounded-xl inline-flex mx-auto">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <path d="M10 10h10v10h-10zM30 10h10v10h-10zM50 10h10v10h-10zM70 10h10v10h-10zM20 20h10v10h-10zM40 20h10v10h-10zM60 20h10v10h-10zM80 20h10v10h-10z" fill="black" />
                  {/* Este é um QR Code simplificado para ilustração */}
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
              selectedPaymentMethod ? "bg-purple-600" : "bg-gray-300"
            }`}
            disabled={!selectedPaymentMethod}
            onClick={handleConfirmPayment}
          >
            {selectedPaymentMethod === 'credit_card' ? "Pagar agora" : "Confirmar pagamento"}
          </button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Ao confirmar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      </div>
    </>
  );
}