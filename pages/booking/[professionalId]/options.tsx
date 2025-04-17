import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ToggleOption from '../../../components/booking/ToggleOption';
import RadioOption from '../../../components/booking/RadioOption';

export default function BookingOptionsSelection() {
  const router = useRouter();
  const { professionalId } = router.query;
  const { 
    bookingState, 
    setUseOwnHair, 
    setHairLength, 
    setHomeService, 
    setAddress, 
    setHasAllergies, 
    setAllergiesDescription, 
    calculateTotal 
  } = useBooking();
  
  // Inicializar estados com os valores do contexto
  const [useOwnHair, setUseOwnHairState] = useState(bookingState.useOwnHair);
  const [hairLength, setHairLengthState] = useState<'small' | 'medium' | 'large'>(
    bookingState.hairLength || 'medium'
  );
  const [homeService, setHomeServiceState] = useState(bookingState.isHomeService);
  const [address, setAddressState] = useState(bookingState.address || '');
  const [hasAllergies, setHasAllergiesState] = useState(bookingState.hasAllergies);
  const [allergiesDescription, setAllergiesDescriptionState] = useState(
    bookingState.allergiesDescription || ''
  );

  // Efeito para redirecionar se os dados necessários não existirem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!bookingState.professional || !bookingState.service || !bookingState.date || !bookingState.time) {
        router.push(`/booking/${professionalId}`);
      }
    }
  }, [bookingState.professional, bookingState.service, bookingState.date, bookingState.time, professionalId, router]);
  
  // Os useEffects para atualizar o contexto devem ser executados apenas uma vez
  // quando os valores do estado LOCAL mudam, e não a cada renderização
  
  // Atualizar o contexto quando o toggleOwnHair mudar
  const handleToggleOwnHair = (value: boolean) => {
    setUseOwnHairState(value);
    setUseOwnHair(value);
  };
  
  // Atualizar o contexto quando o hairLength mudar
  const handleHairLengthChange = (value: string) => {
    const typedValue = value as 'small' | 'medium' | 'large';
    setHairLengthState(typedValue);
    setHairLength(useOwnHair ? null : typedValue);
  };
  
  // Atualizar o contexto quando o homeService mudar
  const handleHomeServiceToggle = (value: boolean) => {
    setHomeServiceState(value);
    setHomeService(value);
  };
  
  // Atualizar o contexto quando o address mudar
  const handleAddressChange = (value: string) => {
    setAddressState(value);
    setAddress(value);
  };
  
  // Atualizar o contexto quando o hasAllergies mudar
  const handleAllergiesToggle = (value: boolean) => {
    setHasAllergiesState(value);
    setHasAllergies(value);
  };
  
  // Atualizar o contexto quando o allergiesDescription mudar
  const handleAllergiesDescriptionChange = (value: string) => {
    setAllergiesDescriptionState(value);
    setAllergiesDescription(value);
  };
  
  // Função para continuar para a próxima etapa
  const handleContinue = () => {
    // Validar o endereço se serviço a domicílio estiver selecionado
    if (homeService && !address.trim()) {
      alert('Por favor, informe o endereço para serviço a domicílio.');
      return;
    }
    
    // Validar a descrição de alergias se tiver alergias
    if (hasAllergies && !allergiesDescription.trim()) {
      alert('Por favor, descreva suas alergias.');
      return;
    }
    
    // Seguir para a próxima etapa
    router.push(`/booking/${professionalId}/client`);
  };
  
  // Verificação para renderização condicional
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
        <title>Opções adicionais | Agenda Livre</title>
        <meta name="description" content="Escolha opções adicionais para seu agendamento" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-6">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <Link href={`/booking/${professionalId}/datetime`} className="mr-3 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
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
                  i <= 3 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 5 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    i < 3 
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
              <h2 className="text-lg font-medium">Adicione detalhes</h2>
              <div className="text-sm text-gray-500">
                {bookingState.service.name} - {formattedDate} às {bookingState.time}
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-sm text-gray-500 mb-3">OPÇÕES ADICIONAIS</h3>
          
          <ToggleOption 
            label="Usar cabelo próprio" 
            value={useOwnHair} 
            onChange={handleToggleOwnHair} 
          />
          
          {!useOwnHair && (
            <>
              <h3 className="font-medium text-sm text-gray-500 mb-3">COMPRIMENTO DO CABELO</h3>
              <RadioOption 
                options={[
                  { label: 'Curto', value: 'small' },
                  { label: 'Médio', value: 'medium' },
                  { label: 'Longo', value: 'large' }
                ]}
                selected={hairLength}
                onChange={handleHairLengthChange}
              />
              <div className="mb-5 px-1 text-sm text-gray-500">
                Preço do cabelo: R$ {bookingState.professional.hairPrices[hairLength].toFixed(2)}
              </div>
            </>
          )}
          
          <ToggleOption 
            label={`Serviço a domicílio (+R$ ${bookingState.professional.homeServiceFee.toFixed(2)})`} 
            value={homeService} 
            onChange={handleHomeServiceToggle} 
          />
          
          {homeService && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço completo
              </label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="Rua, número, complemento" 
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
              />
            </div>
          )}
          
          <ToggleOption 
            label="Possuo alergias" 
            value={hasAllergies} 
            onChange={handleAllergiesToggle} 
          />
          
          {hasAllergies && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva suas alergias
              </label>
              <textarea 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                rows={2}
                placeholder="Ex: alergia a látex, óleos essenciais..."
                value={allergiesDescription}
                onChange={(e) => handleAllergiesDescriptionChange(e.target.value)}
              />
            </div>
          )}
          
          <div className="mt-6 bg-purple-50 p-4 rounded-xl">
            <h3 className="font-medium mb-3">Resumo do pedido</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{bookingState.service.name}</span>
                <span>R$ {bookingState.service.price.toFixed(2)}</span>
              </div>
              
              {homeService && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de deslocamento</span>
                  <span>R$ {bookingState.professional.homeServiceFee.toFixed(2)}</span>
                </div>
              )}
              
              {!useOwnHair && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Cabelo ({hairLength === 'small' ? 'Curto' : hairLength === 'medium' ? 'Médio' : 'Longo'})
                  </span>
                  <span>R$ {bookingState.professional.hairPrices[hairLength].toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl mt-6"
            onClick={handleContinue}
          >
            Prosseguir para seus dados
          </button>
        </div>
      </div>
    </>
  );
}