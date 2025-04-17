import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BookingClientInfo() {
  const router = useRouter();
  const { professionalId } = router.query;
  const { bookingState, setClientInfo, setNotes } = useBooking();
  
  // Estados locais para o formulário
  const [name, setName] = useState(bookingState.clientName || '');
  const [phone, setPhone] = useState(bookingState.clientPhone || '');
  const [email, setEmail] = useState(bookingState.clientEmail || '');
  const [notes, setNotesState] = useState(bookingState.notes || '');
  
  // Estados para validação
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
  });
  
  // Efeito para redirecionar se os dados necessários não existirem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!bookingState.professional || !bookingState.service || !bookingState.date || !bookingState.time) {
        router.push(`/booking/${professionalId}`);
      }
    }
  }, [bookingState.professional, bookingState.service, bookingState.date, bookingState.time, professionalId, router]);
  
  // Função para validar o formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
    };
    
    // Validar nome
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    // Validar telefone
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone)) {
      newErrors.phone = 'Formato de telefone inválido. Use (99) 99999-9999';
      isValid = false;
    }
    
    // Validar email
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Função para formatar o telefone enquanto o usuário digita
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Formata o número conforme a máscara (99) 99999-9999
    if (numbers.length <= 2) {
      return numbers.length ? `(${numbers}` : '';
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };
  
  // Função para prosseguir para o pagamento
  const handleContinue = () => {
    if (validateForm()) {
      // Salvar dados no contexto
      setClientInfo(name, phone, email);
      setNotes(notes);
      
      // Navegar para a página de pagamento
      router.push(`/booking/${professionalId}/payment`);
    }
  };
  
  // Verificação condicional para renderização
  if (!bookingState.professional || !bookingState.service || !bookingState.date || !bookingState.time) {
    return null; // O useEffect acima cuidará do redirecionamento no lado do cliente
  }
  
  // Formatar a data para exibição
  const formattedDate = bookingState.date 
    ? format(new Date(bookingState.date), "dd 'de' MMMM", { locale: ptBR }) 
    : '';
  
  return (
    <>
      <Head>
        <title>Seus dados | Agenda Livre</title>
        <meta name="description" content="Preencha seus dados para finalizar o agendamento" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-6">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <Link href={`/booking/${professionalId}/options`} className="mr-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
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
                  i <= 4 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 5 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    i < 4 
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
              <h2 className="text-lg font-medium">Preencha seus dados</h2>
              <div className="text-sm text-gray-500">
                {bookingState.service.name} - {formattedDate} às {bookingState.time}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input 
                type="text" 
                className={`w-full p-3 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                placeholder="Digite seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input 
                type="tel" 
                className={`w-full p-3 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                placeholder="(11) 99999-9999" 
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input 
                type="email" 
                className={`w-full p-3 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl`}
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                rows={2}
                placeholder="Alguma observação para a profissional?" 
                value={notes}
                onChange={(e) => setNotesState(e.target.value)}
              />
            </div>
            
            <div className="pt-4">
              <button 
                className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl"
                onClick={handleContinue}
              >
                Ir para pagamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}