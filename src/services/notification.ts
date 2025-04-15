// src/services/notification.ts
import api from './api';
import { Notification } from '../contexts/NotificationContext';

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get<Notification[]>('/notifications/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }
};

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await api.patch<Notification>(`/notifications/${id}/read/`);
  return response.data;
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  await api.delete(`/notifications/${id}/`);
  return true;
};

export const markAllAsRead = async (): Promise<boolean> => {
  await api.post('/notifications/mark-all-read/');
  return true;
};