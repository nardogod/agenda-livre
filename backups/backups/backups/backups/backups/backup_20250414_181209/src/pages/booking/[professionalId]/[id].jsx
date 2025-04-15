// pages/booking/[id].jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Calendar, 
  Clock, 
  Star, 
  ChevronLeft, 
  CreditCard, 
  Check, 
  Home, 
  AlertCircle 
} from 'lucide-react';

// Componentes
import MainButton from '../../components/common/MainButton';
import ServiceCard from '../../components/booking/ServiceCard';
import TimeSlot from '../../components/booking/TimeSlot';
import ToggleOption from '../../components/booking/ToggleOption';
import RadioOption from '../../components/booking/RadioOption';
import PaymentMethod from '../../components/booking/PaymentMethod';

// Mock data (seria substituído pela API)
const stylistMock = {
  id: 1,
  name: "Ana Oliveira",
  specialty: "Especialista em Tranças e Penteados",
  rating: 4.8,
  profileImage: "/api/placeholder/300/300",
  
  services: [
    { id: 1, name: "Box Braids", price: 250, duration: 180 },
    { id: 2, name: "Twist Senegalês", price: 290, duration: 240 },
    { id: 3, name: "Penteado para Festa", price: 150, duration: 90 },
    { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60 }
  ],
  
  availableTimes: ["09:00", "11:30", "14:00", "16:30"],
  
  paymentMethods: [
    { 
      id: 'credit', 
      name: 'Cartão de Crédito', 
      description: 'Visa, MasterCard, Elo, Hipercard',
      icon: <CreditCard size={24} className="ml-auto text-gray-400" />
    } else if (step === 4) {
      return (
        <div>
          <div className="flex items-center mb-6">
            <button 
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setStep(3)}
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-medium">Pagamento</h2>
              <div className="text-sm text-gray-500">R$ {calculateTotal().toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mb-5 bg-purple-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{selectedService.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                </div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-sm text-gray-500 mb-4">MÉTODO DE PAGAMENTO</h3>
          
          {stylist.paymentMethods.map(method => (
            <PaymentMethod 
              key={method.id}
              method={method}
              selected={selectedPaymentMethod === method.id}
              onSelect={setSelectedPaymentMethod}
            />
          ))}
          
          {selectedPaymentMethod === 'credit' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do cartão
                </label>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentDataChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                />
              </div>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade
                  </label>
                  <input 
                    type="text" 
                    name="expiry"
                    value={paymentData.expiry}
                    onChange={handlePaymentDataChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input 
                    type="text" 
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handlePaymentDataChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no cartão
                </label>
                <input 
                  type="text" 
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handlePaymentDataChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Como está impresso no cartão" 
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
          
          <MainButton 
            className="w-full mt-6"
            disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'credit' && (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.cardName))}
            onClick={() => {
              if (selectedPaymentMethod) {
                setStep(5);
              }
            }}
          >
            {selectedPaymentMethod === 'credit' ? "Pagar agora" : "Confirmar pagamento"}
          </MainButton>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Ao confirmar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      );
    } else if (step === 5) {
      return (
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
              <h3 className="font-medium">{selectedService.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
              </p>
            </div>
            
            <div className="flex items-center py-3 border-t">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={stylist.profileImage} 
                  alt={stylist.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h4 className="font-medium">{stylist.name}</h4>
                <p className="text-xs text-gray-500">{stylist.specialty}</p>
              </div>
            </div>
            
            {homeService && (
              <div className="flex items-center mt-3 bg-gray-50 p-3 rounded-lg">
                <Home size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">Serviço a domicílio</span>
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
          
          <MainButton 
            className="w-full"
            onClick={() => router.push('/')}
          >
            Voltar para a página inicial
          </MainButton>
        </div>
      );
    } else if (step === 2) {
      return (
        <div>
          <div className="flex items-center mb-6">
            <button 
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setStep(1)}
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-medium">Adicione detalhes</h2>
              <div className="text-sm text-gray-500">{selectedService.name} - {selectedTime}</div>
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
                options={[
                  { label: 'Curto', value: 'small' },
                  { label: 'Médio', value: 'medium' },
                  { label: 'Longo', value: 'large' }
                ]}
                selected={hairLength}
                onChange={setHairLength}
              />
              <div className="mb-5 px-1 text-sm text-gray-500">
                Preço do cabelo: R$ {stylist.additionalOptions.hairPrice[hairLength].toFixed(2)}
              </div>
            </>
          )}
          
          <ToggleOption 
            label={`Serviço a domicílio (+R$ ${stylist.additionalOptions.homeServiceFee.toFixed(2)})`} 
            value={homeService} 
            onChange={setHomeService} 
          />
          
          {homeService && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço completo
              </label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                placeholder="Rua, número, complemento" 
              />
            </div>
          )}
          
          <ToggleOption 
            label="Possuo alergias" 
            value={allergies} 
            onChange={setAllergies} 
          />
          
          {allergies && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva suas alergias
              </label>
              <textarea 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                rows="2"
                placeholder="Ex: alergia a látex, óleos essenciais..."
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
              />
            </div>
          )}
          
          <div className="mt-6 bg-purple-50 p-4 rounded-xl">
            <h3 className="font-medium mb-3">Resumo do pedido</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{selectedService.name}</span>
                <span>R$ {selectedService.price.toFixed(2)}</span>
              </div>
              
              {homeService && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de deslocamento</span>
                  <span>R$ {stylist.additionalOptions.homeServiceFee.toFixed(2)}</span>
                </div>
              )}
              
              {!useOwnHair && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabelo ({hairLength === 'small' ? 'Curto' : hairLength === 'medium' ? 'Médio' : 'Longo'})</span>
                  <span>R$ {stylist.additionalOptions.hairPrice[hairLength].toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <MainButton 
            className="w-full mt-6"
            onClick={() => setStep(3)}
          >
            Prosseguir para seus dados
          </MainButton>
        </div>
      );
    } else if (step === 3) {
      return (
        <div>
          <div className="flex items-center mb-6">
            <button 
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setStep(2)}
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-medium">Preencha seus dados</h2>
              <div className="text-sm text-gray-500">{selectedService.name} - {selectedTime}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input 
                type="text" 
                name="name"
                value={personalData.name}
                onChange={handlePersonalDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                placeholder="Digite seu nome" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input 
                type="tel" 
                name="phone"
                value={personalData.phone}
                onChange={handlePersonalDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                placeholder="(11) 99999-9999" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input 
                type="email"
                name="email"
                value={personalData.email}
                onChange={handlePersonalDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                placeholder="seu@email.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea 
                name="notes"
                value={personalData.notes}
                onChange={handlePersonalDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                rows="2"
                placeholder="Alguma observação para a profissional?" 
              />
            </div>
            
            <div className="pt-4">
              <MainButton 
                className="w-full"
                disabled={!personalData.name || !personalData.phone || !personalData.email}
                onClick={() => setStep(4)}
              >
                Ir para pagamento
              </MainButton>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Campos de nome, telefone e e-mail são obrigatórios
              </p>
            </div>
          </div>
        </div>
      );
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
  ],
  
  additionalOptions: {
    homeServiceFee: 50,
    hairPrice: {
      small: 60,
      medium: 80,
      large: 120
    }
  }
};

export default function BookingFlow() {
  const router = useRouter();
  const { id, service: preSelectedServiceId } = router.query;
  
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [useOwnHair, setUseOwnHair] = useState(true);
  const [homeService, setHomeService] = useState(false);
  const [allergies, setAllergies] = useState(false);
  const [allergiesText, setAllergiesText] = useState("");
  const [hairLength, setHairLength] = useState("medium");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  
  // Adicionar campos de formulário para dados pessoais
  const [personalData, setPersonalData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  
  // Adicionar campos para dados de pagamento
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: ""
  });
  
  // Aqui seria feita a chamada à API para buscar os dados do profissional
  // useEffect(() => {
  //   if (id) {
  //     fetchProfessionalData(id).then(...)
  //   }
  // }, [id]);
  
  // Setar o serviço pré-selecionado se vier da URL
  useEffect(() => {
    if (preSelectedServiceId && stylistMock.services) {
      const service = stylistMock.services.find(
        s => s.id.toString() === preSelectedServiceId.toString()
      );
      if (service) {
        setSelectedService(service);
        setStep(1); // Avançar para seleção de data/hora
      }
    }
  }, [preSelectedServiceId, stylistMock.services]);
  
  const stylist = stylistMock; // Seria substituído pelos dados da API
  
  // Função para calcular o valor total
  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    let total = selectedService.price;
    
    // Adicionar taxa de serviço a domicílio se selecionada
    if (homeService) {
      total += stylist.additionalOptions.homeServiceFee;
    }
    
    // Adicionar preço do cabelo se não estiver usando o próprio
    if (!useOwnHair) {
      total += stylist.additionalOptions.hairPrice[hairLength];
    }
    
    return total;
  };
  
  // Função para formatar entrada do cartão
  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  
  // Função para formatar data de validade
  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2');
  };
  
  // Função para lidar com mudanças nos campos de dados pessoais
  const handlePersonalDataChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Função para lidar com mudanças nos campos de pagamento
  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    }
    
    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };
  
  // Renderizar seletor de datas
  const renderDateSelector = () => {
    const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return (
      <div className="flex overflow-x-auto py-3">
        {dates.map((date, idx) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={idx}
              className={`flex flex-col items-center justify-center mr-4 w-12 h-16 rounded-xl ${
                isSelected ? "bg-purple-600 text-white" : "bg-white text-gray-700"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-xs font-medium mb-1">{days[date.getDay()]}</span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    );
  };
  
  // Renderizar conteúdo com base na etapa atual
  const renderBookingStep = () => {
    if (step === 0) {
      return (
        <div>
          <h2 className="text-lg font-medium mb-4">Selecione um serviço</h2>
          <div className="space-y-3">
            {stylist.services.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onSelect={(service) => {
                  setSelectedService(service);
                  setStep(1);
                }}
              />
            ))}
          </div>
        </div>
      );
    } else if (step === 1) {
      return (
        <div>
          <div className="flex items-center mb-6">
            <button 
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setStep(0)}
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-medium">Escolha data e horário</h2>
              <div className="text-sm text-gray-500">{selectedService.name}</div>
            </div>
          </div>
          
          <div className="bg-white px-4 py-3 rounded-xl mb-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{selectedService.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{selectedService.duration} min</div>
              </div>
              <div className="text-purple-600 font-medium">
                R$ {selectedService.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          {renderDateSelector()}
          
          <h3 className="font-medium text-sm mt-6 mb-3">HORÁRIOS DISPONÍVEIS</h3>
          <div className="flex flex-wrap">
            {stylist.availableTimes.map((time, idx) => (
              <TimeSlot 
                key={idx} 
                time={time} 
                selected={time === selectedTime}
                onSelect={() => setSelectedTime(time)}
              />
            ))}
          </div>
          
          <MainButton 
            className="w-full mt-8"
            disabled={!selectedTime}
            onClick={() => selectedTime && setStep(2)}
          >
            Continuar
          </MainButton>
        </div>
      );
    }