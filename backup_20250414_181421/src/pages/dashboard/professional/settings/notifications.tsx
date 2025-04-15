// src/services/notification.ts
import api from './api';
import { Notification } from '../types/notification';
import { mockNotifications } from '../utils/mockData';

// Obter todas as notificações do usuário
export const getNotifications = async (): Promise<Notification[]> => {
  // Em ambiente de desenvolvimento, retorna dados mockados
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockNotifications), 500);
    });
  }
  
  // Em produção, faz a chamada real à API
  const response = await api.get('/notifications/');
  return response.data;
};

// Marcar notificação como lida
export const markAsRead = async (notificationId: string): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.post(`/notifications/${notificationId}/read/`);
};

// Marcar todas as notificações como lidas
export const markAllAsRead = async (): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.post('/notifications/read-all/');
};

// Excluir uma notificação
export const deleteNotification = async (notificationId: string): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.delete(`/notifications/${notificationId}/`);
};

// Registrar token de push notification
export const registerPushToken = async (token: string): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.post('/notifications/push-token/', { token });
};