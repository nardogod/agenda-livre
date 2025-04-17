import React, { createContext, useContext, useReducer } from 'react';
import { Professional, Service } from '../services/api';

// Interface para o estado de agendamento
interface BookingState {
  professional: Professional | null;
  service: Service | null;
  date: string | null;
  time: string | null;
  useOwnHair: boolean;
  hairLength: 'small' | 'medium' | 'large' | null;
  isHomeService: boolean;
  address: string | null;
  hasAllergies: boolean;
  allergiesDescription: string | null;
  notes: string | null;
  totalPrice: number;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  paymentMethod: 'credit_card' | 'pix' | null;
}

// Estado inicial
const initialState: BookingState = {
  professional: null,
  service: null,
  date: null,
  time: null,
  useOwnHair: true,
  hairLength: null,
  isHomeService: false,
  address: null,
  hasAllergies: false,
  allergiesDescription: null,
  notes: null,
  totalPrice: 0,
  clientName: null,
  clientPhone: null,
  clientEmail: null,
  paymentMethod: null,
};

// Tipos de ações
type BookingAction =
  | { type: 'SET_PROFESSIONAL'; payload: Professional }
  | { type: 'SET_SERVICE'; payload: Service }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'SET_USE_OWN_HAIR'; payload: boolean }
  | { type: 'SET_HAIR_LENGTH'; payload: 'small' | 'medium' | 'large' | null }
  | { type: 'SET_HOME_SERVICE'; payload: boolean }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_HAS_ALLERGIES'; payload: boolean }
  | { type: 'SET_ALLERGIES_DESCRIPTION'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_CLIENT_INFO'; payload: { name: string; phone: string; email: string } }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'credit_card' | 'pix' }
  | { type: 'UPDATE_TOTAL_PRICE'; payload: number }
  | { type: 'RESET_BOOKING' };

// Reducer
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_PROFESSIONAL':
      return { ...state, professional: action.payload };
    case 'SET_SERVICE':
      return { ...state, service: action.payload, totalPrice: action.payload.price };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'SET_TIME':
      return { ...state, time: action.payload };
    case 'SET_USE_OWN_HAIR':
      return { ...state, useOwnHair: action.payload };
    case 'SET_HAIR_LENGTH':
      return { ...state, hairLength: action.payload };
    case 'SET_HOME_SERVICE':
      return { ...state, isHomeService: action.payload };
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'SET_HAS_ALLERGIES':
      return { ...state, hasAllergies: action.payload };
    case 'SET_ALLERGIES_DESCRIPTION':
      return { ...state, allergiesDescription: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_CLIENT_INFO':
      return {
        ...state,
        clientName: action.payload.name,
        clientPhone: action.payload.phone,
        clientEmail: action.payload.email,
      };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'UPDATE_TOTAL_PRICE':
      return { ...state, totalPrice: action.payload };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
}

// Interface para o contexto
interface BookingContextType {
  bookingState: BookingState;
  setProfessional: (professional: Professional) => void;
  setService: (service: Service) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setUseOwnHair: (useOwnHair: boolean) => void;
  setHairLength: (hairLength: 'small' | 'medium' | 'large' | null) => void;
  setHomeService: (isHomeService: boolean) => void;
  setAddress: (address: string) => void;
  setHasAllergies: (hasAllergies: boolean) => void;
  setAllergiesDescription: (description: string) => void;
  setNotes: (notes: string) => void;
  setClientInfo: (name: string, phone: string, email: string) => void;
  setPaymentMethod: (method: 'credit_card' | 'pix') => void;
  updateTotalPrice: () => void;
  resetBooking: () => void;
  calculateTotal: () => number;
}

// Criação do contexto
const BookingContext = createContext<BookingContextType | null>(null);

// Provider
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialState);

  // Função para calcular o preço total
  const calculateTotal = (): number => {
    if (!bookingState.service || !bookingState.professional) return 0;

    let total = bookingState.service.price;

    // Adicionar taxa de serviço a domicílio
    if (bookingState.isHomeService && bookingState.professional.homeServiceFee) {
      total += bookingState.professional.homeServiceFee;
    }

    // Adicionar preço do cabelo se não estiver usando próprio cabelo
    if (!bookingState.useOwnHair && bookingState.hairLength && bookingState.professional.hairPrices) {
      total += bookingState.professional.hairPrices[bookingState.hairLength];
    }

    return total;
  };

  // Funções para atualizar o estado
  const setProfessional = (professional: Professional) => {
    dispatch({ type: 'SET_PROFESSIONAL', payload: professional });
  };

  const setService = (service: Service) => {
    dispatch({ type: 'SET_SERVICE', payload: service });
  };

  const setDate = (date: string) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const setTime = (time: string) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const setUseOwnHair = (useOwnHair: boolean) => {
    dispatch({ type: 'SET_USE_OWN_HAIR', payload: useOwnHair });
    updateTotalPrice();
  };

  const setHairLength = (hairLength: 'small' | 'medium' | 'large' | null) => {
    dispatch({ type: 'SET_HAIR_LENGTH', payload: hairLength });
    updateTotalPrice();
  };

  const setHomeService = (isHomeService: boolean) => {
    dispatch({ type: 'SET_HOME_SERVICE', payload: isHomeService });
    updateTotalPrice();
  };

  const setAddress = (address: string) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const setHasAllergies = (hasAllergies: boolean) => {
    dispatch({ type: 'SET_HAS_ALLERGIES', payload: hasAllergies });
  };

  const setAllergiesDescription = (description: string) => {
    dispatch({ type: 'SET_ALLERGIES_DESCRIPTION', payload: description });
  };

  const setNotes = (notes: string) => {
    dispatch({ type: 'SET_NOTES', payload: notes });
  };

  const setClientInfo = (name: string, phone: string, email: string) => {
    dispatch({
      type: 'SET_CLIENT_INFO',
      payload: { name, phone, email },
    });
  };

  const setPaymentMethod = (method: 'credit_card' | 'pix') => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const updateTotalPrice = () => {
    const total = calculateTotal();
    dispatch({ type: 'UPDATE_TOTAL_PRICE', payload: total });
  };

  const resetBooking = () => {
    dispatch({ type: 'RESET_BOOKING' });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setProfessional,
        setService,
        setDate,
        setTime,
        setUseOwnHair,
        setHairLength,
        setHomeService,
        setAddress,
        setHasAllergies,
        setAllergiesDescription,
        setNotes,
        setClientInfo,
        setPaymentMethod,
        updateTotalPrice,
        resetBooking,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook para usar o contexto
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};