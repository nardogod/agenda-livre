// src/services/calendar.ts
import api from './api';
import { mockCalendarIntegrations } from '../utils/mockData';

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  isConnected: boolean;
  lastSyncedAt: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId: string;
  externalId?: string;
}

// Obter todas as integrações de calendário do profissional
export const getCalendarIntegrations = async (): Promise<CalendarIntegration[]> => {
  // Em ambiente de desenvolvimento, retorna dados mockados
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCalendarIntegrations), 500);
    });
  }
  
  const response = await api.get('/calendar/integrations/');
  return response.data;
};

// Iniciar fluxo de autorização com provedor (Google, etc.)
export const initiateCalendarAuth = async (provider: 'google' | 'outlook' | 'apple'): Promise<{ authUrl: string }> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      // URL de mock que seria redirecionada para o provedor
      const mockAuthUrl = `https://example.com/auth/${provider}?mock=true&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard/professional/settings/calendar')}`;
      setTimeout(() => resolve({ authUrl: mockAuthUrl }), 300);
    });
  }
  
  const response = await api.post('/calendar/auth/initiate/', { provider });
  return response.data;
};

// Completar o fluxo de autorização (chamado após o redirect do provedor)
export const completeCalendarAuth = async (provider: string, code: string): Promise<CalendarIntegration> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      const mockIntegration: CalendarIntegration = {
        id: Date.now().toString(),
        provider: provider as 'google' | 'outlook' | 'apple',
        isConnected: true,
        lastSyncedAt: new Date().toISOString()
      };
      setTimeout(() => resolve(mockIntegration), 500);
    });
  }
  
  const response = await api.post('/calendar/auth/complete/', { provider, code });
  return response.data;
};

// Desconectar uma integração de calendário
export const disconnectCalendar = async (integrationId: string): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.delete(`/calendar/integrations/${integrationId}/`);
};

// Sincronizar eventos do calendário
export const syncCalendarEvents = async (integrationId: string): Promise<{ added: number; updated: number; removed: number }> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      const result = {
        added: Math.floor(Math.random() * 5),
        updated: Math.floor(Math.random() * 3),
        removed: Math.floor(Math.random() * 2)
      };
      setTimeout(() => resolve(result), 800);
    });
  }
  
  const response = await api.post(`/calendar/integrations/${integrationId}/sync/`);
  return response.data;
};

// Exportar um agendamento para o calendário conectado
export const exportAppointmentToCalendar = async (
  appointmentId: string, 
  integrationId: string
): Promise<{ success: boolean; eventId?: string }> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      const result = {
        success: true,
        eventId: `event-${Date.now()}`
      };
      setTimeout(() => resolve(result), 500);
    });
  }
  
  const response = await api.post(`/appointments/${appointmentId}/export-to-calendar/`, {
    integration_id: integrationId
  });
  return response.data;
};