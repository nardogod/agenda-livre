// src/contexts/BookingContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Tipos para o contexto de agendamento
interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  has_hair_option?: boolean;
  hair_price_small?: number;
  hair_price_medium?: number;
  hair_price_large?: number;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  profileImage: string;
}

interface BookingData {
  professional: Professional | null;
  service: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  useOwnHair: boolean;
  hairLength: 'small' | 'medium' | 'large' | null;
  isHomeService: boolean;
  address: string | null;
  hasAllergies: boolean;
  allergiesDescription: string | null;
  clientData: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  } | null;
  paymentMethod: 'credit_card' | 'pix' | null;
}

interface BookingContextType {
  bookingData: BookingData;
  isLoading: boolean;
  error: string | null;
  step: number;
  
  // Métodos para atualizar o estado
  setProfessional: (professional: Professional) => void;
  setService: (service: Service) => void;
  setDateTime: (date: Date, time: string) => void;
  setAdditionalOptions: (options: {
    useOwnHair: boolean;
    hairLength?: 'small' | 'medium' | 'large';
    isHomeService: boolean;
    address?: string;
    hasAllergies: boolean;
    allergiesDescription?: string;
  }) => void;
  setClientData: (data: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
  }) => void;
  setPaymentMethod: (method: 'credit_card' | 'pix') => void;
  
  // Navegação entre etapas
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Cálculo de preço
  calculateTotal: () => number;
  
  // Submissão do agendamento
  submitBooking: () => Promise<boolean>;
  resetBooking: () => void;
}

// Criar o contexto
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Valores iniciais
const initialBookingData: BookingData = {
  professional: null,
  service: null,
  selectedDate: null,
  selectedTime: null,
  useOwnHair: true,
  hairLength: null,
  isHomeService: false,
  address: null,
  hasAllergies: false,
  allergiesDescription: null,
  clientData: null,
  paymentMethod: null
};

// Provider que gerencia o estado de agendamento
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  
  const router = useRouter();
  
  // Efeito para carregar dados iniciais do profissional se o ID estiver disponível
  useEffect(() => {
    const { professionalId } = router.query;
    
    if (professionalId && typeof professionalId === 'string' && !bookingData.professional) {
      loadProfessionalData(professionalId);
    }
  }, [router.query]);
  
  // Função para carregar dados do profissional
  const loadProfessionalData = async (professionalId: string) => {
    try {
      setIsLoading(true);
      
      // Na versão final, isso seria uma chamada API real
      // Simulando uma chamada com timeout para fins de demonstração
      setTimeout(() => {
        const mockProfessional = {
          id: parseInt(professionalId),
          name: "Ana Oliveira",
          specialty: "Especialista em Tranças e Penteados",
          profileImage: "/api/placeholder/300/300",
        };
        
        setBookingData(prev => ({
          ...prev,
          professional: mockProfessional
        }));
        
        setIsLoading(false);
      }, 500);
      
    } catch (err) {
      setError("Erro ao carregar dados do profissional");
      setIsLoading(false);
      console.error("Erro:", err);
    }
  };
  
  // Métodos para atualizar o estado
  const setProfessional = (professional: Professional) => {
    setBookingData(prev => ({ ...prev, professional }));
  };
  
  const setService = (service: Service) => {
    setBookingData(prev => ({ ...prev, service }));
  };
  
  const setDateTime = (date: Date, time: string) => {
    setBookingData(prev => ({ 
      ...prev, 
      selectedDate: date,
      selectedTime: time 
    }));
  };
  
  const setAdditionalOptions = (options: {
    useOwnHair: boolean;
    hairLength?: 'small' | 'medium' | 'large';
    isHomeService: boolean;
    address?: string;
    hasAllergies: boolean;
    allergiesDescription?: string;
  }) => {
    setBookingData(prev => ({
      ...prev,
      useOwnHair: options.useOwnHair,
      hairLength: options.hairLength || null,
      isHomeService: options.isHomeService,
      address: options.address || null,
      hasAllergies: options.hasAllergies,
      allergiesDescription: options.allergiesDescription || null
    }));
  };
  
  const setClientData = (data: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
  }) => {
    setBookingData(prev => ({
      ...prev,
      clientData: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes || ''
      }
    }));
  };
  
  const setPaymentMethod = (method: 'credit_card' | 'pix') => {
    setBookingData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };
  
  // Navegação entre etapas
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => (prev > 0 ? prev - 1 : prev));
  };
  
  const goToStep = (newStep: number) => {
    setStep(newStep);
  };
  
  // Cálculo do preço total
  const calculateTotal = (): number => {
    if (!bookingData.service) return 0;
    
    let total = bookingData.service.price;
    
    // Adicionar taxa de serviço em domicílio
    if (bookingData.isHomeService) {
      total += 50; // Valor fixo de taxa de deslocamento
    }
    
    // Adicionar preço do cabelo se não for próprio
    if (!bookingData.useOwnHair && bookingData.hairLength && bookingData.service.has_hair_option) {
      const hairPriceKey = `hair_price_${bookingData.hairLength}` as 'hair_price_small' | 'hair_price_medium' | 'hair_price_large';
      const hairPrice = bookingData.service[hairPriceKey] || 0;
      total += hairPrice;
    }
    
    return total;
  };
  
  // Submissão do agendamento
  const submitBooking = async (): Promise<boolean> => {
    // Validar se todos os dados necessários estão preenchidos
    if (!bookingData.professional || 
        !bookingData.service || 
        !bookingData.selectedDate || 
        !bookingData.selectedTime || 
        !bookingData.clientData || 
        !bookingData.paymentMethod) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Na versão final, isso seria uma chamada API real
      // Simulando uma chamada com timeout para fins de demonstração
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Dados do agendamento enviados:", bookingData);
          setIsLoading(false);
          resolve(true);
        }, 1500);
      });
      
    } catch (err) {
      setError("Erro ao enviar agendamento");
      setIsLoading(false);
      console.error("Erro:", err);
      return false;
    }
  };
  
  // Resetar todo o estado de agendamento
  const resetBooking = () => {
    setBookingData(initialBookingData);
    setStep(0);
    setError(null);
  };
  
  // Disponibilizar todos os valores e métodos no contexto
  const value = {
    bookingData,
    isLoading,
    error,
    step,
    setProfessional,
    setService,
    setDateTime,
    setAdditionalOptions,
    setClientData,
    setPaymentMethod,
    nextStep,
    prevStep,
    goToStep,
    calculateTotal,
    submitBooking,
    resetBooking
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  
  if (context === undefined) {
    throw new Error('useBooking deve ser usado dentro de um BookingProvider');
  }
  
  return context;
};

export default BookingContext;