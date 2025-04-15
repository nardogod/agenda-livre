// src/services/calendar.ts
import api from './api';

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  name: string;
  email: string;
  connected: boolean;
  lastSynced?: string;
}

export interface SyncResult {
  syncedEvents: number;
  conflicts: number;
  success: boolean;
}

/**
 * Conecta com um calendário externo
 */
export const connectCalendar = async (
  provider: 'google' | 'outlook' | 'apple',
  authCode: string
): Promise<CalendarIntegration> => {
  const response = await api.post('/calendar/integrations/', {
    provider,
    authCode
  });
  return response.data;
};

/**
 * Desconecta um calendário externo
 */
export const disconnectCalendar = async (integrationId: string): Promise<void> => {
  await api.delete(`/calendar/integrations/${integrationId}/`);
};

/**
 * Lista todas as integrações de calendário
 */
export const getCalendarIntegrations = async (): Promise<CalendarIntegration[]> => {
  const response = await api.get('/calendar/integrations/');
  return response.data;
};

/**
 * Sincroniza eventos com o calendário externo
 */
export const syncCalendarEvents = async (integrationId: string): Promise<SyncResult> => {
  const response = await api.post(`/calendar/integrations/${integrationId}/sync/`);
  return response.data;
};

/**
 * Configura as preferências de sincronização
 */
export const updateSyncPreferences = async (
  integrationId: string, 
  preferences: {
    autoSync: boolean;
    syncPast: boolean;
    syncFutureDays: number;
  }
): Promise<void> => {
  await api.patch(`/calendar/integrations/${integrationId}/preferences/`, preferences);
};