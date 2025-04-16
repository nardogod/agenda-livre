// src/pages/booking/[professionalId]/options.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import ToggleOption from '../../../components/booking/ToggleOption';
import RadioOption from '../../../components/booking/RadioOption';
import MainLayout from '../../../components/layout/MainLayout';

const OptionsPage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  const { 
    bookingData, 
    setAdditionalOptions, 
    nextStep,
    prevStep,
    calculateTotal
  } = useBooking();
  
  const [useOwnHair, setUseOwnHair] = useState(true);
  const [hairLength, setHairLength] = useState<'small' | 'medium' | 'large'>('medium');
  const [isHomeService, setIsHomeService] = useState(false);
  const [address, setAddress] = useState('');
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergiesDescription, setAllergiesDescription] = useState('');
  
  // Redirecionar se não houver data/hora selecionados
  useEffect(() => {
    if (!bookingData.selectedDate || !bookingData.selectedTime) {
      router.replace(`/booking/${professionalId}/datetime`);
    } else {
      // Inicializar estado com valores existentes, se houver
      setUseOwnHair(bookingData.useOwnHair);
      setHairLength(bookingData.hairLength || 'medium');
      setIsHomeService(bookingData.isHomeService);
      setAddress(bookingData.address || '');
      setHasAllergies(bookingData.hasAllergies);
      setAllergiesDescription(bookingData.allergiesDescription || '');
    }
  }, [bookingData, professionalId, router]);
  
  const handleContinue = () => {
    setAdditionalOptions({
      useOwnHair,
      hairLength: !useOwnHair ? hairLength : undefined,
      isHomeService,
      address: isHomeService ? address : undefined,
      hasAllergies,
      allergiesDescription: hasAllergies ? allergiesDescription : undefined
    });
    
    nextStep();
    router.push(`/booking/${professionalId}/client`);
  };
  
  const handleBack = () => {
    prevStep();
    router.back();
  };
  
  // Opções para o comprimento do cabelo
  const hairLengthOptions = [
    { label: 'Curto', value: 'small' },
    { label: 'Médio', value: 'medium' },
    { label: 'Longo', value: 'large' }
  ];
  
  // Preços de referência para mostrar na interface
  const hairPrices = {
    small: 60,
    medium: 80,
    large: 120
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
            <h2 className="text-lg font-medium">Adicione detalhes</h2>
            {bookingData.service && bookingData.selectedTime && (
              <div className="text-sm text-gray-500">
                {bookingData.service.name} - {bookingData.selectedTime}
              </div>
            )}
          </div>
        </div>
        
        <h3 className="font-medium text-sm text-gray-500 mb-3">OPÇÕES ADICIONAIS</h3>
        
        <ToggleOption 
          label="Usar cabelo próprio" 
          value={useOwnHair} 
          onChange={setUseOwnHair} 
        />
        
        {!useOwnHair && (
          <>
            <h3 className="font-medium text-sm text-gray-500 mb-3">COMPRIMENTO DO CABELO</h3>
            <RadioOption 
              options={hairLengthOptions.map(option => ({
                ...option,
                value: option.value as 'small' | 'medium' | 'large'
              }))}
              selected={hairLength}
              onChange={(value) => setHairLength(value as 'small' | 'medium' | 'large')}
            />
            <div className="mb-5 px-1 text-sm text-gray-500">
              Preço do cabelo: R$ {hairPrices[hairLength].toFixed(2)}
            </div>
          </>
        )}
        
        <ToggleOption 
          label="Serviço a domicílio (+R$ 50,00)" 
          value={isHomeService} 
          onChange={setIsHomeService} 
        />
        
        {isHomeService && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço completo
            </label>
            <input 
              type="text" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl"
              placeholder="Rua, número, complemento" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}
        
        <ToggleOption 
          label="Possuo alergias" 
          value={hasAllergies} 
          onChange={setHasAllergies} 
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
              onChange={(e) => setAllergiesDescription(e.target.value)}
            />
          </div>
        )}
        
        <div className="mt-6 bg-purple-50 p-4 rounded-xl">
          <h3 className="font-medium mb-3">Resumo do pedido</h3>
          <div className="space-y-2 mb-3">
            {bookingData.service && (
              <div className="flex justify-between">
                <span className="text-gray-600">{bookingData.service.name}</span>
                <span>R$ {bookingData.service.price.toFixed(2)}</span>
              </div>
            )}
            
            {isHomeService && (
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de deslocamento</span>
                <span>R$ 50,00</span>
              </div>
            )}
            
            {!useOwnHair && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Cabelo ({hairLength === 'small' ? 'Curto' : hairLength === 'medium' ? 'Médio' : 'Longo'})
                </span>
                <span>R$ {hairPrices[hairLength].toFixed(2)}</span>
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
    </MainLayout>
  );
};

export default OptionsPage;