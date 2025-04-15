// src/services/payment.ts

import api from './api';

interface InitiatePaymentResponse {
  payment_id: string;
  payment_url?: string;
  status: string;
}

interface PaymentStatusResponse {
  payment_id: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  updated_at: string;
}

export async function initiatePayment(
  appointmentId: string, 
  paymentMethod: 'credit_card' | 'pix',
  paymentData?: any
): Promise<InitiatePaymentResponse> {
  try {
    const response = await api.post<InitiatePaymentResponse>(
      `/appointments/${appointmentId}/payment/`,
      {
        payment_method: paymentMethod,
        ...paymentData
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao iniciar pagamento para agendamento ${appointmentId}:`, error);
    throw error;
  }
}

export async function checkPaymentStatus(appointmentId: string): Promise<PaymentStatusResponse> {
  try {
    const response = await api.get<PaymentStatusResponse>(
      `/appointments/${appointmentId}/payment/status/`
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao verificar status do pagamento para agendamento ${appointmentId}:`, error);
    throw error;
  }
}

export async function processCreditCardPayment(
  appointmentId: string,
  cardData: {
    card_number: string;
    card_holder: string;
    expiration_date: string;
    cvv: string;
    installments?: number;
  }
): Promise<InitiatePaymentResponse> {
  return initiatePayment(appointmentId, 'credit_card', cardData);
}

export async function generatePixPayment(appointmentId: string): Promise<InitiatePaymentResponse> {
  return initiatePayment(appointmentId, 'pix');
}

// Para uso em desenvolvimento/testes
export async function simulatePaymentSuccess(appointmentId: string): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await api.post(`/dev/simulate-payment/${appointmentId}/success/`);
    } catch (error) {
      console.error(`Erro ao simular pagamento bem-sucedido para ${appointmentId}:`, error);
      throw error;
    }
  } else {
    throw new Error('Esta função só pode ser usada em ambiente de desenvolvimento');
  }
}