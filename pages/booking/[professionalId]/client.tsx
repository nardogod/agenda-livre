import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Head from 'next/head';

export default function ClientPage() {
  const router = useRouter();
  const { professionalId } = router.query;
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState({ name: 'Box Braids', price: 250 });
  const [selectedTime, setSelectedTime] = useState('14:00');
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  const handleBack = () => {
    router.back();
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: ''
    };
    
    // Validar nome
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    // Validar telefone (formato simples)
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone) && !/^\d{10,11}$/.test(phone)) {
      newErrors.phone = 'Formato inválido. Use (11) 99999-9999 ou 11999999999';
      isValid = false;
    }
    
    // Validar email
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Em uma implementação real, salvaria no contexto
      console.log("Dados do cliente:", {
        name,
        phone,
        email,
        notes
      });
      
      // Navegar para a próxima etapa
      router.push(`/booking/${professionalId}/payment`);
    }
  };
  
  // Formatar telefone enquanto o usuário digita
  const formatPhone = (value) => {
    // Remover tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Verificar se tem números suficientes
    if (numbers.length <= 2) {
      return numbers;
    }
    
    // Formatar como (11) 99999-9999
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };
  
  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Seus Dados | Agenda Livre</title>
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
            <h2 className="text-lg font-medium">Preencha seus dados</h2>
            {service && selectedTime && (
              <div className="text-sm text-gray-500">
                {service.name} - {selectedTime}
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
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
              onChange={handlePhoneChange}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
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
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
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
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl"
            >
              Ir para pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}