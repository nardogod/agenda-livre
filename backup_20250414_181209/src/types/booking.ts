// Tipos para agendamentos

export type HairLength = 'small' | 'medium' | 'large';

export type BookingStatus = 
  | 'pending_payment' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export type PaymentMethod = 'credit_card' | 'pix';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type Payment = {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  paymentUrl?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
};

export type BookingOptions = {
  useOwnHair: boolean;
  hairLength?: HairLength;
  isHomeService: boolean;
  address?: string;
  hasAllergies: boolean;
  allergiesDescription?: string;
  notes?: string;
};

export type Booking = {
  id: string;
  professionalId: string;
  professionalName?: string;
  clientId: string;
  serviceId: string;
  serviceName: string;
  startDatetime: string;
  endDatetime: string;
  options: BookingOptions;
  status: BookingStatus;
  servicePriceBase: number;
  hairPrice: number;
  homeServiceFee: number;
  totalPrice: number;
  payment?: Payment;
  createdAt: string;
  updatedAt?: string;
};

// Tipo para o processo de agendamento em andamento
export type BookingProcess = {
  step: number;
  professionalId: string;
  selectedService?: string;
  selectedDate?: Date;
  selectedTime?: string;
  options: BookingOptions;
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod?: PaymentMethod;
  pricing?: {
    servicePrice: number;
    hairPrice: number;
    homeServiceFee: number;
    totalPrice: number;
  };
};