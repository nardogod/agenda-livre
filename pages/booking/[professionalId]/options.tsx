import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Head from 'next/head';

// Componente Toggle
const ToggleOption = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl mb-3">
    <span className="font-medium">{label}</span>
    <div 
      className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${value ? 'bg-purple-600' : 'bg-gray-300'}`}
      onClick={() => onChange(!value)}
    >
      <div 
        className={`w-4 h-4 rounded-full bg-white transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0'}`} 
      />
    </div>
  </div>
);

// Componente Radio
const RadioOption = ({ options, selected, onChange }) => (
  <div className="flex bg-white rounded-xl mb-3 overflow-hidden">
    {options.map((option, idx) => (
      <button
        key={idx}
        className={`flex-1 py-3 text-sm ${
          selected === option.value 
            ? "bg-purple-600 text-white" 
            : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default function OptionsPage() {
  const router = useRouter();
  const { professionalId } = router.query;
  
  const [useOwnHair, setUseOwnHair] = useState(true);
  const [hairLength, setHairLength] = useState('medium');
  const [isHomeService, setIsHomeService] = useState(false);
  const [address, setAddress] = useState('');
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergiesDescription, setAllergiesDescription] = useState('');
  const [service, setService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Mock de dados (em uma implementação real, viria do Context)
  useEffect(() => {
    // Simulando dados anteriores
    setService({
      id: 1,
      name: "Box Braids",
      price: 250,
      duration: 180
    });
    setSelectedTime("14:00");
  }, []);
  
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
  
  const handleContinue = () => {
    // Em uma implementação real, salvaria no contexto
    console.log("Opções selecionadas:", {
      useOwnHair,
      hairLength: useOwnHair ? null : hairLength,
      isHomeService,
      address: isHomeService ? address : null,
      hasAllergies,
      allergiesDescription: hasAllergies ? allergiesDescription : null
    });
    
    // Navegar para a próxima etapa
    router.push(`/booking/${professionalId}/client`);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // Calcular preço total
  const calculateTotal = () => {
    if (!service) return 0;
    
    let total = service.price;
    
    // Adicionar taxa de serviço em domicílio
    if (isHomeService) {
      total += 50; // Valor fixo de taxa de deslocamento
    }
    
    // Adicionar preço do cabelo se não for próprio
    if (!useOwnHair && hairLength) {
      total += hairPrices[hairLength];
    }
    
    return total;
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Head>
        <title>Opções Adicionais | Agenda Livre</title>
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
            <h2 className="text-lg font-medium">Adicione detalhes</h2>
            {service && selectedTime && (
              <div className="text-sm text-gray-500">
                {service.name} - {selectedTime}
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
              options={hairLengthOptions}
              selected={hairLength}
              onChange={setHairLength}
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
            {service && (
              <div className="flex justify-between">
                <span className="text-gray-600">{service.name}</span>
                <span>R$ {service.price.toFixed(2)}</span>
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
    </div>
  );
}